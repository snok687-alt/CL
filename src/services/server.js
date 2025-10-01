const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize the database
const db = new sqlite3.Database('./database.sqlite', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    // Create the views table if it doesn't exist
    db.run(`CREATE TABLE IF NOT EXISTS views (
      video_id TEXT PRIMARY KEY,
      view_count INTEGER DEFAULT 0
    )`, (createErr) => {
      if (createErr) {
        console.error('Error creating table:', createErr.message);
      } else {
        console.log('Views table is ready.');
      }
    });
  }
});

// API endpoint to record a view
app.post('/api/views/record', (req, res) => {
  const { video_id } = req.body;
  if (!video_id) {
    return res.status(400).json({ error: 'video_id is required' });
  }

  // Use UPSERT (INSERT OR REPLACE) to update the view count
  const sql = `INSERT INTO views (video_id, view_count) 
               VALUES (?, 1)
               ON CONFLICT(video_id) DO UPDATE SET view_count = view_count + 1`;
  
  db.run(sql, [video_id], function(err) {
    if (err) {
      console.error(`Error recording view for ${video_id}:`, err.message);
      res.status(500).json({ error: 'Failed to record view' });
    } else {
      console.log(`View recorded for video ${video_id}`);
      res.status(200).json({ message: 'View recorded successfully' });
    }
  });
});

// API endpoint to increment a view
app.post('/api/views/increment', (req, res) => {
  const { video_id } = req.body;
  if (!video_id) {
    return res.status(400).json({ error: 'video_id is required' });
  }

  const sql = `INSERT INTO views (video_id, view_count) 
               VALUES (?, 1)
               ON CONFLICT(video_id) DO UPDATE SET view_count = view_count + 1`;
  
  db.run(sql, [video_id], function(err) {
    if (err) {
      console.error(`Error incrementing view for ${video_id}:`, err.message);
      res.status(500).json({ error: 'Failed to increment view' });
    } else {
      console.log(`View incremented for video ${video_id}`);
      res.status(200).json({ message: 'View incremented successfully' });
    }
  });
});

// API endpoint to get view counts for multiple videos
app.post('/api/views/get', (req, res) => {
  const { video_ids } = req.body;
  if (!video_ids || !Array.isArray(video_ids) || video_ids.length === 0) {
    return res.status(400).json({ error: 'video_ids array is required' });
  }

  // Create a placeholder string for the SQL query
  const placeholders = video_ids.map(() => '?').join(', ');
  const sql = `SELECT video_id, view_count FROM views WHERE video_id IN (${placeholders})`;

  db.all(sql, video_ids, (err, rows) => {
    if (err) {
      console.error('Error fetching view counts:', err.message);
      return res.status(500).json({ error: 'Failed to fetch views' });
    }
    
    // Format the result into a key-value object
    const viewsData = {};
    rows.forEach(row => {
      viewsData[row.video_id] = row.view_count;
    });
    
    res.status(200).json(viewsData);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
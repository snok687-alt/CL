// backend/server.js
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// เชื่อมต่อ SQLite
const db = new sqlite3.Database('./views.db', (err) => {
  if (err) console.error('Error opening database:', err);
  else console.log('Database connected');
});

// สร้างตาราง
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS video_views (
      video_id TEXT PRIMARY KEY,
      view_count INTEGER DEFAULT 0
    )
  `);
});

// บันทึกวิว
app.post('/api/views/record', (req, res) => {
  const { video_id } = req.body;
  if (!video_id) return res.status(400).json({ error: 'Missing video_id' });

  db.run(`
    INSERT INTO video_views (video_id, view_count) 
    VALUES (?, 1)
    ON CONFLICT(video_id) DO UPDATE SET view_count = view_count + 1
  `, [video_id], (err) => {
    if (err) {
      console.error('Error recording view:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ success: true });
  });
});

// ดึงยอดวิวหลายวิดีโอ
app.post('/api/views/get', (req, res) => {
  const { video_ids } = req.body;
  if (!Array.isArray(video_ids) || video_ids.length === 0) {
    return res.status(400).json({ error: 'Missing or invalid video_ids' });
  }

  const placeholders = video_ids.map(() => '?').join(',');
  db.all(`
    SELECT video_id, view_count FROM video_views 
    WHERE video_id IN (${placeholders})
  `, video_ids, (err, rows) => {
    if (err) {
      console.error('Error getting views:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    const viewsMap = rows.reduce((acc, row) => {
      acc[row.video_id] = row.view_count;
      return acc;
    }, {});
    res.json(viewsMap);
  });
});

// ดึงยอดวิววิดีโอเดียว
app.get('/api/views/get/:video_id', (req, res) => {
  const { video_id } = req.params;
  db.get('SELECT view_count FROM video_views WHERE video_id = ?', [video_id], (err, row) => {
    if (err) {
      console.error('Error getting view:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ view_count: row ? row.view_count : 0 });
  });
});

app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
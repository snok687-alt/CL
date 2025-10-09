// server.js
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// สร้าง MySQL connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root', // เปลี่ยนตามของคุณ
  password: '', // เปลี่ยนตามของคุณ
  database: 'video_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// สร้างตารางอัตโนมัติเมื่อเริ่มต้น
const initDatabase = async () => {
  try {
    const connection = await pool.getConnection();
    
    // สร้างตาราง video_views
    await connection.query(`
      CREATE TABLE IF NOT EXISTS video_views (
        id INT AUTO_INCREMENT PRIMARY KEY,
        video_id VARCHAR(50) NOT NULL UNIQUE,
        views INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_video_id (video_id),
        INDEX idx_views (views)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // สร้างตาราง view_logs สำหรับบันทึกประวัติการดู
    await connection.query(`
      CREATE TABLE IF NOT EXISTS view_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        video_id VARCHAR(50) NOT NULL,
        ip_address VARCHAR(45),
        user_agent TEXT,
        viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_video_id (video_id),
        INDEX idx_viewed_at (viewed_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    console.log('✅ ตารางฐานข้อมูลพร้อมใช้งาน');
    connection.release();
  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาดในการสร้างตาราง:', error);
  }
};

// เรียกใช้เมื่อเริ่มต้น server
initDatabase();

// ==================== API ENDPOINTS ====================

// 1. บันทึกการดูวิดีโอ (เพิ่มยอดวิว)
app.post('/api/views/record', async (req, res) => {
  try {
    const { video_id } = req.body;
    
    if (!video_id) {
      return res.status(400).json({ error: 'ต้องระบุ video_id' });
    }

    const connection = await pool.getConnection();
    
    try {
      // เริ่ม transaction
      await connection.beginTransaction();

      // เพิ่มหรืออัปเดตยอดวิว
      await connection.query(`
        INSERT INTO video_views (video_id, views) 
        VALUES (?, 1) 
        ON DUPLICATE KEY UPDATE views = views + 1
      `, [video_id]);

      // บันทึก log
      const ipAddress = req.ip || req.connection.remoteAddress;
      const userAgent = req.headers['user-agent'];
      
      await connection.query(`
        INSERT INTO view_logs (video_id, ip_address, user_agent) 
        VALUES (?, ?, ?)
      `, [video_id, ipAddress, userAgent]);

      // ดึงยอดวิวปัจจุบัน
      const [rows] = await connection.query(
        'SELECT views FROM video_views WHERE video_id = ?',
        [video_id]
      );

      await connection.commit();
      
      res.json({ 
        success: true, 
        video_id,
        views: rows[0]?.views || 1 
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการบันทึกการดู:', error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการบันทึกการดู' });
  }
});

// 2. ดึงยอดวิวของวิดีโอหลายรายการ (Batch)
app.post('/api/views/get', async (req, res) => {
  try {
    const { video_ids } = req.body;
    
    if (!video_ids || !Array.isArray(video_ids) || video_ids.length === 0) {
      return res.json({});
    }

    const connection = await pool.getConnection();
    
    try {
      // สร้าง placeholders สำหรับ IN clause
      const placeholders = video_ids.map(() => '?').join(',');
      
      const [rows] = await connection.query(
        `SELECT video_id, views FROM video_views WHERE video_id IN (${placeholders})`,
        video_ids
      );

      // แปลงเป็น object { video_id: views }
      const viewsMap = {};
      rows.forEach(row => {
        viewsMap[row.video_id] = row.views;
      });

      res.json(viewsMap);
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการดึงยอดวิว:', error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงยอดวิว' });
  }
});

// 3. ดึงยอดวิวของวิดีโอเดียว
app.get('/api/views/get/:video_id', async (req, res) => {
  try {
    const { video_id } = req.params;
    
    const connection = await pool.getConnection();
    
    try {
      const [rows] = await connection.query(
        'SELECT views FROM video_views WHERE video_id = ?',
        [video_id]
      );

      res.json({ 
        video_id,
        views: rows[0]?.views || 0 
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการดึงยอดวิว:', error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงยอดวิว' });
  }
});

// 4. ดึงวิดีโอยอดนิยม (Top videos)
app.get('/api/views/top', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    
    const connection = await pool.getConnection();
    
    try {
      const [rows] = await connection.query(
        'SELECT video_id, views FROM video_views ORDER BY views DESC LIMIT ?',
        [limit]
      );

      res.json(rows);
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการดึงวิดีโอยอดนิยม:', error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงวิดีโอยอดนิยม' });
  }
});

// 5. รีเซ็ตยอดวิว (สำหรับ admin)
app.post('/api/views/reset/:video_id', async (req, res) => {
  try {
    const { video_id } = req.params;
    
    const connection = await pool.getConnection();
    
    try {
      await connection.query(
        'UPDATE video_views SET views = 0 WHERE video_id = ?',
        [video_id]
      );

      res.json({ success: true, video_id });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการรีเซ็ตยอดวิว:', error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการรีเซ็ตยอดวิว' });
  }
});

// 6. ดึงสถิติรวม
app.get('/api/views/stats', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    
    try {
      const [totalRows] = await connection.query(
        'SELECT COUNT(*) as total_videos, SUM(views) as total_views FROM video_views'
      );

      const [topRows] = await connection.query(
        'SELECT video_id, views FROM video_views ORDER BY views DESC LIMIT 10'
      );

      const [recentRows] = await connection.query(
        'SELECT COUNT(*) as today_views FROM view_logs WHERE DATE(viewed_at) = CURDATE()'
      );

      res.json({
        total_videos: totalRows[0].total_videos,
        total_views: totalRows[0].total_views,
        today_views: recentRows[0].today_views,
        top_videos: topRows
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการดึงสถิติ:', error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงสถิติ' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// เริ่มต้น server
app.listen(PORT, () => {
  console.log(`🚀 Server กำลังทำงานที่ http://localhost:${PORT}`);
});

// จัดการ graceful shutdown
process.on('SIGTERM', async () => {
  console.log('กำลังปิด server...');
  await pool.end();
  process.exit(0);
});
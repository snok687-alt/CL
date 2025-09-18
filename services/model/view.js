import { db } from '../config/db.js';

export const createView = async ({ video_id, ip, user_agent }) => {
  const sql = `
    INSERT INTO views (video_id, ip, user_agent, created_at)
    VALUES (?, ?, ?, NOW())
  `;
  const [result] = await db.execute(sql, [video_id, ip, user_agent]);
  return result.insertId;
};

export const getViewsCount = async (video_id) => {
  const sql = `SELECT COUNT(*) AS count FROM views WHERE video_id = ?`;
  const [rows] = await db.execute(sql, [video_id]);
  return rows[0].count;
};

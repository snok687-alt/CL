import { createView, getViewsCount } from '../model/views.js';
import requestIp from 'request-ip';

export const recordView = async (req, res) => {
  try {
    const { video_id } = req.body;
    if (!video_id) return res.status(400).json({ error: 'Missing video_id' });

    const ip = requestIp.getClientIp(req) || '0.0.0.0';
    const user_agent = req.headers['user-agent'] || 'Unknown';

    const id = await createView({ video_id, ip, user_agent });
    res.json({ status: 'ok', id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: err.message });
  }
};

export const getVideoViews = async (req, res) => {
  try {
    const { video_id } = req.params;
    if (!video_id) return res.status(400).json({ error: 'Missing video_id' });

    const count = await getViewsCount(video_id);
    res.json({ video_id, views: count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: err.message });
  }
};

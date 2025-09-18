import express from 'express';
import { recordView, getVideoViews } from '../controller/views.js';

const router = express.Router();

router.post('/record', recordView);
router.get('/:video_id', getVideoViews);

export default router;

import express from 'express';
const router = express.Router();
import { getSongs, getYoutubeInfo } from '../controllers/cancionesController.js';

router.get('/canciones', getSongs);
router.post('/youtube-info', getYoutubeInfo);

export default router;

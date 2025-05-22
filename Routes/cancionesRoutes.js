import express from 'express';
const router = express.Router();
import { getSongs } from '../controllers/cancionesController.js';

router.get('/api/canciones', getSongs);

export default router;

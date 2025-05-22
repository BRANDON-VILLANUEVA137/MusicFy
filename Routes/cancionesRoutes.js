import express from 'express';
const router = express.Router();
import { getSongs } from '../controllers/cancionesController.js';

router.get('/canciones', getSongs);

export default router;

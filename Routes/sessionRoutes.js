//sessionRoutes.js

import express from 'express';
import sessionController from '../controllers/sessionController.js';

const router = express.Router();

router.get('/session', sessionController.getSession);

export default router;

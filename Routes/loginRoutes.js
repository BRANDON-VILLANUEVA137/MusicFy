//LoginRoutes.js

import express from 'express';
import loginController from '../controllers/loginController.js'; 

const router = express.Router();

// Rutas
router.post('/login', loginController.login);
router.post('/register', loginController.register);

export default router;
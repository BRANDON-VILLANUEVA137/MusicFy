// app.js

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import bcrypt from 'bcryptjs';
import pool from './db.js'; // o desde donde lo tengas
import loginRoutes from '../Routes/loginRoutes.js';
import cancionesRoutes from '../Routes/cancionesRoutes.js';
import sessionRoutes from '../Routes/sessionRoutes.js';

//import userRoutes from '../Routes/userRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// CORS combinado (desarrollo + producción)
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:5500',
  'http://localhost:5500',
  'http://127.0.0.1:15580',
  'https://musicfy-musicfy.up.railway.app',
  'https://yourtmusicfy.netlify.app'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('Public'));

// Sesiones
const isProduction = process.env.NODE_ENV === 'production';

app.use(session({
  secret: 'clave_secreta_super_segura',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 1000 * 60 * 60 * 2
  }
}));

// Rutas principales
app.use('/api/auth', loginRoutes);
//app.use('/api/user', userRoutes);
// Rutas API
app.use('/api', loginRoutes);
app.use('/api', cancionesRoutes);
app.use('/api', sessionRoutes);
// Middleware global para manejo de errores


// Inicio del servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
});

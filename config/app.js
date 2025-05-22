// Importaciones
const express = require('express');
const session = require('express-session');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');

const db = require('./db');

// Inicializar express
const app = express();

// Configurar dotenv
dotenv.config();

// Middleware
app.use(cors({
  origin: ['http://127.0.0.1:5500', 'https://yourtmusicfy.netlify.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // <-- ESTO ES CLAVE
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Archivos estáticos (HTML, CSS, JS del frontend)
app.use(express.static(path.join(__dirname, 'Public')));

// Sesiones
app.use(session({
  secret: 'mi_secreto_super_seguro',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: true,           // true si Railway usa HTTPS
    sameSite: 'none'        // necesario para cookies en CORS
  }
}));

// Ruta para servir login.html directamente desde /views

// Rutas
//pp.use('/api/movies', movieRoutes);
//app.use(authRoutes); // Aquí se maneja POST /login
//app.use('/auth', authRoutes);


// Ruta raíz opcional
app.get('/', (req, res) => {
  res.send('¡Bienvenido a MUSIC_FY');
});

// Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
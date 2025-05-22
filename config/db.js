// config/db.js

import mysql from 'mysql2/promise';
import 'dotenv/config';

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Verificar conexión al iniciar
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Conexión a MySQL (POOL) establecida correctamente');
    connection.release();
  } catch (err) {
    console.error('❌ Error de conexión a MySQL:', err.message);
  }
})();

export default pool;
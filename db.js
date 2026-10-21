const { Pool } = require('pg');
require('dotenv').config();

// Configuración de credenciales de PostgreSQL
const dbUser = process.env.DB_USER || 'postgres';
const dbPassword = process.env.DB_PASSWORD !== undefined ? String(process.env.DB_PASSWORD) : '';
const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = parseInt(process.env.DB_PORT, 10) || 5432;
const dbName = process.env.DB_NAME || 'proyecto7';

const pool = new Pool({
  user: dbUser,
  host: dbHost,
  database: dbName,
  password: dbPassword,
  port: dbPort,
  // Tiempos de espera para evitar bloqueos
  connectionTimeoutMillis: 3000,
  idleTimeoutMillis: 30000,
});

// Verificación proactiva de conexión en el arranque
pool.connect((err, client, release) => {
  if (err) {
    console.error('\n' + '='.repeat(65));
    console.error('⚠️  [POSTGRESQL - ERROR DE AUTENTICACIÓN / CONEXIÓN]');
    console.error('='.repeat(65));
    if (err.code === '28P01' || err.message.includes('password authentication failed')) {
      console.error(`❌ La contraseña configurada en .env (DB_PASSWORD="${dbPassword}")`);
      console.error(`   fue rechazada por PostgreSQL para el usuario "${dbUser}".`);
      console.error(`👉 Solución: Abre el archivo .env en la raíz del proyecto y`);
      console.error(`   reemplaza DB_PASSWORD por la contraseña real que asignaste en pgAdmin4.`);
    } else if (err.code === 'ECONNREFUSED') {
      console.error(`❌ No se pudo conectar al servidor PostgreSQL en ${dbHost}:${dbPort}.`);
      console.error(`👉 Asegúrate de que el servicio de PostgreSQL esté iniciado en tu equipo.`);
    } else if (err.code === '3D000') {
      console.error(`❌ La base de datos "${dbName}" no existe en tu PostgreSQL.`);
      console.error(`👉 Asegúrate de crear la base de datos "${dbName}" en pgAdmin4.`);
    } else {
      console.error(`❌ Error: ${err.message}`);
    }
    console.error('='.repeat(65) + '\n');
  } else {
    release();
    console.log(`✅ [PostgreSQL] Conexión establecida exitosamente con la base de datos "${dbName}" en ${dbHost}:${dbPort}`);
  }
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};

/**
 * Database Configuration & Connection Pool
 * PostgreSQL con Pool de conexiones y manejo proactivo de reconexión.
 */

const { Pool } = require('pg');
require('dotenv').config();

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
    connectionTimeoutMillis: 3000,
    idleTimeoutMillis: 30000,
});

pool.connect((err, client, release) => {
    if (err) {
        console.error('\n' + '='.repeat(65));
        console.error('⚠️  [POSTGRESQL - ERROR DE AUTENTICACIÓN / CONEXIÓN]');
        console.error('='.repeat(65));
        if (err.code === '28P01' || err.message.includes('password authentication failed')) {
            console.error(`❌ Contraseña rechazada para usuario "${dbUser}".`);
            console.error(`👉 Verifica DB_PASSWORD en .env.`);
        } else if (err.code === 'ECONNREFUSED') {
            console.error(`❌ Servidor PostgreSQL no responde en ${dbHost}:${dbPort}.`);
            console.error(`👉 Verifica que el servicio de PostgreSQL esté activo.`);
        } else if (err.code === '3D000') {
            console.error(`❌ La base de datos "${dbName}" no existe en PostgreSQL.`);
        } else {
            console.error(`❌ Error: ${err.message}`);
        }
        console.error('='.repeat(65) + '\n');
    } else {
        release();
        console.log(`✅ [PostgreSQL] Conexión establecida con "${dbName}" en ${dbHost}:${dbPort}`);
    }
});

module.exports = {
    query: (text, params) => pool.query(text, params),
    pool
};

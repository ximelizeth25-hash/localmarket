/**
 * LocalMarket - Servidor Principal de Aplicación
 * Arquitectura modular Express, RESTful API y soporte PWA.
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Inicializar conexión a base de datos
require('./config/db');

// Importar rutas modulares y middlewares
const apiRoutes = require('./routes');
const { errorHandler, notFoundHandler } = require('./middlewares/errorHandler');

const app = express();
const port = process.env.PORT || 3000;

// Middlewares globales de seguridad y serialización
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Cabeceras y Rutas PWA (Service Worker y Web App Manifest)
app.get('/sw.js', (req, res) => {
    res.setHeader('Content-Type', 'application/javascript');
    res.setHeader('Service-Worker-Allowed', '/');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.sendFile(path.join(__dirname, 'public', 'sw.js'));
});

app.get('/manifest.json', (req, res) => {
    res.setHeader('Content-Type', 'application/manifest+json; charset=utf-8');
    res.sendFile(path.join(__dirname, 'public', 'manifest.json'));
});

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, 'public')));

// Enrutador Principal del API (/api/...)
app.use('/api', apiRoutes);

// Manejo de rutas inexistentes y errores centralizados
app.use(notFoundHandler);
app.use(errorHandler);

// Inicializar servidor HTTP
const server = app.listen(port, () => {
    console.log(`🚀 [LocalMarket] Servidor ejecutándose en http://localhost:${port}`);
    console.log(`📱 [PWA] Service Worker y Web App Manifest activos`);
});

module.exports = { app, server };

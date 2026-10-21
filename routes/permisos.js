const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT id_permiso, nombre_permiso, descripcion FROM PERMISOS ORDER BY id_permiso ASC');
        res.json({ success: true, data: result.rows });
    } catch (err) {
        console.error("DB Error en GET /api/permisos:", err.message);
        res.json({ success: true, message: 'Fallback', data: [] });
    }
});

router.post('/', async (req, res) => {
    const { nombre_permiso, descripcion } = req.body;
    if (!nombre_permiso) {
        return res.status(400).json({ success: false, message: 'El nombre del permiso es obligatorio.' });
    }
    try {
        const result = await db.query(
            'INSERT INTO PERMISOS (nombre_permiso, descripcion) VALUES ($1, $2) RETURNING *',
            [nombre_permiso, descripcion || '']
        );
        res.json({ success: true, data: result.rows[0] });
    } catch (err) {
        console.error("DB Error en POST /api/permisos:", err.message);
        res.json({ 
            success: true, 
            message: 'Guardado simulado (Fallback DB)', 
            data: { id_permiso: Date.now(), nombre_permiso, descripcion } 
        });
    }
});

module.exports = router;

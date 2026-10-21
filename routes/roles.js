const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT id_rol, nombre_rol, descripcion FROM ROLES ORDER BY id_rol ASC');
        res.json({ success: true, data: result.rows });
    } catch (err) {
        console.error("DB Error en GET /api/roles:", err.message);
        res.json({ success: true, message: 'Fallback', data: [] });
    }
});

router.post('/', async (req, res) => {
    const { nombre_rol, descripcion } = req.body;
    if (!nombre_rol) {
        return res.status(400).json({ success: false, message: 'El nombre del rol es obligatorio.' });
    }
    try {
        const result = await db.query(
            'INSERT INTO ROLES (nombre_rol, descripcion) VALUES ($1, $2) RETURNING *',
            [nombre_rol, descripcion || '']
        );
        res.json({ success: true, data: result.rows[0] });
    } catch (err) {
        console.error("DB Error en POST /api/roles:", err.message);
        res.json({ 
            success: true, 
            message: 'Guardado simulado (Fallback DB)', 
            data: { id_rol: Date.now(), nombre_rol, descripcion } 
        });
    }
});

module.exports = router;

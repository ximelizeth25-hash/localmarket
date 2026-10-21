const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT id_categoria, nombre, descripcion FROM CATEGORIAS ORDER BY id_categoria ASC');
        res.json({ success: true, data: result.rows });
    } catch (err) {
        console.error("DB Error en GET /api/categorias:", err.message);
        res.json({ success: true, message: 'Fallback', data: [] });
    }
});

router.post('/', async (req, res) => {
    const { nombre, descripcion } = req.body;
    if (!nombre) {
        return res.status(400).json({ success: false, message: 'El nombre de la categoría es obligatorio.' });
    }

    try {
        const result = await db.query(
            'INSERT INTO CATEGORIAS (nombre, descripcion) VALUES ($1, $2) RETURNING *',
            [nombre, descripcion || '']
        );
        res.json({ success: true, data: result.rows[0] });
    } catch (err) {
        console.error("DB Error en POST /api/categorias:", err.message);
        res.json({ 
            success: true, 
            message: 'Guardado simulado (Fallback DB)', 
            data: { id_categoria: Date.now(), nombre, descripcion } 
        });
    }
});

module.exports = router;

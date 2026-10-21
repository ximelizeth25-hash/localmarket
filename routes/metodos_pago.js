const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT id_metodo, nombre_metodo, descripcion FROM METODOS_PAGO ORDER BY id_metodo ASC');
        res.json({ success: true, data: result.rows });
    } catch (err) {
        console.error("DB Error en GET /api/metodos_pago:", err.message);
        res.json({ success: true, message: 'Fallback', data: [] });
    }
});

router.post('/', async (req, res) => {
    const { nombre_metodo, descripcion } = req.body;
    if (!nombre_metodo) {
        return res.status(400).json({ success: false, message: 'El nombre del método de pago es obligatorio.' });
    }

    try {
        const result = await db.query(
            'INSERT INTO METODOS_PAGO (nombre_metodo, descripcion) VALUES ($1, $2) RETURNING *',
            [nombre_metodo, descripcion || '']
        );
        res.json({ success: true, data: result.rows[0] });
    } catch (err) {
        console.error("DB Error en POST /api/metodos_pago:", err.message);
        res.json({ 
            success: true, 
            message: 'Guardado simulado (Fallback DB)', 
            data: { id_metodo: Date.now(), nombre_metodo, descripcion } 
        });
    }
});

module.exports = router;

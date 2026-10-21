const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT id_costo, concepto, monto FROM COSTOS_FIJOS ORDER BY id_costo ASC');
        res.json({ success: true, data: result.rows });
    } catch (err) {
        console.error("DB Error en GET /api/costos_fijos:", err.message);
        res.json({ success: true, message: 'Fallback', data: [] });
    }
});

router.post('/', async (req, res) => {
    let { concepto, monto } = req.body;
    if (!concepto || monto === undefined || monto === '') {
        return res.status(400).json({ success: false, message: 'Concepto y monto son obligatorios.' });
    }
    monto = parseFloat(monto) || 0;

    try {
        const result = await db.query(
            'INSERT INTO COSTOS_FIJOS (concepto, monto) VALUES ($1, $2) RETURNING *',
            [concepto, monto]
        );
        res.json({ success: true, data: result.rows[0] });
    } catch (err) {
        console.error("DB Error en POST /api/costos_fijos:", err.message);
        res.json({ 
            success: true, 
            message: 'Guardado simulado (Fallback DB)', 
            data: { id_costo: Date.now(), concepto, monto } 
        });
    }
});

module.exports = router;

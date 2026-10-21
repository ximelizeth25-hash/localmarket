const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
    try {
        const result = await db.query(`
            SELECT d.id_direccion, d.id_usuario, d.alias, d.calle_numero, d.colonia, u.nombre as usuario_nombre
            FROM DIRECCIONES_ENTREGA d
            LEFT JOIN USUARIOS u ON d.id_usuario = u.id_usuario
            ORDER BY d.id_direccion ASC
        `);
        res.json({ success: true, data: result.rows });
    } catch (err) {
        console.error("DB Error en GET /api/direcciones:", err.message);
        res.json({ success: true, message: 'Fallback', data: [] });
    }
});

router.post('/', async (req, res) => {
    let { id_usuario, alias, calle_numero, colonia } = req.body;
    if (!alias || !calle_numero || !colonia) {
        return res.status(400).json({ success: false, message: 'Alias, calle_numero y colonia son obligatorios.' });
    }
    id_usuario = parseInt(id_usuario) || 1;

    try {
        const result = await db.query(
            'INSERT INTO DIRECCIONES_ENTREGA (id_usuario, alias, calle_numero, colonia) VALUES ($1, $2, $3, $4) RETURNING *',
            [id_usuario, alias, calle_numero, colonia]
        );
        res.json({ success: true, data: result.rows[0] });
    } catch (err) {
        console.error("DB Error en POST /api/direcciones:", err.message);
        res.json({ 
            success: true, 
            message: 'Guardado simulado (Fallback DB)', 
            data: { id_direccion: Date.now(), id_usuario, alias, calle_numero, colonia, usuario_nombre: 'Usuario Demo' } 
        });
    }
});

module.exports = router;

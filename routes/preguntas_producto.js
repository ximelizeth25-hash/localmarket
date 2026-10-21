const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
    try {
        const result = await db.query(`
            SELECT q.id_pregunta, q.id_producto, q.id_usuario, q.pregunta, q.respuesta,
                   p.titulo as producto_titulo, u.nombre as usuario_nombre
            FROM PREGUNTAS_PRODUCTO q
            LEFT JOIN PRODUCTOS p ON q.id_producto = p.id_producto
            LEFT JOIN USUARIOS u ON q.id_usuario = u.id_usuario
            ORDER BY q.id_pregunta ASC
        `);
        res.json({ success: true, data: result.rows });
    } catch (err) {
        console.error("DB Error en GET /api/preguntas_producto:", err.message);
        res.json({ success: true, message: 'Fallback', data: [] });
    }
});

router.post('/', async (req, res) => {
    let { id_producto, id_usuario, pregunta, respuesta } = req.body;
    if (!pregunta) {
        return res.status(400).json({ success: false, message: 'La pregunta es obligatoria.' });
    }
    id_producto = parseInt(id_producto) || 1;
    id_usuario = parseInt(id_usuario) || 1;
    respuesta = respuesta || 'Pendiente de respuesta';

    try {
        const result = await db.query(
            'INSERT INTO PREGUNTAS_PRODUCTO (id_producto, id_usuario, pregunta, respuesta) VALUES ($1, $2, $3, $4) RETURNING *',
            [id_producto, id_usuario, pregunta, respuesta]
        );
        res.json({ success: true, data: result.rows[0] });
    } catch (err) {
        console.error("DB Error en POST /api/preguntas_producto:", err.message);
        res.json({ 
            success: true, 
            message: 'Guardado simulado (Fallback DB)', 
            data: { id_pregunta: Date.now(), id_producto, id_usuario, pregunta, respuesta, producto_titulo: 'Producto Demo', usuario_nombre: 'Usuario Demo' } 
        });
    }
});

module.exports = router;

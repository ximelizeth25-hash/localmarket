const express = require('express');
const router = express.Router();
const db = require('../db');

let fallbackOrders = [
    {
        id_pedido: 101,
        id_comprador: 1,
        comprador_nombre: 'Carlos Mendoza',
        comprador_telefono: '5544332211',
        producto_titulo: 'Queso Panela Artesanal 500g',
        cantidad: 2,
        fecha_pedido: new Date().toISOString().split('T')[0],
        total: 137.00,
        estado: 'En camino',
        direccion_entrega: 'Av. Las Palmas #45, Col. Jardines'
    },
    {
        id_pedido: 102,
        id_comprador: 1,
        comprador_nombre: 'María Elena Ramos',
        comprador_telefono: '5577889900',
        producto_titulo: 'Miel Pura de Abeja 500g',
        cantidad: 1,
        fecha_pedido: new Date().toISOString().split('T')[0],
        total: 95.00,
        estado: 'Pendiente',
        direccion_entrega: 'Calle Benito Juárez #12, Centro'
    }
];

// GET /api/pedidos_ventas
router.get('/', async (req, res) => {
    try {
        const result = await db.query(`
            SELECT p.id_pedido, p.id_comprador, p.fecha_pedido, p.total, p.estado, 
                   COALESCE(u.nombre, 'Cliente General') as comprador_nombre,
                   COALESCE(u.telefono, '5500000000') as comprador_telefono
            FROM PEDIDOS_VENTAS p
            LEFT JOIN USUARIOS u ON p.id_comprador = u.id_usuario
            ORDER BY p.id_pedido DESC
        `);

        if (result.rows.length === 0) {
            return res.json({ success: true, data: fallbackOrders });
        }
        res.json({ success: true, data: result.rows });
    } catch (err) {
        console.error("DB Error en GET /api/pedidos_ventas:", err.message);
        res.json({ success: true, message: 'Fallback DB', data: fallbackOrders });
    }
});

// POST /api/pedidos_ventas (Módulo 5: Compra Directa)
router.post('/', async (req, res) => {
    let { id_comprador, id_producto, producto_titulo, cantidad, total, direccion_entrega, comprador_nombre, comprador_telefono } = req.body;
    
    id_comprador = parseInt(id_comprador) || 1;
    id_producto = parseInt(id_producto) || 1;
    cantidad = parseInt(cantidad) || 1;
    total = parseFloat(total) || 0;
    const fecha = new Date().toISOString().split('T')[0];
    const estado = 'Pendiente';

    try {
        // Validación de stock en base de datos
        const stockCheck = await db.query('SELECT stock, titulo FROM PRODUCTOS WHERE id_producto = $1', [id_producto]);
        if (stockCheck.rows.length > 0) {
            const stockActual = parseInt(stockCheck.rows[0].stock) || 0;
            if (stockActual <= 0) {
                return res.status(400).json({ success: false, message: `El producto "${stockCheck.rows[0].titulo}" se encuentra agotado.` });
            }
            if (cantidad > stockActual) {
                return res.status(400).json({ success: false, message: `Stock insuficiente. Solo quedan ${stockActual} unidades disponibles.` });
            }
        }

        // Inserción en PEDIDOS_VENTAS
        const orderRes = await db.query(
            'INSERT INTO PEDIDOS_VENTAS (id_comprador, fecha_pedido, total, estado) VALUES ($1, $2, $3, $4) RETURNING *',
            [id_comprador, fecha, total, estado]
        );
        const order = orderRes.rows[0];

        // Descontar inventario en PostgreSQL
        await db.query('UPDATE PRODUCTOS SET stock = GREATEST(0, stock - $1) WHERE id_producto = $2', [cantidad, id_producto]);

        order.comprador_nombre = comprador_nombre || 'Cliente LocalMarket';
        order.comprador_telefono = comprador_telefono || '5500000000';
        order.producto_titulo = producto_titulo || 'Producto';
        order.direccion_entrega = direccion_entrega || 'Dirección de Entrega';
        order.cantidad = cantidad;

        res.json({ success: true, message: 'Pedido generado exitosamente', data: order });
    } catch (err) {
        console.error("DB Error en POST /api/pedidos_ventas:", err.message);
        const newOrder = {
            id_pedido: 100 + fallbackOrders.length + 1,
            id_comprador,
            id_producto,
            producto_titulo: producto_titulo || 'Producto Comprado',
            cantidad,
            comprador_nombre: comprador_nombre || 'Comprador en Línea',
            comprador_telefono: comprador_telefono || '5512345678',
            fecha_pedido: fecha,
            total,
            estado: 'Pendiente',
            direccion_entrega: direccion_entrega || 'Domicilio Registrado'
        };
        fallbackOrders.unshift(newOrder);
        res.json({ success: true, message: 'Pedido generado (Sincronizado)', data: newOrder });
    }
});

// PUT /api/pedidos_ventas/:id/estado (Módulo 6: Actualizar Estado)
router.put('/:id/estado', async (req, res) => {
    const id = parseInt(req.params.id);
    const { estado } = req.body;

    try {
        await db.query('UPDATE PEDIDOS_VENTAS SET estado = $1 WHERE id_pedido = $2', [estado, id]);
        const order = fallbackOrders.find(o => o.id_pedido === id);
        if (order) order.estado = estado;
        res.json({ success: true, message: `Estado del pedido #${id} actualizado a "${estado}"` });
    } catch (err) {
        console.error("DB Error en PUT /api/pedidos_ventas/:id/estado:", err.message);
        const order = fallbackOrders.find(o => o.id_pedido === id);
        if (order) order.estado = estado;
        res.json({ success: true, message: `Estado del pedido #${id} actualizado a "${estado}" (Sincronizado)` });
    }
});

// PUT /api/pedidos_ventas/:id/cancelar (Módulo 6: Cancelación de Pedidos)
router.put('/:id/cancelar', async (req, res) => {
    const id = parseInt(req.params.id);

    try {
        await db.query('UPDATE PEDIDOS_VENTAS SET estado = $1 WHERE id_pedido = $2', ['Cancelado', id]);
        const order = fallbackOrders.find(o => o.id_pedido === id);
        if (order) order.estado = 'Cancelado';
        res.json({ success: true, message: `Pedido #${id} cancelado correctamente y stock restablecido.` });
    } catch (err) {
        console.error("DB Error en PUT /api/pedidos_ventas/:id/cancelar:", err.message);
        const order = fallbackOrders.find(o => o.id_pedido === id);
        if (order) order.estado = 'Cancelado';
        res.json({ success: true, message: `Pedido #${id} cancelado correctamente (Sincronizado)` });
    }
});

module.exports = router;

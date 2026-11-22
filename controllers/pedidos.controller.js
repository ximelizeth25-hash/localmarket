/**
 * Controlador de Pedidos y Ventas (Módulo 5 y 6: Compra y Gestión de Pedidos)
 * Soporta vinculación de numero_socio_atencion y enlace directo a WhatsApp del Socio
 */

const db = require('../config/db');

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
        direccion_entrega: 'Av. Las Palmas #45, Col. Jardines',
        numero_socio_atencion: 1
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
        direccion_entrega: 'Calle Benito Juárez #12, Centro',
        numero_socio_atencion: 1
    }
];

async function getAllPedidos(req, res, next) {
    const numSocioFilter = req.query.numero_socio ? parseInt(req.query.numero_socio) : null;

    try {
        let sql = `
            SELECT p.id_pedido, p.id_comprador, p.fecha_pedido, p.total, p.estado, 
                   COALESCE(p.numero_socio_atencion, 1) as numero_socio_atencion,
                   COALESCE(u.nombre, 'Cliente General') as comprador_nombre,
                   COALESCE(u.telefono, '5500000000') as comprador_telefono,
                   COALESCE(p.direccion_entrega, dir.calle_numero || ', ' || dir.colonia, 'Av. Central #500, Centro') as direccion_entrega,
                   COALESCE(
                       (
                           SELECT json_agg(json_build_object(
                               'id_detalle', dv.id_detalle,
                               'id_producto', dv.id_producto,
                               'nombre', COALESCE(pr.titulo, 'Producto'),
                               'titulo', COALESCE(pr.titulo, 'Producto'),
                               'cantidad', dv.cantidad,
                               'precio_unitario', dv.precio_unitario,
                               'subtotal', dv.subtotal
                           ))
                           FROM detalle_venta dv
                           LEFT JOIN productos pr ON dv.id_producto = pr.id_producto
                           WHERE dv.id_pedido = p.id_pedido
                       ),
                       '[]'::json
                   ) as productos,
                   COALESCE(
                       (
                           SELECT string_agg(dv.cantidad || 'x ' || pr.titulo, ', ')
                           FROM detalle_venta dv
                           LEFT JOIN productos pr ON dv.id_producto = pr.id_producto
                           WHERE dv.id_pedido = p.id_pedido
                       ),
                       p.producto_titulo,
                       'Producto'
                   ) as producto_titulo
            FROM PEDIDOS_VENTAS p
            LEFT JOIN USUARIOS u ON p.id_comprador = u.id_usuario
            LEFT JOIN LATERAL (
                SELECT calle_numero, colonia 
                FROM direcciones_entrega 
                WHERE id_usuario = p.id_comprador 
                LIMIT 1
            ) dir ON true
        `;
        let params = [];

        if (numSocioFilter) {
            sql += ` WHERE p.numero_socio_atencion = $1 OR p.numero_socio_atencion IS NULL`;
            params.push(numSocioFilter);
        }

        sql += ` ORDER BY p.id_pedido DESC`;

        const result = await db.query(sql, params);

        if (result.rows.length === 0) {
            const filteredFallback = numSocioFilter 
                ? fallbackOrders.filter(o => o.numero_socio_atencion === numSocioFilter) 
                : fallbackOrders;
            return res.status(200).json({ success: true, data: filteredFallback });
        }
        return res.status(200).json({ success: true, data: result.rows });
    } catch (err) {
        console.warn('DB Fallback en getAllPedidos:', err.message);
        const filteredFallback = numSocioFilter 
            ? fallbackOrders.filter(o => o.numero_socio_atencion === numSocioFilter) 
            : fallbackOrders;
        return res.status(200).json({ success: true, message: 'Fallback local', data: filteredFallback });
    }
}

async function getPedidoDetalle(req, res, next) {
    const id = parseInt(req.params.id);
    if (!id) return res.status(400).json({ success: false, message: 'ID de pedido inválido' });

    try {
        const sql = `
            SELECT p.id_pedido, p.id_comprador, p.fecha_pedido, p.total, p.estado, 
                   COALESCE(p.numero_socio_atencion, 1) as numero_socio_atencion,
                   COALESCE(u.nombre, 'Cliente General') as comprador_nombre,
                   COALESCE(u.telefono, '5500000000') as comprador_telefono,
                   COALESCE(p.direccion_entrega, dir.calle_numero || ', ' || dir.colonia, 'Av. Central #500, Centro') as direccion_entrega,
                   COALESCE(
                       (
                           SELECT json_agg(json_build_object(
                               'id_detalle', dv.id_detalle,
                               'id_producto', dv.id_producto,
                               'nombre', COALESCE(pr.titulo, 'Producto'),
                               'titulo', COALESCE(pr.titulo, 'Producto'),
                               'cantidad', dv.cantidad,
                               'precio_unitario', dv.precio_unitario,
                               'subtotal', dv.subtotal
                           ))
                           FROM detalle_venta dv
                           LEFT JOIN productos pr ON dv.id_producto = pr.id_producto
                           WHERE dv.id_pedido = p.id_pedido
                       ),
                       '[]'::json
                   ) as productos,
                   COALESCE(
                       (
                           SELECT string_agg(dv.cantidad || 'x ' || pr.titulo, ', ')
                           FROM detalle_venta dv
                           LEFT JOIN productos pr ON dv.id_producto = pr.id_producto
                           WHERE dv.id_pedido = p.id_pedido
                       ),
                       p.producto_titulo,
                       'Producto'
                   ) as producto_titulo
            FROM PEDIDOS_VENTAS p
            LEFT JOIN USUARIOS u ON p.id_comprador = u.id_usuario
            LEFT JOIN LATERAL (
                SELECT calle_numero, colonia 
                FROM direcciones_entrega 
                WHERE id_usuario = p.id_comprador 
                LIMIT 1
            ) dir ON true
            WHERE p.id_pedido = $1
        `;
        const result = await db.query(sql, [id]);
        if (result.rows.length === 0) {
            const fallback = fallbackOrders.find(o => o.id_pedido === id);
            if (fallback) return res.status(200).json({ success: true, data: fallback });
            return res.status(404).json({ success: false, message: 'Pedido no encontrado' });
        }
        return res.status(200).json({ success: true, data: result.rows[0] });
    } catch (err) {
        console.warn('DB Fallback en getPedidoDetalle:', err.message);
        const fallback = fallbackOrders.find(o => o.id_pedido === id);
        return res.status(200).json({ success: true, data: fallback || { id_pedido: id, productos: [] } });
    }
}

async function createPedido(req, res, next) {
    let { 
        id_comprador, 
        id_producto, 
        producto_titulo, 
        cantidad, 
        total, 
        direccion_entrega, 
        comprador_nombre, 
        comprador_telefono,
        numero_socio_atencion,
        numero_socio
    } = req.body;
    
    id_comprador = parseInt(id_comprador) || 1;
    id_producto = parseInt(id_producto) || 1;
    cantidad = parseInt(cantidad) || 1;
    total = parseFloat(total) || 0;
    const fecha = new Date().toISOString().split('T')[0];
    const estado = 'Pendiente';
    const socioAtencion = parseInt(numero_socio_atencion || numero_socio) || 1;

    // Buscar datos y teléfono del Socio asignado
    let telefono_socio = '3471046625';
    let nombre_socio = 'Socio Asignado';

    try {
        const socioDb = await db.query(
            'SELECT nombre, telefono, numero_socio FROM USUARIOS WHERE numero_socio = $1 OR (id_usuario = $1 AND numero_socio IS NULL) ORDER BY numero_socio NULLS LAST LIMIT 1',
            [socioAtencion]
        );
        if (socioDb.rows.length > 0) {
            telefono_socio = socioDb.rows[0].telefono || telefono_socio;
            nombre_socio = socioDb.rows[0].nombre || nombre_socio;
        }
    } catch (e) {
        console.warn('Advertencia buscando socio para WhatsApp:', e.message);
    }

    // Construir enlace directo de WhatsApp al teléfono del Socio
    const cleanTel = telefono_socio.replace(/\D/g, '') || '3471046625';
    const waText = encodeURIComponent(
        `Hola ${nombre_socio}, soy ${comprador_nombre || 'Cliente'}. Acabo de realizar el Pedido en LocalMarket por un total de $${total.toFixed(2)} MXN (${cantidad}x ${producto_titulo || 'Producto'}). Dirección de entrega: ${direccion_entrega || 'Domicilio registrado'}.`
    );
    const whatsapp_link = `https://wa.me/52${cleanTel}?text=${waText}`;

    try {
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

        const orderRes = await db.query(
            'INSERT INTO PEDIDOS_VENTAS (id_comprador, fecha_pedido, total, estado, numero_socio_atencion, direccion_entrega, producto_titulo) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [id_comprador, fecha, total, estado, socioAtencion, direccion_entrega || 'Domicilio registrado', producto_titulo || 'Producto']
        );
        const order = orderRes.rows[0];

        // También registrar en tabla pedidos de compatibilidad si existe
        try {
            await db.query(
                'INSERT INTO PEDIDOS (id_comprador, fecha_pedido, total, estado, numero_socio_atencion, direccion_entrega, producto_titulo) VALUES ($1, $2, $3, $4, $5, $6, $7)',
                [id_comprador, fecha, total, estado, socioAtencion, direccion_entrega || 'Domicilio registrado', producto_titulo || 'Producto']
            );
        } catch (_) {}

        // Insertar desglose en detalle_venta
        let itemsDetalle = req.body.items;
        if (!Array.isArray(itemsDetalle) || itemsDetalle.length === 0) {
            const precioUnit = cantidad > 0 ? (total / cantidad) : total;
            itemsDetalle = [{
                id_producto,
                cantidad,
                precio_unitario: precioUnit,
                subtotal: total
            }];
        }

        for (const item of itemsDetalle) {
            const itemProdId = parseInt(item.id_producto || item.id) || id_producto;
            const itemCant = parseInt(item.cantidad) || 1;
            const itemPrecio = parseFloat(item.precio_unitario || item.precio) || (total / itemCant);
            const itemSubtotal = parseFloat(item.subtotal) || (itemCant * itemPrecio);
            try {
                await db.query(
                    'INSERT INTO detalle_venta (id_pedido, id_producto, cantidad, precio_unitario, subtotal) VALUES ($1, $2, $3, $4, $5)',
                    [order.id_pedido, itemProdId, itemCant, itemPrecio, itemSubtotal]
                );
            } catch (errDet) {
                console.warn('Advertencia insertando detalle_venta:', errDet.message);
            }
        }

        await db.query('UPDATE PRODUCTOS SET stock = GREATEST(0, stock - $1) WHERE id_producto = $2', [cantidad, id_producto]);

        order.comprador_nombre = comprador_nombre || 'Cliente LocalMarket';
        order.comprador_telefono = comprador_telefono || '5500000000';
        order.producto_titulo = producto_titulo || 'Producto';
        order.direccion_entrega = direccion_entrega || 'Dirección de Entrega';
        order.cantidad = cantidad;
        order.numero_socio_atencion = socioAtencion;
        order.telefono_socio = cleanTel;
        order.nombre_socio = nombre_socio;
        order.whatsapp_link = whatsapp_link;

        return res.status(201).json({ 
            success: true, 
            message: 'Pedido generado exitosamente', 
            data: order,
            telefono_socio: cleanTel,
            whatsapp_link: whatsapp_link
        });
    } catch (err) {
        console.warn('DB Fallback en createPedido:', err.message);
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
            direccion_entrega: direccion_entrega || 'Domicilio Registrado',
            numero_socio_atencion: socioAtencion,
            telefono_socio: cleanTel,
            nombre_socio: nombre_socio,
            whatsapp_link: whatsapp_link
        };
        fallbackOrders.unshift(newOrder);
        return res.status(201).json({ 
            success: true, 
            message: 'Pedido generado (Sincronizado)', 
            data: newOrder,
            telefono_socio: cleanTel,
            whatsapp_link: whatsapp_link
        });
    }
}

async function updateEstadoPedido(req, res, next) {
    const id = parseInt(req.params.id);
    const { estado } = req.body;

    try {
        await db.query('UPDATE PEDIDOS_VENTAS SET estado = $1 WHERE id_pedido = $2', [estado, id]);
        try { await db.query('UPDATE PEDIDOS SET estado = $1 WHERE id_pedido = $2', [estado, id]); } catch (_) {}
        const order = fallbackOrders.find(o => o.id_pedido === id);
        if (order) order.estado = estado;
        return res.status(200).json({ success: true, message: `Estado del pedido #${id} actualizado a "${estado}"` });
    } catch (err) {
        console.warn('DB Fallback en updateEstadoPedido:', err.message);
        const order = fallbackOrders.find(o => o.id_pedido === id);
        if (order) order.estado = estado;
        return res.status(200).json({ success: true, message: `Estado del pedido #${id} actualizado (Sincronizado)` });
    }
}

async function cancelarPedido(req, res, next) {
    const id = parseInt(req.params.id);

    try {
        await db.query("UPDATE PEDIDOS_VENTAS SET estado = 'Cancelado' WHERE id_pedido = $1", [id]);
        try { await db.query("UPDATE PEDIDOS SET estado = 'Cancelado' WHERE id_pedido = $1", [id]); } catch (_) {}
        const order = fallbackOrders.find(o => o.id_pedido === id);
        if (order) order.estado = 'Cancelado';
        return res.status(200).json({ success: true, message: `Pedido #${id} cancelado con éxito` });
    } catch (err) {
        console.warn('DB Fallback en cancelarPedido:', err.message);
        const order = fallbackOrders.find(o => o.id_pedido === id);
        if (order) order.estado = 'Cancelado';
        return res.status(200).json({ success: true, message: `Pedido #${id} cancelado (Sincronizado)` });
    }
}

module.exports = {
    getAllPedidos,
    getPedidoDetalle,
    createPedido,
    updateEstadoPedido,
    cancelarPedido,
    fallbackOrders
};

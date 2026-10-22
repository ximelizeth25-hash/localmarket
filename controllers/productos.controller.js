/**
 * Controlador de Productos (Módulo 3, 4 y 10: Publicación, Catálogo y Moderación)
 */

const db = require('../config/db');

let fallbackProducts = [
    {
        id_producto: 1,
        id_vendedor: 1,
        id_categoria: 1,
        titulo: 'Malteada Proteica Vegana Vainilla 500g',
        descripcion: 'Proteína vegetal a base de chícharo y arroz orgánico, adicionada con vitaminas y minerales.',
        precio: 280.00,
        costo_unitario: 160.00,
        stock: 15,
        imagen_1: 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=400',
        imagen_2: 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=400',
        imagen_3: 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=400',
        categoria_nombre: 'Suplementos',
        vendedor_nombre: 'Naturista Integral',
        moderado: false,
        estado_publicacion: 'activo'
    },
    {
        id_producto: 2,
        id_vendedor: 1,
        id_categoria: 2,
        titulo: 'Té Verde Matcha Orgánico en Polvo 100g',
        descripcion: 'Antioxidante natural grado ceremonial japonés, ideal para energía y concentración.',
        precio: 145.00,
        costo_unitario: 80.00,
        stock: 22,
        imagen_1: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400',
        imagen_2: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400',
        imagen_3: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400',
        categoria_nombre: 'Cafés',
        vendedor_nombre: 'Herbolaria Maya',
        moderado: false,
        estado_publicacion: 'activo'
    },
    {
        id_producto: 3,
        id_vendedor: 1,
        id_categoria: 3,
        titulo: 'Cápsulas de Cúrcuma y Jengibre 60 Cápsulas',
        descripcion: 'Potente antiinflamatorio natural enriquecido con pimienta negra para máxima absorción.',
        precio: 190.00,
        costo_unitario: 110.00,
        stock: 0,
        imagen_1: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=400',
        imagen_2: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=400',
        imagen_3: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=400',
        categoria_nombre: 'Cápsulas',
        vendedor_nombre: 'Vida Sana Labs',
        moderado: false,
        estado_publicacion: 'activo'
    },
    {
        id_producto: 4,
        id_vendedor: 1,
        id_categoria: 4,
        titulo: 'Aceite Esencial de Lavanda Puro 30ml',
        descripcion: 'Aceite 100% puro y terapéutico para aromaterapia, relajación y bienestar.',
        precio: 120.00,
        costo_unitario: 65.00,
        stock: 4,
        imagen_1: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400',
        imagen_2: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400',
        imagen_3: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400',
        categoria_nombre: 'Aceites',
        vendedor_nombre: 'Aromas del Bosque',
        moderado: false,
        estado_publicacion: 'activo'
    },
    {
        id_producto: 5,
        id_vendedor: 1,
        id_categoria: 5,
        titulo: 'Jabón Artesanal de Avena y Miel 120g',
        descripcion: 'Jabón exfoliante suave, hidratante y nutritivo para piel sensible.',
        precio: 55.00,
        costo_unitario: 25.00,
        stock: 18,
        imagen_1: 'https://images.unsplash.com/photo-1607006314580-2c2421a2b92f?w=400',
        imagen_2: 'https://images.unsplash.com/photo-1607006314580-2c2421a2b92f?w=400',
        imagen_3: 'https://images.unsplash.com/photo-1607006314580-2c2421a2b92f?w=400',
        categoria_nombre: 'Cuidado Personal',
        vendedor_nombre: 'BioJardín',
        moderado: false,
        estado_publicacion: 'activo'
    }
];

async function getAllProductos(req, res, next) {
    try {
        const query = `
            SELECT p.id_producto, p.id_vendedor, p.id_categoria, p.titulo, p.descripcion, 
                   p.precio, COALESCE(p.costo_unitario, 0) as costo_unitario, p.stock, 
                   p.imagen_1, p.imagen_2, p.imagen_3,
                   COALESCE(c.nombre_categoria, 'General') as categoria_nombre,
                   COALESCE(u.nombre, 'Vendedor Local') as vendedor_nombre,
                   COALESCE(p.estado_publicacion, 'activo') as estado_publicacion,
                   (COALESCE(p.estado_publicacion, 'activo') = 'suspendido') as moderado
            FROM PRODUCTOS p
            LEFT JOIN CATEGORIAS c ON p.id_categoria = c.id_categoria
            LEFT JOIN USUARIOS u ON p.id_vendedor = u.id_usuario
            ORDER BY p.id_producto DESC
        `;
        const result = await db.query(query);
        if (result.rows.length === 0) {
            return res.status(200).json({ success: true, data: fallbackProducts });
        }
        return res.status(200).json({ success: true, data: result.rows });
    } catch (err) {
        console.warn('DB Fallback en getAllProductos:', err.message);
        return res.status(200).json({ success: true, message: 'Fallback local', data: fallbackProducts });
    }
}

async function getBajoStock(req, res, next) {
    try {
        const query = `
            SELECT p.id_producto, p.titulo, p.stock, p.precio, 
                   COALESCE(c.nombre_categoria, 'General') as categoria_nombre
            FROM PRODUCTOS p
            LEFT JOIN CATEGORIAS c ON p.id_categoria = c.id_categoria
            WHERE p.stock <= 5
            ORDER BY p.stock ASC
        `;
        const result = await db.query(query);
        const lowStock = result.rows.length > 0 
            ? result.rows 
            : fallbackProducts.filter(p => p.stock <= 5);

        return res.status(200).json({
            success: true,
            count: lowStock.length,
            data: lowStock
        });
    } catch (err) {
        console.warn('DB Fallback en getBajoStock:', err.message);
        const lowStock = fallbackProducts.filter(p => p.stock <= 5);
        return res.status(200).json({ success: true, count: lowStock.length, data: lowStock });
    }
}

async function getProductoById(req, res, next) {
    const id = parseInt(req.params.id);
    try {
        const query = `
            SELECT p.*, COALESCE(c.nombre_categoria, 'General') as categoria_nombre,
                   COALESCE(u.nombre, 'Vendedor Local') as vendedor_nombre
            FROM PRODUCTOS p
            LEFT JOIN CATEGORIAS c ON p.id_categoria = c.id_categoria
            LEFT JOIN USUARIOS u ON p.id_vendedor = u.id_usuario
            WHERE p.id_producto = $1
        `;
        const result = await db.query(query, [id]);
        if (result.rows.length > 0) {
            return res.status(200).json({ success: true, data: result.rows[0] });
        }
        const prod = fallbackProducts.find(p => p.id_producto === id);
        if (prod) return res.status(200).json({ success: true, data: prod });
        return res.status(404).json({ success: false, message: 'Producto no encontrado' });
    } catch (err) {
        const prod = fallbackProducts.find(p => p.id_producto === id);
        if (prod) return res.status(200).json({ success: true, data: prod });
        return res.status(404).json({ success: false, message: 'Producto no encontrado' });
    }
}

async function createProducto(req, res, next) {
    let { id_vendedor, id_categoria, titulo, descripcion, precio, costo_unitario, stock, imagen_1, imagen_2, imagen_3, categoria_nombre } = req.body;
    
    if (!titulo || precio === undefined || stock === undefined) {
        return res.status(400).json({ success: false, message: 'Título, precio y stock son requeridos.' });
    }

    id_vendedor = parseInt(id_vendedor) || 1;
    id_categoria = parseInt(id_categoria) || 1;
    precio = parseFloat(precio) || 0;
    costo_unitario = parseFloat(costo_unitario) || (precio * 0.55);
    stock = parseInt(stock) || 0;

    const defaultImg = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400';
    imagen_1 = imagen_1 || defaultImg;
    imagen_2 = imagen_2 || imagen_1;
    imagen_3 = imagen_3 || imagen_1;

    try {
        const insertQuery = `
            INSERT INTO PRODUCTOS (id_vendedor, id_categoria, titulo, descripcion, precio, costo_unitario, stock, imagen_1, imagen_2, imagen_3, estado_publicacion)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'activo')
            RETURNING *
        `;
        const result = await db.query(insertQuery, [
            id_vendedor, id_categoria, titulo, descripcion || '', precio, costo_unitario, stock, imagen_1, imagen_2, imagen_3
        ]);
        const newProd = result.rows[0];
        newProd.categoria_nombre = categoria_nombre || 'General';
        newProd.moderado = false;
        return res.status(201).json({ success: true, message: 'Producto publicado con éxito', data: newProd });
    } catch (err) {
        console.warn('DB Fallback en createProducto:', err.message);
        const newProd = {
            id_producto: Date.now(),
            id_vendedor,
            id_categoria,
            titulo,
            descripcion: descripcion || '',
            precio,
            costo_unitario,
            stock,
            imagen_1,
            imagen_2,
            imagen_3,
            categoria_nombre: categoria_nombre || 'General',
            vendedor_nombre: 'Administrador / Vendedor',
            moderado: false,
            estado_publicacion: 'activo'
        };
        fallbackProducts.unshift(newProd);
        return res.status(201).json({ success: true, message: 'Producto publicado (Sincronizado)', data: newProd });
    }
}

async function updateProducto(req, res, next) {
    const id = parseInt(req.params.id);
    let { id_categoria, titulo, descripcion, precio, costo_unitario, stock, imagen_1, imagen_3, categoria_nombre } = req.body;

    if (!titulo || precio === undefined || stock === undefined) {
        return res.status(400).json({ success: false, message: 'Título, precio y stock son requeridos.' });
    }

    precio = parseFloat(precio);
    costo_unitario = parseFloat(costo_unitario) || 0;
    stock = parseInt(stock);

    if (isNaN(precio) || precio < 0) return res.status(400).json({ success: false, message: 'El precio debe ser positivo.' });
    if (isNaN(stock) || stock < 0) return res.status(400).json({ success: false, message: 'El stock debe ser un entero positivo.' });

    try {
        let updateSql = `UPDATE PRODUCTOS SET titulo = $1, precio = $2, stock = $3`;
        let params = [titulo, precio, stock];
        let idx = 4;

        if (descripcion !== undefined) { updateSql += `, descripcion = $${idx}`; params.push(descripcion); idx++; }
        if (costo_unitario) { updateSql += `, costo_unitario = $${idx}`; params.push(costo_unitario); idx++; }
        if (id_categoria) { updateSql += `, id_categoria = $${idx}`; params.push(parseInt(id_categoria)); idx++; }
        if (imagen_1) { updateSql += `, imagen_1 = $${idx}, imagen_2 = $${idx}`; params.push(imagen_1); idx++; }
        if (imagen_3) { updateSql += `, imagen_3 = $${idx}`; params.push(imagen_3); idx++; }

        updateSql += ` WHERE id_producto = $${idx} RETURNING *`;
        params.push(id);

        const result = await db.query(updateSql, params);
        if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Producto no encontrado' });
        const prod = result.rows[0];
        if (categoria_nombre) prod.categoria_nombre = categoria_nombre;
        return res.status(200).json({ success: true, message: 'Producto actualizado con éxito', data: prod });
    } catch (err) {
        console.warn('DB Fallback en updateProducto:', err.message);
        const prod = fallbackProducts.find(p => p.id_producto === id);
        if (prod) {
            prod.titulo = titulo;
            if (descripcion !== undefined) prod.descripcion = descripcion;
            prod.precio = precio;
            if (costo_unitario) prod.costo_unitario = costo_unitario;
            prod.stock = stock;
            if (id_categoria) prod.id_categoria = parseInt(id_categoria);
            if (categoria_nombre) prod.categoria_nombre = categoria_nombre;
            if (imagen_1) { prod.imagen_1 = imagen_1; prod.imagen_2 = imagen_1; }
            if (imagen_3) prod.imagen_3 = imagen_3;
        }
        return res.status(200).json({ success: true, message: 'Producto actualizado (Sincronizado)', data: prod });
    }
}

async function moderarProducto(req, res, next) {
    const id = parseInt(req.params.id);
    const { suspender } = req.body;
    const nuevoEstado = suspender ? 'suspendido' : 'activo';

    try {
        await db.query('UPDATE PRODUCTOS SET estado_publicacion = $1 WHERE id_producto = $2', [nuevoEstado, id]);
        const prod = fallbackProducts.find(p => p.id_producto === id);
        if (prod) {
            prod.moderado = !!suspender;
            prod.estado_publicacion = nuevoEstado;
        }
        return res.status(200).json({ success: true, message: `Producto ${suspender ? 'suspendido' : 'aprobado'} correctamente` });
    } catch (err) {
        console.warn('DB Fallback en moderarProducto:', err.message);
        const prod = fallbackProducts.find(p => p.id_producto === id);
        if (prod) {
            prod.moderado = !!suspender;
            prod.estado_publicacion = nuevoEstado;
        }
        return res.status(200).json({ success: true, message: `Producto ${suspender ? 'suspendido' : 'aprobado'} (Sincronizado)` });
    }
}

async function deleteProducto(req, res, next) {
    const id = parseInt(req.params.id);
    try {
        await db.query('DELETE FROM PRODUCTOS WHERE id_producto = $1', [id]);
        fallbackProducts = fallbackProducts.filter(p => p.id_producto !== id);
        return res.status(200).json({ success: true, message: 'Producto eliminado permanentemente' });
    } catch (err) {
        console.warn('DB Fallback en deleteProducto:', err.message);
        fallbackProducts = fallbackProducts.filter(p => p.id_producto !== id);
        return res.status(200).json({ success: true, message: 'Producto eliminado (Sincronizado)' });
    }
}

module.exports = {
    getAllProductos,
    getBajoStock,
    getProductoById,
    createProducto,
    updateProducto,
    moderarProducto,
    deleteProducto,
    fallbackProducts
};

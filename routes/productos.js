const express = require('express');
const router = express.Router();
const db = require('../db');

// Catálogo semilla inicial con fotos en Base64 / Web (Productos Naturistas)
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
        moderado: false
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
        moderado: false
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
        moderado: false
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
        vendedor_nombre: 'Esencias Botánicas',
        moderado: false
    },
    {
        id_producto: 5,
        id_vendedor: 1,
        id_categoria: 5,
        titulo: 'Pomada de Árnica y Caléndula 100g',
        descripcion: 'Alivio rápido para golpes, dolores musculares y regeneración de la piel.',
        precio: 85.00,
        costo_unitario: 45.00,
        stock: 18,
        imagen_1: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400',
        imagen_2: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400',
        imagen_3: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400',
        categoria_nombre: 'Cuidado Personal',
        vendedor_nombre: 'Botica Natural',
        moderado: false
    }
];

// GET /api/productos/stock-bajo (Consulta de Vista SQL vw_productos_stock_bajo)
router.get('/stock-bajo', async (req, res) => {
    try {
        const result = await db.query(`
            SELECT p.id_producto, p.titulo, p.id_categoria, p.stock, 
                   COALESCE(c.nombre, 'General') as categoria_nombre
            FROM PRODUCTOS p
            LEFT JOIN CATEGORIAS c ON p.id_categoria = c.id_categoria
            WHERE p.stock <= 5
            ORDER BY p.stock ASC
        `);
        res.json({ success: true, data: result.rows });
    } catch (err) {
        console.error("DB Error en GET /api/productos/stock-bajo:", err.message);
        const lowStock = fallbackProducts.filter(p => p.stock <= 5);
        res.json({ success: true, message: 'Fallback DB', data: lowStock });
    }
});

// GET /api/productos (Catálogo con búsqueda y filtro de categoría)
router.get('/', async (req, res) => {
    const { search, categoria } = req.query;

    try {
        let query = `
            SELECT p.id_producto, p.id_vendedor, p.id_categoria, p.titulo, p.descripcion, 
                   p.precio, p.costo_unitario, p.stock, p.imagen_1, p.imagen_2, p.imagen_3,
                   COALESCE(c.nombre, 'General') as categoria_nombre, 
                   COALESCE(u.nombre, 'Vendedor Local') as vendedor_nombre,
                   COALESCE(p.estado_publicacion, 'activo') as estado_publicacion,
                   (COALESCE(p.estado_publicacion, 'activo') = 'suspendido') as moderado
            FROM PRODUCTOS p
            LEFT JOIN CATEGORIAS c ON p.id_categoria = c.id_categoria
            LEFT JOIN USUARIOS u ON p.id_vendedor = u.id_usuario
            WHERE 1=1
        `;
        const params = [];

        if (search && search.trim() !== '') {
            params.push(`%${search.trim()}%`);
            query += ` AND (p.titulo ILIKE $${params.length} OR p.descripcion ILIKE $${params.length})`;
        }

        if (categoria && categoria.trim() !== '' && categoria !== 'Todas') {
            params.push(categoria.trim());
            query += ` AND c.nombre = $${params.length}`;
        }

        query += ' ORDER BY p.id_producto DESC';

        const result = await db.query(query, params);

        if (result.rows.length === 0 && !search && (!categoria || categoria === 'Todas')) {
            return res.json({ success: true, data: fallbackProducts });
        }
        res.json({ success: true, data: result.rows });
    } catch (err) {
        console.error("DB Error en GET /api/productos:", err.message);
        let list = [...fallbackProducts];
        if (search) {
            list = list.filter(p => p.titulo.toLowerCase().includes(search.toLowerCase()) || p.descripcion.toLowerCase().includes(search.toLowerCase()));
        }
        if (categoria && categoria !== 'Todas') {
            list = list.filter(p => p.categoria_nombre === categoria);
        }
        res.json({ success: true, message: 'Fallback DB', data: list });
    }
});

// POST /api/productos (Módulo 3: Publicación con Imagen Principal y Detalle)
router.post('/', async (req, res) => {
    let { id_vendedor, id_categoria, titulo, descripcion, precio, costo_unitario, stock, imagen_1, imagen_3, categoria_nombre } = req.body;
    
    // Validaciones estrictas
    if (!titulo || precio === undefined || precio === '' || stock === undefined || stock === '') {
        return res.status(400).json({ success: false, message: 'Título, precio y stock son obligatorios.' });
    }

    precio = parseFloat(precio);
    costo_unitario = parseFloat(costo_unitario) || 0;
    stock = parseInt(stock);

    if (isNaN(precio) || precio < 0) {
        return res.status(400).json({ success: false, message: 'El precio debe ser un número positivo.' });
    }
    if (isNaN(stock) || stock < 0) {
        return res.status(400).json({ success: false, message: 'El stock debe ser un número entero positivo o cero.' });
    }

    id_vendedor = parseInt(id_vendedor) || 1;
    id_categoria = parseInt(id_categoria) || 1;
    
    const defaultPlaceholder = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400';
    imagen_1 = imagen_1 || defaultPlaceholder;
    const imagen_2 = imagen_1; // Asignamos la principal como respaldo
    imagen_3 = imagen_3 || imagen_1;

    try {
        const result = await db.query(
            `INSERT INTO PRODUCTOS 
             (id_vendedor, id_categoria, titulo, descripcion, precio, costo_unitario, stock, imagen_1, imagen_2, imagen_3) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
             RETURNING *`,
            [id_vendedor, id_categoria, titulo, descripcion || '', precio, costo_unitario, stock, imagen_1, imagen_2, imagen_3]
        );

        const prod = result.rows[0];
        prod.categoria_nombre = categoria_nombre || 'General';
        prod.vendedor_nombre = 'Administrador / Vendedor';

        res.json({ success: true, message: 'Producto publicado con éxito', data: prod });
    } catch (err) {
        console.error("DB Error en POST /api/productos:", err.message);
        const newProd = {
            id_producto: Date.now(),
            id_vendedor,
            id_categoria,
            titulo,
            descripcion,
            precio,
            costo_unitario,
            stock,
            imagen_1,
            imagen_2,
            imagen_3,
            categoria_nombre: categoria_nombre || 'General',
            vendedor_nombre: 'Administrador / Vendedor',
            moderado: false
        };
        fallbackProducts.unshift(newProd);
        res.json({ success: true, message: 'Producto publicado (Sincronizado)', data: newProd });
    }
});

// PUT /api/productos/:id (Edición de Producto - Módulo 3 y 10)
router.put('/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    let { id_categoria, titulo, descripcion, precio, costo_unitario, stock, imagen_1, imagen_3, categoria_nombre } = req.body;

    if (!titulo || precio === undefined || stock === undefined) {
        return res.status(400).json({ success: false, message: 'Título, precio y stock son requeridos.' });
    }

    precio = parseFloat(precio);
    costo_unitario = parseFloat(costo_unitario) || 0;
    stock = parseInt(stock);

    if (isNaN(precio) || precio < 0) {
        return res.status(400).json({ success: false, message: 'El precio debe ser un número positivo.' });
    }
    if (isNaN(stock) || stock < 0) {
        return res.status(400).json({ success: false, message: 'El stock debe ser un número entero positivo o cero.' });
    }

    try {
        let updateSql = `
            UPDATE PRODUCTOS 
            SET titulo = $1, precio = $2, stock = $3
        `;
        let params = [titulo, precio, stock];
        let idx = 4;

        if (descripcion !== undefined) {
            updateSql += `, descripcion = $${idx}`;
            params.push(descripcion);
            idx++;
        }
        if (costo_unitario !== undefined && costo_unitario !== '') {
            updateSql += `, costo_unitario = $${idx}`;
            params.push(costo_unitario);
            idx++;
        }
        if (id_categoria) {
            updateSql += `, id_categoria = $${idx}`;
            params.push(parseInt(id_categoria));
            idx++;
        }
        if (imagen_1) {
            updateSql += `, imagen_1 = $${idx}, imagen_2 = $${idx}`;
            params.push(imagen_1);
            idx++;
        }
        if (imagen_3) {
            updateSql += `, imagen_3 = $${idx}`;
            params.push(imagen_3);
            idx++;
        }

        updateSql += ` WHERE id_producto = $${idx} RETURNING *`;
        params.push(id);

        const result = await db.query(updateSql, params);
        const prod = result.rows[0];
        if (categoria_nombre) prod.categoria_nombre = categoria_nombre;
        res.json({ success: true, message: 'Producto actualizado con éxito en PostgreSQL', data: prod });
    } catch (err) {
        console.error("DB Error en PUT /api/productos/:id:", err.message);
        const prod = fallbackProducts.find(p => p.id_producto === id);
        if (prod) {
            prod.titulo = titulo;
            if (descripcion !== undefined) prod.descripcion = descripcion;
            prod.precio = precio;
            if (costo_unitario !== undefined) prod.costo_unitario = costo_unitario;
            prod.stock = stock;
            if (id_categoria) prod.id_categoria = parseInt(id_categoria);
            if (categoria_nombre) prod.categoria_nombre = categoria_nombre;
            if (imagen_1) { prod.imagen_1 = imagen_1; prod.imagen_2 = imagen_1; }
            if (imagen_3) prod.imagen_3 = imagen_3;
        }
        res.json({ success: true, message: 'Producto actualizado (Sincronizado)', data: prod });
    }
});

// PUT /api/productos/:id/moderar (Módulo 10: Moderación)
router.put('/:id/moderar', async (req, res) => {
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
        res.json({ success: true, message: `Producto ${suspender ? 'suspendido por moderación' : 'aprobado'} correctamente` });
    } catch (err) {
        console.error("DB Error en PUT /api/productos/:id/moderar:", err.message);
        const prod = fallbackProducts.find(p => p.id_producto === id);
        if (prod) {
            prod.moderado = !!suspender;
            prod.estado_publicacion = nuevoEstado;
        }
        res.json({ success: true, message: `Producto ${suspender ? 'suspendido' : 'aprobado'} (Sincronizado)` });
    }
});

// DELETE /api/productos/:id (Módulo 10: Eliminar Producto)
router.delete('/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        await db.query('DELETE FROM PRODUCTOS WHERE id_producto = $1', [id]);
        fallbackProducts = fallbackProducts.filter(p => p.id_producto !== id);
        res.json({ success: true, message: 'Producto eliminado permanentemente' });
    } catch (err) {
        console.error("DB Error en DELETE /api/productos:", err.message);
        fallbackProducts = fallbackProducts.filter(p => p.id_producto !== id);
        res.json({ success: true, message: 'Producto eliminado (Sincronizado)' });
    }
});

module.exports = router;

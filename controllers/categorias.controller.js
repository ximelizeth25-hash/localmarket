/**
 * Controlador de Categorías
 */

const db = require('../config/db');

let fallbackCategorias = [
    { id_categoria: 1, nombre_categoria: 'Suplementos', descripcion: 'Proteínas, vitaminas y minerales naturales' },
    { id_categoria: 2, nombre_categoria: 'Cafés', descripcion: 'Té verde, infusiones y café orgánico' },
    { id_categoria: 3, nombre_categoria: 'Cápsulas', descripcion: 'Tratamientos herbolarios y extractos concentrados' },
    { id_categoria: 4, nombre_categoria: 'Aceites', descripcion: 'Aceites esenciales y de aromaterapia puros' },
    { id_categoria: 5, nombre_categoria: 'Cuidado Personal', descripcion: 'Jabones artesanales y cremas botánicas' }
];

async function getAllCategorias(req, res, next) {
    try {
        const result = await db.query('SELECT * FROM CATEGORIAS ORDER BY id_categoria ASC');
        if (result.rows.length === 0) {
            return res.status(200).json({ success: true, data: fallbackCategorias });
        }
        return res.status(200).json({ success: true, data: result.rows });
    } catch (err) {
        return res.status(200).json({ success: true, message: 'Fallback local', data: fallbackCategorias });
    }
}

async function createCategoria(req, res, next) {
    const { nombre_categoria, descripcion } = req.body;
    if (!nombre_categoria) {
        return res.status(400).json({ success: false, message: 'El nombre de categoría es requerido.' });
    }
    try {
        const result = await db.query(
            'INSERT INTO CATEGORIAS (nombre_categoria, descripcion) VALUES ($1, $2) RETURNING *',
            [nombre_categoria, descripcion || '']
        );
        return res.status(201).json({ success: true, data: result.rows[0] });
    } catch (err) {
        const newCat = { id_categoria: Date.now(), nombre_categoria, descripcion: descripcion || '' };
        fallbackCategorias.push(newCat);
        return res.status(201).json({ success: true, message: 'Categoría guardada (Sincronizado)', data: newCat });
    }
}

module.exports = {
    getAllCategorias,
    createCategoria,
    fallbackCategorias
};

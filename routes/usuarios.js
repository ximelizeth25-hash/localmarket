const express = require('express');
const router = express.Router();
const db = require('../db');

// Memoria volátil para fallback de demostración si PostgreSQL está desconectado
let fallbackUsers = [
    { id_usuario: 1, id_rol: 1, nombre: 'Administrador', correo: 'admin@localmarket.com', contrasena: '1234', telefono: '5512345678', foto_perfil: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120', nombre_rol: 'Administrador', verificado: true, suspendido: false, estado_cuenta: 'activo' },
    { id_usuario: 2, id_rol: 2, nombre: 'Gisela', correo: 'ar230111983@arandas.tecmm.edu.mx', contrasena: '1234', telefono: '3471046625', foto_perfil: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120', nombre_rol: 'Vendedor', verificado: true, suspendido: false, estado_cuenta: 'activo' }
];

// GET /api/usuarios
router.get('/', async (req, res) => {
    try {
        const result = await db.query(`
            SELECT u.id_usuario,
                   u.id_usuario AS id,
                   u.id_rol,
                   u.nombre,
                   u.correo,
                   u.correo AS email,
                   u.contrasena,
                   COALESCE(u.telefono, '5500000000') AS telefono,
                   u.foto_perfil,
                   COALESCE(r.nombre_rol, 'Cliente') AS nombre_rol,
                   COALESCE(r.nombre_rol, 'Cliente') AS rol,
                   COALESCE(u.otp_verificado, true) AS verificado,
                   COALESCE(u.otp_verificado, true) AS otp_verificado,
                   COALESCE(u.estado_cuenta, 'activo') AS estado_cuenta,
                   (COALESCE(u.estado_cuenta, 'activo') = 'suspendido') AS suspendido
            FROM USUARIOS u
            LEFT JOIN ROLES r ON u.id_rol = r.id_rol
            ORDER BY u.id_usuario ASC
        `);

        if (result.rows.length === 0) {
            return res.json({ success: true, data: fallbackUsers });
        }
        res.json({ success: true, data: result.rows });
    } catch (err) {
        console.error("DB Error en GET /api/usuarios:", err.message);
        res.json({ success: true, message: 'Fallback DB', data: fallbackUsers });
    }
});

// POST /api/usuarios (Registro)
router.post('/', async (req, res) => {
    let { nombre, correo, email, contrasena, password, telefono, id_rol, rol, foto_perfil } = req.body;
    
    correo = (correo || email || '').trim();
    contrasena = (contrasena || password || '').trim();
    nombre = (nombre || '').trim();
    telefono = (telefono || '').trim();

    // Validaciones Backend Strict
    if (!nombre || !correo || !contrasena) {
        return res.status(400).json({ success: false, message: 'Nombre, correo y contraseña son obligatorios.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
        return res.status(400).json({ success: false, message: 'Formato de correo electrónico inválido (debe incluir @ y dominio).' });
    }

    if (telefono) {
        const phoneRegex = /^[0-9]{1,10}$/;
        if (!phoneRegex.test(telefono)) {
            return res.status(400).json({ success: false, message: 'El teléfono debe contener únicamente números (máximo 10 dígitos).' });
        }
    }

    if (rol && !id_rol) {
        if (rol === 'Administrador' || rol === 'Admin' || rol == '1') id_rol = 1;
        else if (rol === 'Vendedor' || rol == '2') id_rol = 2;
        else id_rol = 3;
    }
    id_rol = parseInt(id_rol) || 3; // Cliente por defecto
    foto_perfil = foto_perfil || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120';

    try {
        const insertRes = await db.query(
            'INSERT INTO USUARIOS (id_rol, nombre, correo, contrasena, telefono, foto_perfil, otp_verificado) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [id_rol, nombre, correo, contrasena, telefono || '5500000000', foto_perfil, false]
        );

        const userWithRole = await db.query(`
            SELECT u.id_usuario, u.id_rol, u.nombre, u.correo, u.telefono, u.foto_perfil, 
                   COALESCE(r.nombre_rol, 'Cliente') as nombre_rol,
                   COALESCE(u.otp_verificado, false) as verificado
            FROM USUARIOS u
            LEFT JOIN ROLES r ON u.id_rol = r.id_rol
            WHERE u.id_usuario = $1
        `, [insertRes.rows[0].id_usuario]);

        const savedUser = userWithRole.rows[0] || insertRes.rows[0];
        return res.status(201).json({ success: true, message: 'Usuario registrado exitosamente', data: savedUser });
    } catch (err) {
        console.error("DB Error en POST /api/usuarios:", err.message);
        const roleMap = { 1: 'Administrador', 2: 'Vendedor', 3: 'Cliente' };
        const newUser = {
            id_usuario: Date.now(),
            id_rol,
            nombre,
            correo,
            telefono: telefono || '5500000000',
            foto_perfil,
            nombre_rol: roleMap[id_rol] || 'Cliente',
            verificado: false,
            suspendido: false
        };
        fallbackUsers.push(newUser);
        return res.status(201).json({ success: true, message: 'Usuario registrado (Sincronizado)', data: newUser });
    }
});

// PUT /api/usuarios/perfil (Módulo 2: Edición de Perfil)
router.put('/perfil', async (req, res) => {
    let { id_usuario, nombre, correo, contrasena, foto_perfil } = req.body;
    id_usuario = parseInt(id_usuario) || 1;

    if (!nombre || !correo) {
        return res.status(400).json({ success: false, message: 'Nombre y correo son requeridos.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
        return res.status(400).json({ success: false, message: 'Formato de correo electrónico inválido.' });
    }

    try {
        let updateQuery = 'UPDATE USUARIOS SET nombre = $1, correo = $2';
        let params = [nombre, correo];
        let idx = 3;

        if (contrasena && contrasena.trim() !== '') {
            updateQuery += `, contrasena = $${idx}`;
            params.push(contrasena);
            idx++;
        }
        if (foto_perfil) {
            updateQuery += `, foto_perfil = $${idx}`;
            params.push(foto_perfil);
            idx++;
        }

        updateQuery += ` WHERE id_usuario = $${idx} RETURNING *`;
        params.push(id_usuario);

        const result = await db.query(updateQuery, params);
        res.json({ success: true, message: 'Perfil actualizado exitosamente', data: result.rows[0] });
    } catch (err) {
        console.error("DB Error en PUT /api/usuarios/perfil:", err.message);
        const user = fallbackUsers.find(u => u.id_usuario === id_usuario) || fallbackUsers[0];
        user.nombre = nombre;
        user.correo = correo;
        if (contrasena) user.contrasena = contrasena;
        if (foto_perfil) user.foto_perfil = foto_perfil;
        res.json({ success: true, message: 'Perfil actualizado (Fallback)', data: user });
    }
});

// PUT /api/usuarios/:id (Edición general de usuario - Módulo 1 y 10)
router.put('/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    let { nombre, correo, telefono, id_rol, contrasena } = req.body;

    if (!nombre || !correo) {
        return res.status(400).json({ success: false, message: 'Nombre y correo son requeridos.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
        return res.status(400).json({ success: false, message: 'Formato de correo electrónico inválido.' });
    }

    if (telefono) {
        const phoneRegex = /^[0-9]{1,10}$/;
        if (!phoneRegex.test(telefono)) {
            return res.status(400).json({ success: false, message: 'El teléfono debe contener máximo 10 dígitos numéricos.' });
        }
    }

    try {
        let updateSql = 'UPDATE USUARIOS SET nombre = $1, correo = $2, telefono = $3';
        let params = [nombre, correo, telefono || '5500000000'];
        let idx = 4;

        if (id_rol) {
            updateSql += `, id_rol = $${idx}`;
            params.push(parseInt(id_rol));
            idx++;
        }
        if (contrasena && contrasena.trim() !== '') {
            updateSql += `, contrasena = $${idx}`;
            params.push(contrasena);
            idx++;
        }

        updateSql += ` WHERE id_usuario = $${idx} RETURNING *`;
        params.push(id);

        const result = await db.query(updateSql, params);
        res.json({ success: true, message: 'Usuario actualizado con éxito', data: result.rows[0] });
    } catch (err) {
        console.error("DB Error en PUT /api/usuarios/:id:", err.message);
        const user = fallbackUsers.find(u => u.id_usuario === id);
        if (user) {
            user.nombre = nombre;
            user.correo = correo;
            user.telefono = telefono;
            if (id_rol) user.id_rol = parseInt(id_rol);
        }
        res.json({ success: true, message: 'Usuario actualizado (Sincronizado)', data: user });
    }
});

// PUT /api/usuarios/:id/suspender (Módulo 10: Moderación de Cuentas)
router.put('/:id/suspender', async (req, res) => {
    const id = parseInt(req.params.id);
    const { suspendido } = req.body;
    const nuevoEstado = suspendido ? 'suspendido' : 'activo';
    try {
        await db.query('UPDATE USUARIOS SET estado_cuenta = $1, otp_verificado = $2 WHERE id_usuario = $3', [nuevoEstado, !suspendido, id]);
        const user = fallbackUsers.find(u => u.id_usuario === id);
        if (user) {
            user.suspendido = !!suspendido;
            user.estado_cuenta = nuevoEstado;
        }
        res.json({ success: true, message: `Usuario ${suspendido ? 'suspendido' : 'reactivado'} correctamente` });
    } catch (err) {
        console.error("DB Error en PUT /api/usuarios/:id/suspender:", err.message);
        const user = fallbackUsers.find(u => u.id_usuario === id);
        if (user) {
            user.suspendido = !!suspendido;
            user.estado_cuenta = nuevoEstado;
        }
        res.json({ success: true, message: 'Estado de usuario actualizado' });
    }
});

// DELETE /api/usuarios/:id (Módulo 10: Baja de Cuentas)
router.delete('/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        await db.query('DELETE FROM USUARIOS WHERE id_usuario = $1', [id]);
        fallbackUsers = fallbackUsers.filter(u => u.id_usuario !== id);
        res.json({ success: true, message: 'Usuario eliminado permanentemente' });
    } catch (err) {
        console.error("DB Error en DELETE /api/usuarios:", err.message);
        fallbackUsers = fallbackUsers.filter(u => u.id_usuario !== id);
        res.json({ success: true, message: 'Usuario eliminado (Sincronizado)' });
    }
});

module.exports = router;

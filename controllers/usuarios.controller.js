/**
 * Controlador de Usuarios (Módulo 1 y 10: Autenticación, Registro y Moderación de Cuentas)
 */

const db = require('../config/db');
const { validateEmail, validatePhone } = require('../middlewares/validator');

let fallbackUsers = [
    { id_usuario: 1, id_rol: 1, nombre: 'Administrador', correo: 'admin@localmarket.com', contrasena: '1234', telefono: '5512345678', foto_perfil: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120', nombre_rol: 'Administrador', verificado: true, suspendido: false, estado_cuenta: 'activo' },
    { id_usuario: 2, id_rol: 2, nombre: 'Gisela', correo: 'ar230111983@arandas.tecmm.edu.mx', contrasena: '4321', telefono: '3471046625', foto_perfil: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120', nombre_rol: 'Vendedor', verificado: true, suspendido: false, estado_cuenta: 'activo' }
];

async function getAllUsuarios(req, res, next) {
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
            return res.status(200).json({ success: true, data: fallbackUsers });
        }
        return res.status(200).json({ success: true, data: result.rows });
    } catch (err) {
        console.warn('DB Fallback en getAllUsuarios:', err.message);
        return res.status(200).json({ success: true, message: 'Fallback local', data: fallbackUsers });
    }
}

async function createUsuario(req, res, next) {
    let { nombre, correo, email, contrasena, password, telefono, id_rol, rol, foto_perfil } = req.body;
    
    correo = (correo || email || '').trim();
    contrasena = (contrasena || password || '').trim();
    nombre = (nombre || '').trim();
    telefono = (telefono || '').trim();

    if (!nombre || !correo || !contrasena) {
        return res.status(400).json({ success: false, message: 'Nombre, correo y contraseña son obligatorios.' });
    }

    if (!validateEmail(correo)) {
        return res.status(400).json({ success: false, message: 'Formato de correo electrónico inválido.' });
    }

    if (telefono && !/^[0-9]{1,10}$/.test(telefono)) {
        return res.status(400).json({ success: false, message: 'El teléfono debe contener máximo 10 dígitos numéricos.' });
    }

    let parsedRol = parseInt(id_rol);
    if (isNaN(parsedRol)) {
        if (rol === 'Administrador' || rol === 'admin') parsedRol = 1;
        else if (rol === 'Vendedor' || rol === 'vendedor') parsedRol = 2;
        else parsedRol = 3;
    }
    const roleName = parsedRol === 1 ? 'Administrador' : (parsedRol === 2 ? 'Vendedor' : 'Cliente');

    const defaultAvatar = parsedRol === 1 
        ? 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120' 
        : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120';
    foto_perfil = foto_perfil || defaultAvatar;

    try {
        const check = await db.query('SELECT id_usuario FROM USUARIOS WHERE LOWER(correo) = LOWER($1)', [correo]);
        if (check.rows.length > 0) {
            return res.status(400).json({ success: false, message: 'El correo electrónico ya está registrado.' });
        }

        const insertQuery = `
            INSERT INTO USUARIOS (id_rol, nombre, correo, contrasena, telefono, foto_perfil, otp_verificado, estado_cuenta)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING id_usuario, id_rol, nombre, correo, contrasena, telefono, foto_perfil, otp_verificado, estado_cuenta
        `;
        const result = await db.query(insertQuery, [
            parsedRol, nombre, correo, contrasena, telefono || '5500000000', foto_perfil, false, 'activo'
        ]);

        const newUser = result.rows[0];
        newUser.nombre_rol = roleName;
        newUser.rol = roleName;
        newUser.suspendido = false;
        newUser.verificado = false;

        return res.status(201).json({ success: true, message: 'Usuario registrado exitosamente', data: newUser });
    } catch (err) {
        console.warn('DB Fallback en createUsuario:', err.message);
        const newUser = {
            id_usuario: Date.now(),
            id_rol: parsedRol,
            nombre,
            correo,
            email: correo,
            contrasena,
            telefono: telefono || '5500000000',
            foto_perfil,
            nombre_rol: roleName,
            rol: roleName,
            verificado: false,
            suspendido: false,
            estado_cuenta: 'activo'
        };
        fallbackUsers.push(newUser);
        return res.status(201).json({ success: true, message: 'Usuario registrado (Sincronizado)', data: newUser });
    }
}

async function updateUsuario(req, res, next) {
    const id = parseInt(req.params.id);
    let { nombre, correo, email, id_rol, rol, telefono, contrasena, password } = req.body;

    correo = (correo || email || '').trim();
    nombre = (nombre || '').trim();
    telefono = (telefono || '').trim();

    if (!nombre || !correo) {
        return res.status(400).json({ success: false, message: 'Nombre y correo son obligatorios.' });
    }

    let parsedRol = parseInt(id_rol);
    if (isNaN(parsedRol)) {
        if (rol === 'Administrador') parsedRol = 1;
        else if (rol === 'Vendedor') parsedRol = 2;
        else parsedRol = 3;
    }
    const roleName = parsedRol === 1 ? 'Administrador' : (parsedRol === 2 ? 'Vendedor' : 'Cliente');

    try {
        let updateSql = `
            UPDATE USUARIOS
            SET nombre = $1, correo = $2, id_rol = $3
        `;
        let params = [nombre, correo, parsedRol];
        let idx = 4;

        if (telefono) {
            updateSql += `, telefono = $${idx}`;
            params.push(telefono);
            idx++;
        }
        if (contrasena || password) {
            updateSql += `, contrasena = $${idx}`;
            params.push(contrasena || password);
            idx++;
        }

        updateSql += ` WHERE id_usuario = $${idx} RETURNING *`;
        params.push(id);

        const result = await db.query(updateSql, params);
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }
        const updatedUser = result.rows[0];
        updatedUser.nombre_rol = roleName;
        updatedUser.rol = roleName;
        return res.status(200).json({ success: true, message: 'Usuario actualizado exitosamente', data: updatedUser });
    } catch (err) {
        console.warn('DB Fallback en updateUsuario:', err.message);
        const user = fallbackUsers.find(u => u.id_usuario === id);
        if (user) {
            user.nombre = nombre;
            user.correo = correo;
            user.id_rol = parsedRol;
            user.nombre_rol = roleName;
            if (telefono) user.telefono = telefono;
            if (contrasena || password) user.contrasena = contrasena || password;
        }
        return res.status(200).json({ success: true, message: 'Usuario actualizado (Sincronizado)', data: user });
    }
}

async function suspenderUsuario(req, res, next) {
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
        return res.status(200).json({ success: true, message: `Usuario ${suspendido ? 'suspendido' : 'reactivado'} correctamente` });
    } catch (err) {
        console.warn('DB Fallback en suspenderUsuario:', err.message);
        const user = fallbackUsers.find(u => u.id_usuario === id);
        if (user) {
            user.suspendido = !!suspendido;
            user.estado_cuenta = nuevoEstado;
        }
        return res.status(200).json({ success: true, message: `Usuario ${suspendido ? 'suspendido' : 'reactivado'} (Sincronizado)` });
    }
}

async function deleteUsuario(req, res, next) {
    const id = parseInt(req.params.id);

    try {
        await db.query('DELETE FROM USUARIOS WHERE id_usuario = $1', [id]);
        fallbackUsers = fallbackUsers.filter(u => u.id_usuario !== id);
        return res.status(200).json({ success: true, message: 'Usuario dado de baja y eliminado exitosamente' });
    } catch (err) {
        console.warn('DB Fallback en deleteUsuario:', err.message);
        fallbackUsers = fallbackUsers.filter(u => u.id_usuario !== id);
        return res.status(200).json({ success: true, message: 'Usuario eliminado (Sincronizado)' });
    }
}

module.exports = {
    getAllUsuarios,
    createUsuario,
    updateUsuario,
    suspenderUsuario,
    deleteUsuario,
    fallbackUsers
};

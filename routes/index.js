/**
 * Router Central de la API de LocalMarket
 * Consolida y distribuye todas las rutas bajo /api/...
 */

const express = require('express');
const router = express.Router();

// Rutas modulares con arquitectura de controladores
const authRoutes = require('./auth.routes');
const usuariosRoutes = require('./usuarios.routes');
const productosRoutes = require('./productos.routes');
const pedidosRoutes = require('./pedidos.routes');
const otpRoutes = require('./otp.routes');
const adminRoutes = require('./admin.routes');
const categoriasRoutes = require('./categorias.routes');

// Rutas complementarias del sistema
const direccionesRoutes = require('./direcciones');
const rolesRoutes = require('./roles');
const permisosRoutes = require('./permisos');
const rolesPermisosRoutes = require('./roles_permisos');
const costosRoutes = require('./costos_fijos');
const detalleRoutes = require('./detalle_venta');
const preguntasRoutes = require('./preguntas_producto');

// Montaje de endpoints RESTful
router.use('/', authRoutes); // /api/login
router.use('/auth', authRoutes); // /api/auth/login
router.use('/usuarios', usuariosRoutes);
router.use('/productos', productosRoutes);
router.use('/pedidos_ventas', pedidosRoutes);
router.use('/pedidos', pedidosRoutes);
router.use('/otp', otpRoutes);
router.use('/admin', adminRoutes);
router.use('/categorias', categoriasRoutes);
router.use('/direcciones', direccionesRoutes);
router.use('/roles', rolesRoutes);
router.use('/permisos', permisosRoutes);
router.use('/roles_permisos', rolesPermisosRoutes);
router.use('/costos_fijos', costosRoutes);
router.use('/detalle_venta', detalleRoutes);
router.use('/preguntas_producto', preguntasRoutes);

module.exports = router;

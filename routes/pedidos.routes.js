const express = require('express');
const router = express.Router();
const pedidosController = require('../controllers/pedidos.controller');

router.get('/', pedidosController.getAllPedidos);
router.post('/', pedidosController.createPedido);
router.put('/:id/estado', pedidosController.updateEstadoPedido);
router.put('/:id/cancelar', pedidosController.cancelarPedido);

module.exports = router;

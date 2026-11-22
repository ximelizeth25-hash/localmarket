const express = require('express');
const router = express.Router();
const pedidosController = require('../controllers/pedidos.controller');

router.get('/', pedidosController.getAllPedidos);
router.get('/:id/detalle', pedidosController.getPedidoDetalle);
router.get('/:id', pedidosController.getPedidoDetalle);
router.post('/', pedidosController.createPedido);
router.put('/:id/estado', pedidosController.updateEstadoPedido);
router.put('/:id/cancelar', pedidosController.cancelarPedido);

module.exports = router;

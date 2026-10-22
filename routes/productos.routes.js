const express = require('express');
const router = express.Router();
const productosController = require('../controllers/productos.controller');

router.get('/', productosController.getAllProductos);
router.get('/bajo-stock', productosController.getBajoStock);
router.get('/:id', productosController.getProductoById);
router.post('/', productosController.createProducto);
router.put('/:id', productosController.updateProducto);
router.put('/:id/moderar', productosController.moderarProducto);
router.delete('/:id', productosController.deleteProducto);

module.exports = router;

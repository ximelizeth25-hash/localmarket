const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuarios.controller');

router.get('/', usuariosController.getAllUsuarios);
router.post('/', usuariosController.createUsuario);
router.put('/:id', usuariosController.updateUsuario);
router.put('/:id/suspender', usuariosController.suspenderUsuario);
router.delete('/:id', usuariosController.deleteUsuario);

module.exports = router;

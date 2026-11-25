const express = require('express');
const router = express.Router();
const cortesController = require('../controllers/cortes.controller');

router.get('/', cortesController.getCortes);
router.post('/', cortesController.createCorte);

module.exports = router;

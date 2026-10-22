const express = require('express');
const router = express.Router();
const otpController = require('../controllers/otp.controller');

router.get('/', otpController.getOtpHistory);
router.post('/', otpController.generateOtp);
router.post('/validar', otpController.validarOtp);
router.post('/bloquear', otpController.bloquearUsuario);
router.post('/desbloquear', otpController.desbloquearOtp);

module.exports = router;

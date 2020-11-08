const express = require('express');
const authController = require('../controllers/auth');
const router = express.Router();

router.post('/userRegisterPage', authController.userRegisterPage); //access via post - submitting form

router.post('/userLoginPage', authController.userLoginPage); //access via post - submitting form

router.post('/adminLoginPage', authController.adminLoginPage); //access via post - submitting form

router.get('/logout', authController.logout);

router.post('/userSendEmail', authController.userSendEmail);

router.get('/userForgotPassword', authController.userForgotPassword);

router.post('/userForgotPassword', authController.userForgotPassword);

module.exports = router;
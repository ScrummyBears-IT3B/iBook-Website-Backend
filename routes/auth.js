const express = require('express');
const authController = require('../controllers/auth');
const router = express.Router();


router.post('/userRegisterPage', authController.userRegisterPage); 

router.post('/userLoginPage', authController.userLoginPage); 

router.post('/adminLoginPage', authController.adminLoginPage); 

router.get('/logout', authController.logout);

router.get('/admin/logout', authController.logout);

router.post('/userSendEmail', authController.userSendEmail);

router.get('/userForgotPassword', authController.userForgotPassword);

router.post('/userForgotPassword', authController.userForgotPassword);


module.exports = router;
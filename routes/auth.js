const express = require('express');
const authController = require('../controllers/auth');
const router = express.Router();

router.post('/userRegisterPage', authController.userRegisterPage); //access via post - submitting form
router.post('/userLoginPage', authController.userLoginPage); //access via post - submitting form

module.exports = router;
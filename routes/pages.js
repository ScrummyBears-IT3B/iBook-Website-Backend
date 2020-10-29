const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    res.render('index');
})

router.get('/admin', (req, res) => {
    res.render('adminLoginPage');
})

router.get('/userRegisterPage', (req,res) => {
    res.render('userRegisterPage');
})

router.get('/userLoginPage', (req,res) => {
    res.render('userLoginPage');
})

router.get('/userForgetPassword', (req,res) => {
    res.render('userForgetPassword');
})
module.exports = router;
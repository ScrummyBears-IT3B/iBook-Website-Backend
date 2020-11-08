const express = require('express');
const authController = require('../controllers/auth');
const router = express.Router();
const nodemailer = require('nodemailer');
const async = require('async');


//router to check if user is logged in
router.get('/', authController.isLoggedIn, (req, res) => {
    res.render('index',{
    user: req.user
});
})
//router to check if admin is logged in
router.get('/adminPage', authController.adminIsLoggedIn, (req, res) => {
    if (req.admin) { 
        res.render('adminPage');
    }   else {
        res.redirect('/admin');
    }
});


//router to admin login page
router.get('/admin', authController.adminIsLoggedIn, (req, res) => {
    if (req.admin) { 
        return res.redirect('/adminPage');
    }   else {
        res.render('adminLoginPage');
    }
       
    })


//router to user register page
router.get('/userRegisterPage', (req,res) => {
    res.render('userRegisterPage');
})

//router to user login page
router.get('/userLoginPage', authController.isLoggedIn, (req,res) => {
    //check if there's a user
    if (req.user) {     
    res.redirect('/');
}   else {
    res.render('userLoginPage');
}
   
})

//router to user forget password
router.get('/userForgotPassword', (req,res) => {
    res.render('userForgotPassword');
})

//router to user forget password
router.get('/userSendEmail', (req,res) => {
    res.render('userSendEmail');
})

router.get('/profile', authController.isLoggedIn, (req, res) => {
    //console.log(req.message);
    if (req.user) { //check if there's a user
    res.render('profile');
}   else {
    res.redirect('/userLoginPage');
}
})


module.exports = router;


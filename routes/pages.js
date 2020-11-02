const express = require('express');
const authController = require('../controllers/auth');

const router = express.Router();


router.get('/', authController.isLoggedIn, (req, res) => {
    res.render('index',{
    user: req.user
});
})

router.get('/admin', (req, res) => {
    res.render('adminLoginPage');
})

router.get('/userRegisterPage', (req,res) => {
    res.render('userRegisterPage');
})

router.get('/userLoginPage', authController.isLoggedIn, (req,res) => {
    if (req.user) { //check if there's a user
    res.redirect('/profile');
}   else {
    res.render('userLoginPage');
}
   
})

router.get('/userForgetPassword', (req,res) => {
    res.render('userForgetPassword');
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


const express = require('express');
const authController = require('../controllers/auth');
const router = express.Router();
const mysql = require("mysql");

//DATABASE CONNECTION
const db = mysql.createPool({ 
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});


//router to check if user is logged in
router.get('/', authController.isLoggedIn, (req, res) => {
    res.render('index', {
        user: req.user
    });
})


//router to check if admin is logged in
router.get('/adminPage', authController.adminIsLoggedIn, (req, res) => {
    if (req.admin) {
        res.render('adminPage');
    } else {
        res.redirect('/adminLoginPage');
    }
});

//router to admin login page
router.get('/adminLoginPage', authController.adminIsLoggedIn, (req, res) => {
    if (req.admin) {
         res.redirect('/adminPage');
    } else {
        res.render('adminLoginPage');
    }
})


//router to user register page
router.get('/userRegisterPage', (req, res) => {
    res.render('userRegisterPage');
})

//router to user login page
router.get('/userLoginPage', authController.isLoggedIn, (req, res) => {
    //check if there's a user
    if (req.user) {
        res.redirect('/');
    } else {
        res.render('userLoginPage');
    }
})

//router to user forget password
router.get('/userForgotPassword', (req, res) => {
    res.render('userForgotPassword');
})

//router to user forget password
router.get('/userSendEmail', (req, res) => {
    res.render('userSendEmail');
})

router.get('/adminAddBook', (req, res) => {
    res.render('adminAddBook');
})

router.get('/adminModifyBook/:bookID', (req, res) => {
    const bookID = req.params.bookID;
    var sql = 'SELECT * FROM books_table WHERE BOOK_ID = ?';
    db.query(sql, [bookID], function (error, data){
        if (error) {
            throw error;
        }
        else {
            res.render('adminModifyBook', { book: data});
}})
})

router.get('/adminDeleteBook/:bookID', (req, res) => {
    const bookID = req.params.bookID;

    db.query('DELETE FROM books_table WHERE BOOK_ID = ?', [bookID], async (error, data) => {
        if (error) {
            throw error;
        }
        //  res.redirect("/adminBooksData");
        else {
            res.redirect("/adminBooksData");
            //res.render('adminBooksData', { title: 'Books List', bookData: data});
        }
    })
})

router.get('/adminBooksData', (req, res) => {
    var sql='SELECT * FROM books_table';
    db.query(sql, function (err, data, fields) {
    if (err) throw err;
    
    var sqltotal = "SELECT COUNT(*) AS booksCount FROM books_table";
    db.query(sqltotal, function(err, result) {
 
    console.log("Total Records: " + result[0].booksCount);

    res.render('adminBooksData', { title: 'Books List', bookData: data, booksCount: result});
});
})
})


router.get('/adminUsersData', function(req, res, next) {
    var sql='SELECT * FROM users_table';
    db.query(sql, function (err, data, fields) {
    if (err) throw err;
    res.render('adminUsersData', { title: 'User List', userData: data});
  });
});


router.get('/userProfile', authController.isLoggedIn, (req, res) => {
    if (req.user) {
        res.render('userProfile');
    } else {
        res.redirect('/userLoginPage');
    }
})


module.exports = router;
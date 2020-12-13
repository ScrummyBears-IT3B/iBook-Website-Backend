const express = require('express');
const authController = require('../controllers/auth');
const router = express.Router();
const mysql = require("mysql");

//DATABASE CONNECTION
const db = mysql.createPool({ 
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: '',
    database: process.env.DATABASE
});


//router to check if user is logged in
router.get('/', authController.isLoggedIn, (req, res) => {
    var sql='SELECT * FROM books_table ORDER BY BOOK_ID DESC LIMIT 8 OFFSET 0 ';
    db.query(sql, function (err, newrelease, fields) {
    if (err) throw err;
    res.render('index', {
        user: req.user,
        newBook: newrelease
    });
})
})



//router to check if admin is logged in
router.get('/adminPage', authController.adminIsLoggedIn, (req, res) => {
    if (req.admin) {
    var sql='SELECT * FROM books_table LIMIT 10';
    db.query(sql, function (err, data, fields) {
    if (err) throw err;
    
        var bookTotal = "SELECT COUNT(*) AS booksCount FROM books_table";
        db.query(bookTotal, function(err, result) {
                
                var usersTotal = "SELECT COUNT(*) AS usersCount FROM users_table";
                 db.query(usersTotal, function(err, result2) {

         res.render('adminPage', { usersCount: result2, bookData: data, booksCount: result});
        });
    });
})
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

router.get('/display/all-books/:page', (req, res) => {
    const page = req.params.page;

   if (page === '1') {
        var sql = 'SELECT * FROM books_table LIMIT 20 OFFSET 0';

        db.query(sql, function (err, data, fields) {
                if (err) throw err;
                res.render('displayBooks', {
                    title: 'All Books',
                    bookData: data,
                });
        });

    } 
    else if (page === '2') {
        var sql = 'SELECT * FROM books_table LIMIT 5 OFFSET 20';

        db.query(sql, function (err, data, fields) {
                if (err) throw err;
                res.render('displayBooks', {
                    title: 'All Books',
                    bookData: data,
                });
        });

    } 

})



router.get('/category/action-adventure', (req, res) => {
    var sql="SELECT * FROM books_table WHERE BOOK_CATEGORY = 'Action and Adventure'";
    db.query(sql, function (err, data, fields) {
    if (err) throw err;
    res.render('categoryActAdvPage', {category: 'action-adventure', title: 'Action and Adventure', bookData: data});
});
})

router.get('/category/childrens-fiction', (req, res) => {
    var sql="SELECT * FROM books_table WHERE BOOK_CATEGORY = 'Childrens Fiction'";
    db.query(sql, function (err, data, fields) {
    if (err) throw err;
    res.render('categoryChildrensPage', {category: 'childrens-fiction', title: 'Childrens Fiction', bookData: data});
});
})

router.get('/category/comic-graphic', (req, res) => {
    var sql="SELECT * FROM books_table WHERE BOOK_CATEGORY = 'Comic and Graphic Novel'";
    db.query(sql, function (err, data, fields) {
    if (err) throw err;
    res.render('categoryComicPage', {category: 'comic-graphic', title: 'Comic and Graphic Novel', bookData: data});
});
})

router.get('/category/drama', (req, res) => {
    var sql="SELECT * FROM books_table WHERE BOOK_CATEGORY = 'Drama'";
    db.query(sql, function (err, data, fields) {
    if (err) throw err;
    res.render('categoryDramaPage', {category: 'drama', title: 'Drama', bookData: data});
});
})

router.get('/category/fairytale', (req, res) => {
    var sql="SELECT * FROM books_table WHERE BOOK_CATEGORY = 'Fairy Tale'";
    db.query(sql, function (err, data, fields) {
    if (err) throw err;
    res.render('categoryFairyPage', {category: 'fairytale', title: 'Fairy Tale', bookData: data});
});
})

router.get('/category/fantasy-scifi', (req, res) => {
    var sql="SELECT * FROM books_table WHERE BOOK_CATEGORY = 'Fantasy and Sci-Fi'";
    db.query(sql, function (err, data, fields) {
    if (err) throw err;
    res.render('categoryFanSciPage', {category: 'fantasy-scifi', title: 'Fantasy and Sci-Fi', bookData: data});
});
})

router.get('/category/mystery', (req, res) => {
    var sql="SELECT * FROM books_table WHERE BOOK_CATEGORY = 'Mystery'";
    db.query(sql, function (err, data, fields) {
    if (err) throw err;
    res.render('categoryMystPage', {category: 'mystery', title: 'Mystery', bookData: data});
});})

router.get('/category/romance', (req, res) => {
    var sql="SELECT * FROM books_table WHERE BOOK_CATEGORY = 'Romance'";
    db.query(sql, function (err, data, fields) {
    if (err) throw err;
    res.render('categoryRomancePage', {category: 'romance', title: 'Romance', bookData: data});
});
})

router.get('/category/horror-thriller', (req, res) => {
    var sql="SELECT * FROM books_table WHERE BOOK_CATEGORY = 'Horror and Thriller'";
    db.query(sql, function (err, data, fields) {
    if (err) throw err;
    res.render('categoryThrillerPage', {category: 'horror-thriller', title: 'Horror and Thriller', bookData: data});
});
})

router.get('/category/young-adult', (req, res) => {
    var sql="SELECT * FROM books_table WHERE BOOK_CATEGORY = 'Young Adult'";
    db.query(sql, function (err, data, fields) {
    if (err) throw err;
    res.render('categoryYoungPage', {category: 'young-adult', title: 'Young Adult', bookData: data});
});
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
            res.redirect("/adminBooksData/1");
            //res.render('adminBooksData', { title: 'Books List', bookData: data});
        }
    })
})

router.get('/adminBooksData/:page', (req, res) => {
    const page = req.params.page;

    if (page === '1') {
    var sql='SELECT * FROM books_table LIMIT 10 OFFSET 0';
    db.query(sql, function (err, data, fields) {
        if (err) throw err;
        
        var sqltotal = "SELECT COUNT(*) AS booksCount FROM books_table";
        db.query(sqltotal, function(err, result) {
     
        console.log("Total Records: " + result[0].booksCount);
    
        res.render('adminBooksData', { title: 'Books List', bookData: data, booksCount: result});
    });
    })
    }
    else if (page === '2') {
        var sql = 'SELECT * FROM books_table LIMIT 10 OFFSET 10';
        db.query(sql, function (err, data, fields) {
            if (err) throw err;
            
            var sqltotal = "SELECT COUNT(*) AS booksCount FROM books_table";
            db.query(sqltotal, function(err, result) {
         
            console.log("Total Records: " + result[0].booksCount);
        
            res.render('adminBooksData', { title: 'Books List', bookData: data, booksCount: result});
        });
        })
        
    }
    else if (page === '3') {
        var sql = 'SELECT * FROM books_table LIMIT 10 OFFSET 20';
        db.query(sql, function (err, data, fields) {
            if (err) throw err;
            
            var sqltotal = "SELECT COUNT(*) AS booksCount FROM books_table";
            db.query(sqltotal, function(err, result) {
         
            console.log("Total Records: " + result[0].booksCount);
        
            res.render('adminBooksData', { title: 'Books List', bookData: data, booksCount: result});
        });
        })
    }

  

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
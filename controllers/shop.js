const mysql = require("mysql");
const Cart = require('./cart');
const models = require( '../models/index');
const authController = require('../controllers/auth');

//DATABASE CONNECTION
const db = mysql.createPool({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});


exports.checkoutGcash= async (req, res, next) => {
  console.log(req.params.arr)
   var params = [req.params.arr].concat(req.params[0].split('/').slice(1));
   console.log(params);
   const gcash = req.body.gcashNum;
   const userID = req.params.userID;
   const mop = 'Gcash';
   

    if ((!gcash.match(/^(09)/)) || (isNaN(gcash))) {
        var cart = new Cart(req.session.cart);
        
        res.redirect('/check-out/error/gcash')
    }

    else{
        var datetime = new Date();
        var cart = new Cart(req.session.cart);

        db.query('INSERT INTO checkout_table SET ?', {
            USER_ID: userID,
            PAYMENT_METHOD: mop,
            PAYMENT_AMOUNT: cart.totalPrice,
            PAYMENT_DATE: datetime
        }, (error, results) => {
            if (error) {
                console.log(error);
            } else {
                
                for (var i = 0; i < (params.length); i++) {
                   
                    var checkoutInput = {
                        USER_ID: userID,
                        BOOK_ID: params[i],
                        PAYMENT_DATE: datetime
                    } 
                    
                    var sqlInput = 'INSERT INTO checkout_items_table SET ?';
                    db.query(sqlInput, [checkoutInput], function (err, result) {
                        if (err) throw err;
                    })
                }
               
                        var sql = 'UPDATE checkout_items_table, checkout_table SET checkout_items_table.CHECKOUT_ID = checkout_table.CHECKOUT_ID WHERE checkout_items_table.PAYMENT_DATE = checkout_table.PAYMENT_DATE';
                            db.query(sql, function (err, result) {
                                if (err) throw err;

                                req.session.cart = null;
                                var sql='SELECT * FROM users_table WHERE USER_ID = ?';
                                db.query(sql, [userID], function (err, data, fields) {
                                if (err) throw err;
                    
                                var sqlLibrary = `SELECT books_table.BOOK_TITLE AS title, 
                                                    books_table.BOOK_COVER AS cover
                                                    FROM books_table JOIN checkout_items_table ON books_table.BOOK_ID = checkout_items_table.BOOK_ID WHERE checkout_items_table.USER_ID = ?`
                                    db.query(sqlLibrary, [userID], function (err, books, fields) {
                                        if (err) throw err;
                    
                                            res.render('userProfile', {user:req.user, libraryBooks: books, userData:data});
                                })
                        })
                            })
                                
                    }
                    
                })
            
            }
        }


        




exports.checkoutCard = async (req, res, next) => {
    var params = [req.params.arr].concat(req.params[0].split('/').slice(1));
    const cardName = req.body.cardName;
    const cardNum = req.body.cardNum;
    const cardSec = req.body.cardCCV;
    const expMonth = req.body.expMonth;
    const expYear = req.body.expYear;
    const userID = req.params.userID;
    const mop = 'Debit/Credit Card';

    var alphabet = /^[A-Za-z\s]+$/;

    
     if ((!alphabet.test(cardName)) || (isNaN(cardNum))||(isNaN(cardSec))) {
        var cart = new Cart(req.session.cart);
        res.redirect('/check-out/error/card')

        }else{
            var datetime = new Date();
            var cart = new Cart(req.session.cart);

            db.query('INSERT INTO checkout_table SET ?', {
                USER_ID: userID,
                PAYMENT_METHOD: mop,
                PAYMENT_AMOUNT: cart.totalPrice,
                PAYMENT_DATE: datetime
            }, (error, results) => {
                if (error) {
                    console.log(error);
                } else {
                        
                    for (var i = 0; i < (params.length); i++) {
                    
                        var checkoutInput = {
                            USER_ID: userID,
                            PAYMENT_METHOD: mop,
                            PAYMENT_AMOUNT: cart.totalPrice,
                            PAYMENT_DATE: datetime
                        } 
                        
                        var sqlInput = 'INSERT INTO checkout_items_table SET ?';
                        db.query(sqlInput, [checkoutInput], function (err, result) {
                            if (err) throw err;
                        })
                    }
                
                            var sql = 'UPDATE checkout_items_table, checkout_table SET checkout_items_table.CHECKOUT_ID = checkout_table.CHECKOUT_ID WHERE checkout_items_table.PAYMENT_DATE = checkout_table.PAYMENT_DATE';
                                db.query(sql, function (err, result) {
                                    if (err) throw err;

                                    req.session.cart = null;
                                    var sql='SELECT * FROM users_table WHERE USER_ID = ?';
                                    db.query(sql, [userID], function (err, data, fields) {
                                    if (err) throw err;
                        
                                    var sqlLibrary = `SELECT books_table.BOOK_TITLE AS title, 
                                                        books_table.BOOK_COVER AS cover
                                                        FROM books_table JOIN checkout_items_table ON books_table.BOOK_ID = checkout_items_table.BOOK_ID WHERE checkout_items_table.USER_ID = ?`
                                        db.query(sqlLibrary, [userID], function (err, books, fields) {
                                            if (err) throw err;
                        
                                                res.render('userProfile', {user:req.user, libraryBooks: books, userData:data});
                                    })
                            })
                                })
                                    
                        }
                        
                    })
                
                }
 }

exports.reduceQuantity = async (req, res, next) => {
    const bookID = req.params.bookID;
    const cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.reduceByOne(bookID);
    req.session.cart = cart;
    res.redirect('/cart');
}

exports.increaseQuantity = async (req, res, next) => {
    const bookID = req.params.bookID;
    const cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.addByOne(bookID);
    req.session.cart = cart;
    res.redirect('/cart');
}

exports.addSelected = async (req, res, next) => {
    const bookID = req.params.bookID;
    const cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.addSelected(bookID);
    req.session.cart = cart;
    res.render('cartPage', {book: cart.generateArray(), totalPrice: cart.totalPrice });
}

exports.remove = async (req, res, next) => {
    const bookID = req.params.bookID;
    const cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.removeItem(bookID);
    req.session.cart = cart;
    res.redirect('/cart');
}

exports.removeSelected = async (req, res, next) => {
    const bookID = req.body.bookID;
    const cart = new Cart(req.session.cart ? req.session.cart : {});

    if(bookID){
        console.log("ok")
    }
    else{
        console.log("false")
    }

    
}

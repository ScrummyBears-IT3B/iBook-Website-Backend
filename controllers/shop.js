const mysql = require("mysql");
const Cart = require('./cart');
const models = require( '../models/index');

//DATABASE CONNECTION
const db = mysql.createPool({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});


exports.checkoutGcash = async (req, res, next) => {

   const gcash = req.body.gcashNum;
   const userID = req.params.userID;
   const mop = 'Gcash';

    if ((!gcash.match(/^(09)/)) || (isNaN(gcash))) {
        var cart = new Cart(req.session.cart);
        return res.render('checkOutPage', {
        message: 'Please input a valid gcash number', book: cart.generateArray(), total: cart.totalPrice
    });
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
                  console.log(results);
                  req.session.cart = null;
                  return res.render('userProfile', {
                  message: 'You successfully bought the book!'
                  });
            }
        })


        
    }
}


exports.checkoutCard = async (req, res, next) => {

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
        return res.render('checkOutPage', {
        message: 'Please input valid card credentials.', book: cart.generateArray(), total: cart.totalPrice
     });
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
              console.log(results);
              req.session.cart = null;
              return res.render('userProfile', {
              message: 'You successfully bought the book!'
              });
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

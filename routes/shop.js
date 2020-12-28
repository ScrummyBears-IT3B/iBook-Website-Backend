const express = require('express');
const shop = require('../controllers/shop');
const router = express.Router();


router.post('/check-out', shop.checkOut);

router.get('/reduce/:bookID', shop.reduceQuantity);

router.get('/inc/:bookID', shop.increaseQuantity);

router.get('/remove/:bookID', shop.remove);

module.exports = router;
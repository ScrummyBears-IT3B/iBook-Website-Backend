const express = require('express');
const database = require('../controllers/data');
const router = express.Router();

router.post('/sortUserData', database.sortUserData);

router.post('/searchUserData', database.searchUserData);

router.post('/adminSortBooks', database.adminSortBooks);

router.post('/adminSearchBooks', database.adminSearchBooks);

//router.get('/adminDeleteBook/:bookID', authController.adminDeleteBook);

//router.get('/adminModifyBook/:bookID', authController.adminModifyBook);

router.post('/adminAddBook', database.adminAddBook);

router.post('/adminSaveBook/:bookID', database.adminSaveBook);

module.exports = router;
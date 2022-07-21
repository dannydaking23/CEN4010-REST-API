// imports express
const express = require('express');


// imports Book Model 
const BookModel = require('../models/book');

const router = express.Router();

// route to GET all products in database
router.get('/books', BookModel.getAllBooks);



// route to GET books by isbn
router.get('/books/:isbn', BookModel.getBookByISBN);

// exports router
module.exports = router;
// imports express
const express = require('express');

// imports controllers/books file
const booksController = require('../controllers/books');


const router = express.Router();

// route to get all products in database
router.get('/books', booksController.getBooks);



// route to get books by isbn
router.get('/books/:isbn', booksController.getBooksByISBN);

// exports router
module.exports = router;
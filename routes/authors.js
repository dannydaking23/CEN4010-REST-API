// imports express
const express = require('express');

const router = express.Router();

// imports authors controller file
const authorsController = require('../controllers/authors');

// route to GET all authors
router.get('/authors', authorsController.getAuthors);

// route to GET all books by a certain author
router.get('/:authors/books', authorsController.getAuthorBooks);

// exports router
module.exports = router;
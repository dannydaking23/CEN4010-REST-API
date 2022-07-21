// imports express
const express = require('express');

const router = express.Router();

// imports Author Model
const AuthorModel = require('../models/author');

// route to GET all authors
router.get('/authors', AuthorModel.getAuthors);

// route to GET all books by a certain author
router.get('/:authors/books', AuthorModel.getAuthorBooks);

// exports router
module.exports = router;
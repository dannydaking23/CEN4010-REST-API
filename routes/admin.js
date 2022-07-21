// imports express
const express = require('express');

const BookAdmin = require('../models/book');

const AuthorAdmin = require('../models/author');


const router = express.Router();

router.use(express.json());


// ADD new book to db
router.post('/admin/add-book', BookAdmin.addNewBook);

// ADD new author to db
router.post('/admin/add-author', AuthorAdmin.addNewAuthor);

// exports router
module.exports = router;
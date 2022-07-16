// imports express
const express = require('express');

// imports controllers/products
const adminController = require('../controllers/admin');


const router = express.Router();

router.use(express.json());


// ADD new book to db
router.post('/admin/add-book', adminController.addNewBook);

// ADDs new author to db
router.post('/admin/add-author', adminController.addNewAuthor);

// exports router
module.exports = router;
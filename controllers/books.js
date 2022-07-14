
// imports Book object model
const BookModel = require ('../models/book');

// imports database
const db = require('../util/database');

// GETs all books in book table in database
exports.getBooks = (req, res, next) => {
    console.log('All products');
    BookModel.getAllBooks((err, books) => {
        if(err) {
            res.send(err);
        }
        else {
            
            res.send(books);
        }
    })
}

// GETs books by isbn from database
exports.getBooksByISBN = (req, res, next) => {
    console.log('Books by ISBN Called');
    db.query('SELECT * FROM books WHERE isbn = ?', [req.params.isbn], (err, result) => {
        if(err) throw err;
        
        res.json(result)
    });
}
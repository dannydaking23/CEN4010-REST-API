// imports Author object
const AuthorModel = require('../models/author');
const BookModel = require('../models/book');

// imports database
const db = require('../util/database');

// GETs all authors in authors table in database
exports.getAuthors = (req, res, next) => {
    console.log('All authors');
    AuthorModel.getAllAuthors((err, authors) => {
        if(err) {
            res.send(err);
        }
        else {          
            res.send(authors);
        }
    });
}

// GETs all books by a particular author in the database
exports.getAuthorBooks = (req, res, next) => {
    console.log('Authors and Books Called');
    db.query('SELECT books.* FROM authors JOIN books ON books.author = CONCAT(authors.firstName, " ",  authors.lastName) WHERE books.author = ?', [req.params.authors], (err, result) => {
        if(err) throw err;
    
        res.send(result);
    });
}


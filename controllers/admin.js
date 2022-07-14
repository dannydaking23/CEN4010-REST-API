// imports Book object model
const BookModel = require ('../models/book');

// imports Author object model
const authorModel = require('../models/author');

// imports database
const db = require('../util/database');

// ADD new book
exports.addNewBook = (req, res, next) => {
        // params for book database table
        let isbn = req.body.isbn
        let title = req.body.title
        let author = req.body.author
        let description = req.body.description
        let price = req.body.price
        let genre = req.body.genre
        let publisher = req.body.publisher
        let yearPublished = req.body.yearPublished
        let copiesSold = req.body.copiesSold
    
        console.log(isbn)
        const queryString = "INSERT INTO books (isbn, title, author, description, price, genre, publisher, yearPublished, copiesSold) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ? )"
        db.query(queryString, [isbn, title, author, description, price, genre, publisher, yearPublished, copiesSold], (err, results, fields) => {
            if(err) {
                console.log(err);
            }
            else {
                res.end(JSON.stringify(results));
            }
        })
    }

// ADD new author
exports.addNewAuthor = (req, res, next) => {
        // params for author database table
        let id = req.body.id
        let firstName = req.body.firstName
        let lastName = req.body.lastName
        let biography = req.body.biography
        let publisher = req.body.publisher
        
        const queryString = "INSERT INTO authors (firstName, lastName, biography, publisher) VALUES ( ?, ?, ?, ?)"
        db.query(queryString, [firstName, lastName, biography, publisher], (err, results, fields) => {
            if(err) {
                console.log(err);
            }
            else {
                
                res.end(JSON.stringify(results));
            }
        });
    }
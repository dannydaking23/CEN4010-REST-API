// IMPORTS SECTION

// imports express
const express = require('express');

// imports mysql
const mysql = require('mysql');

// allows use of express functions
const router = express.Router();

//********************************************************************** */

// DATABASE CONNECTION SECTION

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: '', // Enter your database folder name 
    password: '' // Enter your MySQL Workbench password
});


//********************************************************************** */

// CLASS/OBJECT SECTION

    // JSON fields
let Book = {
    // JSON data format
    isbn: {
        type: String
    },
    title: {
        type: String
    },
    author: {
        type: String
    },
    description: {
        type: String
    },
    price: {
        type: Number
    },
    genre: {
        type: String
    },
    publisher: {
        type: String
    },
    yearPublished: {
        type: String
    },
    copiesSold: {
        type: Number
    }
}


// Class/Object methods

// GET all books in database
Book.getAllBooks = (req, res, next) => {
    console.log('Showing all books in database');
    db.query('SELECT * FROM books', (err, result) => {
        if(err) {
            res.sendStatus(500);
            throw err;
        }
        else{
            console.log("Here are the requested books: ")
            res.json(result);
        }
    });
}

// GET all books by ISBN
Book.getBookByISBN = (req, res, next) => {
    console.log('Books by ISBN Called');
    db.query('SELECT * FROM books WHERE isbn = ?', [req.params.isbn], (err, result) => {
        if(err) {
            res.sendStatus(500);
            throw err;
        }
        else{
            console.log("Here is the requested book: ");
            res.json(result);
        }
    });
}
// ADD new book to database
Book.addNewBook = (req, res, next) => {
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
    
    if(!isbn || !title || !author || !description || !price || !genre || !publisher || !yearPublished || !copiesSold) {
        return res.status(400).send({Error: true, message: "One or more fields are empty"})
    }
    console.log(isbn)
    const queryString = "INSERT INTO books (isbn, title, author, description, price, genre, publisher, yearPublished, copiesSold) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ? )"
    db.query(queryString, [isbn, title, author, description, price, genre, publisher, yearPublished, copiesSold], (err, results, fields) => {
        if(err) {
            console.log(err);
        }
        else {
            console.log("Book Successfully inserted into database");
            res.end(JSON.stringify(results));
        }
    })
}

//********************************************************************** */

// ROUTER METHOD SECTION

// route to GET all books in database
router.get('/books', Book.getAllBooks);

// route to GET books by isbn
router.get('/books/:isbn', Book.getBookByISBN);

// route to POST new book to database
router.post('/admin/add-book', Book.addNewBook)
// exports router
module.exports = router;
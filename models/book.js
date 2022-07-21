const db = require('../util/database');

let Book = {
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

exports.getAllBooks = (req, res, next) => {
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

exports.getBookByISBN = (req, res, next) => {
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
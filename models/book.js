// imports the MySQL database
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
// GET all products in database
Book.getAllBooks = (result) => {
    db.query('SELECT * FROM books', (err, res) => {
        if (err) {
            console.log('Error', err);
            result(null, err);
        }
        else {
            console.log('Success');
            result(null, res);
        }
    });
}

// Exports Book object
module.exports = Book;
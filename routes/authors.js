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
const Author = {
    // JSON data format
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    biography: {
        type: String
    },
    publisher: {
        type: String
    }
}
// Class/Object methods
// GET all authors in authors table in database
Author.getAuthors = (req, res, next) => {
    console.log('Authors and Books Called');
    db.query('SELECT * FROM authors', (err, result) => {
        if(err) {
            res.sendStatus(500);
            throw err;
        }
        else {
        res.json(result);
        }
    });
}

// GET all books by a particular author in the database
Author.getAuthorBooks = (req, res, next) => {
    console.log('Authors and Books Called');
    db.query('SELECT books.* FROM authors JOIN books ON books.author = CONCAT(authors.firstName, " ",  authors.lastName) WHERE books.author = ?', [req.params.authors], (err, result) => {
        if(err) {
            res.sendStatus(500);
            throw err;
        }
        else {
        res.json(result);
        }
    });
}

// ADD new author
Author.addNewAuthor = (req, res, next) => {
    // params for author database table
    
    let firstName = req.body.firstName
    let lastName = req.body.lastName
    let biography = req.body.biography
    let publisher = req.body.publisher
    
    if(!firstName || !lastName || !biography || !publisher) {
        return res.status(400).send({Error: true, message: "One or more fields are empty"})
    }
    const queryString = "INSERT INTO authors (firstName, lastName, biography, publisher) VALUES ( ?, ?, ?, ?)"
    db.query(queryString, [firstName, lastName, biography, publisher], (err, results, fields) => {
        if(err) {
            if(err.errno == 1062){
                return res.status(400).send({Error: true, message: "Author already exists"})
            }
            else {
            res.sendStatus(400);
            throw err;
            }
        }
        else {
            
            res.end(JSON.stringify(results));
        }
    });
}

// route to GET all authors
router.get('/authors', Author.getAuthors);

// route to GET all books by a certain author
router.get('/:authors/books', Author.getAuthorBooks);

// route to POST new author to database
router.post('/admin/add-author', Author.addNewAuthor);

// exports router
module.exports = router;
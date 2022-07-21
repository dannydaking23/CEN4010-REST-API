// imports database
const db = require('../util/database');

// GETs all authors in authors table in database
exports.getAuthors = (req, res, next) => {
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

// GETs all books by a particular author in the database
exports.getAuthorBooks = (req, res, next) => {
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
exports.addNewAuthor = (req, res, next) => {
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


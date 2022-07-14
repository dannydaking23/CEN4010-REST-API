const db = require('../util/database');

// creates Author json object
const Author = {
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

// GET all authors
Author.getAllAuthors = (result) => {
    db.query('SELECT * FROM authors', (err, res) => {
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

// exports Author object
module.exports = Author;
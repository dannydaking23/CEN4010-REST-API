const express = require ('express');
const mysql = require ('mysql');
const bodyparser = require('body-parser');
const router = express.Router();

router.use(bodyparser.json());

// Create connection
const database = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'bookstore_db'
});


// Creating wishlist 
router.post('/api/createwishlist/:username/:password/:name/:id', (req, res) => {
    console.log(req.params);
    let wishlist = (req.params.name);
    let username = (req.params.username);
    let id = (req.params.id);
    
    let sql = `SELECT * FROM profiles
               WHERE username = '${req.params.username}'`;
    database.query(sql, (err, result) =>{
        if (result && result.length){
            let sql = `SELECT * FROM profiles
                        WHERE username = '${req.params.username}' AND password = '${req.params.password}'`;
            database.query(sql, (err, result) =>{
                if (result && result.length){
                    let sql = `SELECT * FROM wishlist
                                WHERE username = '${req.params.username}' AND id = '${req.params.id}'`;
                    database.query(sql, (err, result) =>{
                        if ((result && result.length) || id > 3 || id <= 0){
                            res.send('Id number is already created or is > than 3 or < than 0.');
                        } else {
                            let sql = `INSERT INTO wishlist (username, wishlist, id) VALUES (?,?,?)`;
                            database.query(sql,[username, wishlist, id], function(err, result) {
                                if (err) throw err;
                                console.log(result);
                                res.send('Wishlist created...');
                            });  
                        }
                    })
                }else {
                    res.send('Password incorrect.');
                }
                if (err) throw err;
            })
        } else {
            res.send('Wrong username');
        }
    });
});



// Add book to wishlist
router.post('/api/addwish/:username/:password/:isbn/:name', (req, res) => {
    console.log(req.body);
    let name = (req.params.username);
    let nameWishlist = (req.params.name);

    let sql = `SELECT * FROM profiles
               WHERE username = '${req.params.username}'`;
    
    database.query(sql, (err, result) =>{
        if (result && result.length){               
            let sql = `SELECT * FROM profiles
                       WHERE username = '${req.params.username}' AND password = '${req.params.password}'`;
            database.query(sql, (err, result) =>{
                if (result && result.length){
                    let sql = `SELECT * FROM books
                               WHERE isbn = '${req.params.isbn}'`;
                    database.query(sql, (err, result) =>{
                        if (result && result.length){
                            let sql = `SELECT * FROM wishlist
                                       WHERE wishlist = '${req.params.name}' AND username = '${req.params.username}'`;
                            database.query(sql, (err, result) =>{
                                if (result && result.length){
                                    let sql = `INSERT INTO wishlist (username, book, isbn, wishlist, id) VALUES ((?), (SELECT title FROM books WHERE isbn = '${req.params.isbn}') , (SELECT isbn FROM books WHERE isbn = '${req.params.isbn}'), (?), (SELECT * FROM (SELECT id FROM wishlist WHERE wishlist = '${req.params.name}' AND book IS NULL AND username = '${req.params.username}') AS id)) `;
                                    database.query( sql,[name, nameWishlist], function(err, result) {
                                        if (err) throw err;
                                        console.log(result);
                                        res.send('Book added to wishlist...');
                                    }); 
                                } else {
                                    res.send('wishlist not found');
                                }
                            })
                        } else {
                            res.send('Book not in database');
                        }  
                    if (err) throw err;
                    })
                } else {
                    res.send('Incorrect password.');
                }
            })

        } else {
            res.send('Wrong username');
        }
    })
});

// Get all books in specific wishlist
router.get('/api/getwish/:username/:password/:name', (req, res) => {
    console.log(req.body);
    let nameWishlist = (req.params.name);

    let sql = `SELECT * FROM profiles
               WHERE username = '${req.params.username}'`;
    
    database.query(sql, (err, result) =>{
        if (result && result.length){
            let sql = `SELECT * FROM profiles
                       WHERE username = '${req.params.username}' AND password = '${req.params.password}'`;
            database.query(sql, (err, result) =>{
                if (result && result.length){
                    let sql = `SELECT * FROM wishlist
                               WHERE wishlist = '${req.params.name}'`;
                    database.query(sql, (err, result) =>{
                        if (result && result.length){
                        let sql = `SELECT * FROM wishlist WHERE username = '${req.params.username}' AND wishlist = '${req.params.name}' AND book IS NOT NULL`;
                        database.query(sql, function(err, result) {
                            if (err) throw err;
                            console.log(result);
                            res.send(result);
                        });
                    }else {
                        res.send('Wishlist not found.');
                    } 
                })
            } else {
                res.send('Incorrect password.');
            }
        })
        } else {
            res.send('Wrong username');
        }
    })
});

// Move a book from wishlist to another wishlist
router.post('/api/movewish/:username/:password/:isbn/:name/:name2', (req, res) => {
    console.log(req.body);
    let username = (req.params.username);
    let nameWishlist = (req.params.name);
    let nameWishlist2 = (req.params.name2);

    let sql = `SELECT * FROM profile
               WHERE username = '${req.params.username}'`;
    
    database.query(sql, (err, result) =>{
        if (result && result.length){
            let sql = `SELECT * FROM profiles
                        WHERE username = '${req.params.username}' AND password = '${req.params.password}'`;
            database.query(sql, (err, result) =>{
                if (result && result.length){
                    let sql = `SELECT * FROM books
                               WHERE isbn = '${req.params.isbn}'`;
                    database.query(sql, (err, result) =>{
                        if (result && result.length){
                        let sql = `SELECT * FROM wishlist
                                   WHERE isbn = '${req.params.isbn}' AND username = '${req.params.username}' AND wishlist = '${req.params.name}'`;
                            database.query(sql, (err, result) =>{
                                if (result && result.length){
                                    let sql = `SELECT * FROM wishlist
                                               WHERE username = '${req.params.username}' AND wishlist = '${req.params.name2}'`;
                                    database.query(sql, (err, result) =>{
                                        if (result && result.length){
                                            let sql2 = `INSERT INTO wishlist (username, book, isbn, wishlist, id) VALUES ((?), (SELECT title FROM books WHERE isbn = '${req.params.isbn}') , (SELECT isbn FROM books WHERE isbn = '${req.params.isbn}'), (?), (SELECT * FROM (SELECT id FROM wishlist WHERE wishlist = '${req.params.name2}' AND book IS NULL AND username = '${req.params.username}') AS id)) `;
                                            database.query(sql2, [username, nameWishlist2], function(err, result) {
                                                if (err) throw err;
                                                console.log(result);
                                            }); 
                                            let sql = `DELETE FROM wishlist WHERE username = '${req.params.username}' AND isbn ='${req.params.isbn}' AND wishlist = '${req.params.name}'`;
                                            database.query(sql, function(err, result) {
                                                if (err) throw err;
                                                console.log(result);
                                                res.send('Book moved to another wishlist');
                                            })
                                        
                                        }else {
                                            console.log(nameWishlist2);
                                            res.send('Second wishlist does not exist.');
                                        }
                                    })
                                } else {
                                    res.send('book not found in first wishlist...');
                                }
                            });
                        } else {
                            res.send('Book not in database');
                        }  
                        if (err) throw err;
                    })
                } else {
                    res.send('Incorrect password.');
                }
            })
        } else {
            res.send('Wrong username');
        }    
    })
});

// Move a book from wishlist to shoppingcart
router.post('/api/movewishtoshoppingcart/:username/:password/:isbn/:name', (req, res) => {
    console.log(req.body);

    let sql = `SELECT * FROM profiles
               WHERE username = '${req.params.username}'`;
    
    database.query(sql, (err, result) =>{
        if (result && result.length){
            let sql = `SELECT * FROM profiles
                        WHERE username = '${req.params.username}' AND password = '${req.params.password}'`;
            database.query(sql, (err, result) =>{
                if (result && result.length){
                    let sql = `SELECT * FROM books
                                WHERE isbn = '${req.params.isbn}'`;
                    database.query(sql, (err, result) =>{
                        if (result && result.length){
                            let sql = `SELECT * FROM wishlist
                                        WHERE isbn = '${req.params.isbn}' AND username = '${req.params.username}' AND wishlist = '${req.params.name}'`;
                            database.query(sql, (err, result) =>{
                                if (result && result.length){
                                    let sql = `DELETE FROM wishlist WHERE username = '${req.params.username}' AND isbn ='${req.params.isbn}' AND wishlist = '${req.params.name}'`;
                                    database.query(sql, function(err, result) {
                                        if (err) throw err;
                                        console.log(result);
                                    }); 
                                    let sql2 = `INSERT INTO shoppingcart (username, name, author, description) SELECT username, title, author, description FROM profiles, books WHERE username = '${req.params.username}' AND isbn ='${req.params.isbn}'`;
                                    database.query(sql2, function(err, result) {
                                        if (err) throw err;
                                        console.log(result);
                                        res.send('Book moved from wishlist to shopping cart');
                                    }); 
                                } else {
                                    res.send('book not found in wishlist...');
                                }
                            });
                        } else {
                            res.send('Book not in database');
                        }  
                        if (err) throw err;
                    })
                } else {
                    res.send('Incorrect password.');
                }
            })
        } else {
            res.send('Wrong username');
        }
    })
});

// delete book from wishlist
router.delete('/api/deletewish/:username/:password/:isbn/:name', (req, res) => {
    console.log(req.body);
    let nameWishlist = (req.params.name);

    let sql = `SELECT * FROM profiles
               WHERE username = '${req.params.username}'`;
    
    database.query(sql, (err, result) =>{
        if (result && result.length){
            let sql = `SELECT * FROM profiles
                        WHERE username = '${req.params.username}' AND password = '${req.params.password}'`;
            database.query(sql, (err, result) =>{
                if (result && result.length){
                    let sql = `SELECT * FROM books
                                WHERE isbn = '${req.params.isbn}'`;
                    database.query(sql, (err, result) =>{
                        if (result && result.length){
                            let sql = `SELECT * FROM wishlist
                                       WHERE isbn = '${req.params.isbn}' AND username = '${req.params.username}' AND wishlist = '${req.params.name}'`;
                            database.query(sql, (err, result) =>{
                                if (result && result.length){
                                let sql = `DELETE FROM wishlist WHERE isbn ='${req.params.isbn}' AND username = '${req.params.username}' AND wishlist = '${req.params.name}'`;
                                database.query(sql, function(err, result) {
                                    if (err) throw err;
                                    console.log(result);
                                    res.send('Book deleted from wishlist...');
                                }); 
                            } else {
                                res.send('Book not in wishlist');
                            }
                        })
                            } else {
                                res.send('Book not in database');
                            }  
                    if (err) throw err;
                    })
                } else {
                    res.send('Incorrect password.');
                }
            })
        } else {
            res.send('Wrong username');
        }     
    })
});

module.exports = router;

const express = require ('express');
const mysql = require ('mysql');
const cors = require ('cors');
const bodyparser = require('body-parser');
const router = express.Router();

router.use(cors());
router.use(bodyparser.json());

// Create connection
const database = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'bookstore_db'
});


// Creating wishlist 
router.post('/api/createwishlist/:username/:password/:name', (req, res) => {
    console.log(req.params);
    let wishlist = (req.params.name);
    let username = (req.params.username);
    
    let sql = `SELECT * FROM profiles
               WHERE username = '${req.params.username}'`;
    
    database.query(sql, (err, result) =>{
        if (result && result.length){
            let sql = `SELECT * FROM profiles
                        WHERE password = '${req.params.password}'`;
            database.query(sql, (err, result) =>{
                if (result && result.length){
                    let sql = `INSERT INTO wishlist (username, wishlist) VALUES (?,?)`;
                    database.query(sql,[username, wishlist], function(err, result) {
                        if (err) throw err;
                        console.log(result);
                        res.send('Wishlist created...');
                        });  
                    }else {
                        res.send('Username or Password not in database');
                    }
                    if (err) throw err;
                })
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
                       WHERE password = '${req.params.password}'`;
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
                                    let sql = `INSERT INTO wishlist (username, book, isbn, wishlist) VALUES ((?), (SELECT title FROM books WHERE isbn = '${req.params.isbn}') , (SELECT isbn FROM books WHERE isbn = '${req.params.isbn}'), (?)) `;
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
                       WHERE password = '${req.params.password}'`;
            database.query(sql, (err, result) =>{
                if (result && result.length){
                    let sql = `SELECT * FROM wishlist WHERE username = '${req.params.username}' AND wishlist = '${req.params.name}' AND book IS NOT NULL`;
                    database.query(sql, function(err, result) {
                        if (err) throw err;
                        console.log(result);
                        res.send(result);
                    }); 
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
router.put('/api/movewish/:username/:password/:isbn/:name/:name2', (req, res) => {
    console.log(req.body);
    let nameWishlist = (req.params.name);
    let nameWishlist2 = (req.params.name2);


    let sql = `SELECT * FROM profiles
               WHERE username = '${req.params.username}'`;
    
    database.query(sql, (err, result) =>{
        if (result && result.length){
            let sql = `SELECT * FROM profiles
                        WHERE password = '${req.params.password}'`;
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
                                            let sql2 = `UPDATE wishlist SET wishlist = ? WHERE wishlist = ? AND username = '${req.params.username}' AND isbn = '${req.params.isbn}'`;
                                            database.query(sql2, [nameWishlist2, nameWishlist],  function(err, result) {
                                                if (err) throw err;
                                                console.log(result);
                                                res.send('Book moved to another wishlist');
                                            }); 
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
    //let nameWishlist = (req.params.name);


    let sql = `SELECT * FROM profiles
               WHERE username = '${req.params.username}'`;
    
    database.query(sql, (err, result) =>{
        if (result && result.length){
            let sql = `SELECT * FROM profiles
                        WHERE password = '${req.params.password}'`;
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
                        WHERE password = '${req.params.password}'`;
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

module.exports = router

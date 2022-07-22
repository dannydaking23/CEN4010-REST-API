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
router.post('/api/createwishlist/:username/:password/:name/:num', (req, res) => {
    console.log(req.params);
    let tableName = (req.params.name);
    let num = (req.params.num);

    if (num <= 0){
        res.send('You need a number greater than 0.');
    }
     else if (num > 3){
        res.send('User cannot have more than 3 wishlist');
    } else {
    let sql = `SELECT * FROM profiles
               WHERE username = '${req.params.username}'`;
    
    database.query(sql, (err, result) =>{
        if (result && result.length){
            let sql = `SELECT * FROM profiles
                        WHERE password = '${req.params.password}'`;
            database.query(sql, (err, result) =>{
                if (result && result.length){
                    let sql = `CREATE TABLE ${tableName} (username VARCHAR (255), book VARCHAR(255), isbn VARCHAR(255))`;
                    database.query(sql, function(err, result) {
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
    }
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
                            let sql = `INSERT INTO ${nameWishlist} (username, book, isbn) SELECT username, title, isbn FROM profiles, books WHERE username = '${req.params.username}' AND isbn = '${req.params.isbn}'`;
                            database.query( sql, function(err, result) {
                                if (err) throw err;
                                console.log(result);
                                res.send('Book added to wishlist...');
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
                    let sql = `SELECT * FROM ${nameWishlist}`;
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
router.post('/api/movewish/:username/:password/:isbn/:name/:name2', (req, res) => {
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
                        let sql = `SELECT * FROM ${nameWishlist}
                                   WHERE isbn = '${req.params.isbn}'`;
                            database.query(sql, (err, result) =>{
                                if (result && result.length){
                                    let sql = `DELETE FROM ${nameWishlist} WHERE isbn ='${req.params.isbn}'`;
                                    database.query(sql, function(err, result) {
                                        if (err) throw err;
                                        console.log(result);
                                    }); 
                                    let sql2 = `INSERT INTO ${nameWishlist2} (username, book, isbn) SELECT username, title, isbn FROM profiles, books WHERE username = '${req.params.username}' AND isbn = '${req.params.isbn}'`;
                                    database.query(sql2, function(err, result) {
                                        if (err) throw err;
                                        console.log(result);
                                        res.send('Book moved to another wishlist');
                                    }); 
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
                            let sql = `SELECT * FROM ${nameWishlist}
                                        WHERE isbn = '${req.params.isbn}'`;
                            database.query(sql, (err, result) =>{
                                if (result && result.length){
                                    let sql = `DELETE FROM ${nameWishlist} WHERE isbn ='${req.params.isbn}'`;
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
                            let sql = `DELETE FROM ${nameWishlist} WHERE isbn ='${req.params.isbn}'`;
                            database.query(sql, function(err, result) {
                                if (err) throw err;
                                console.log(result);
                                res.send('Book deleted to wishlist...');
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

module.exports = router;

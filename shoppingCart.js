// will contain all of my profile related routes
const express = require('express')
const mysql = require('mysql')
const router = express.Router()

const pool = mysql.createPool({
    host: 'localhost',
    database: 'shoppingCartDB',
    user: 'root',
    password: ''
})

router.get('/', (req, res) => {
    console.log("Default Route...")
    res.end()
})

router.get('/shoppingCart', (req, res) => {
    const queryString = "SELECT * FROM shoppingcart"
    pool.query(queryString, (err, rows, fields) =>{
        if(err){
            res.sendStatus(500)
            throw(err)
        }else{
            console.log("Retrieved all items in shopping carts successfully")
            res.json(rows)
        }
    })
})

router.get('/shoppingCart/:username', (req, res) => {
    console.log("Fetching shoppingCart with username: " + req.params.username)

    const username = req.params.username
    //console.log(username)
    const queryString = "SELECT * FROM shoppingcart WHERE username = ?"
    pool.query(queryString, [username], (err, rows, fields) =>{
        if(err){
            res.sendStatus(500)
            throw(err)
        }else{
            console.log("Retrieved user shopping cart successfully")
            res.json(rows)
        }
    })
})

router.post('/shoppingCart', (req, res) => {
    console.log("Trying to create a new book in shopping cart...")

    let username = req.body.username
    let name = req.body.name
    let author = req.body.author
    let description = req.body.description

    const queryString = "INSERT INTO shoppingcart (username, name, author, description) VALUES (?, ?, ?, ?)"
    pool.query(queryString, [username, name, author, description], (err, results, fields) => {
        if(err){
            res.sendStatus(500)
            throw(err)
        }else{
        console.log("Profile was created successfully")
        }
        res.end()
    })
})

router.delete('/shoppingCart', (req, res) => {

    let username = req.body.username
    let name = req.body.name

    const queryString = "DELETE FROM shoppingcart WHERE username = ? AND name = ?"
    pool.query(queryString, [username, name], (err, results, fields) => {
        if(err){
            res.status(500)
            throw(err)
        }else{
            console.log("Shopping Cart was updated successfully")
        }
        res.end()
    })
})

module.exports = router
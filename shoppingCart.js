// will contain all of my profile related routes
const express = require('express')
const mysql = require('mysql')
const router = express.Router()

const pool = mysql.createPool({
    host: 'localhost',
        database: 'bookstore_db',
        user: 'root',
        password: ''
})

router.get('/', (req, res) => {
    console.log("Default Route...")
    res.end()
})

router.get('/shoppingCart', (req, res) => {
    const queryString = "SELECT * FROM shoppingCart"
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
    const queryString = "SELECT * FROM shoppingCart WHERE username = ?"
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
    let password = req.body.password
    let name = req.body.name
    //let user = req.body.username,
    let author = req.body.author
    let description = req.body.description

    if(!username || !password) {
        return res.status(400).send({Error: true, message: "Please provide a Username and Password"})
    }

    const queryString = "INSERT INTO shoppingCart (name, author, description) WHERE username = ? VALUES (?, ?, ?, ?, ?)"
    pool.query(queryString, [name, author, description], (err, results, fields) => {
        
        console.log("Profile was created successfully")
        res.end()
    })
})

router.delete('/shoppingCart/:name', (req, res) => {

    let name = req.params.name
    let username = req.body.username

    const queryString = "DELETE FROM shoppingCart WHERE username = ?"
    pool.query(queryString, [name, username], (err, results, fields) => {
        if(err){
            res.status(500)
        }else{
            console.log("Shopping Cart was updated successfully")
        }
        res.end()
    })
})

module.exports = router
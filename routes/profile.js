// will contain all of my profile related routes
const express = require('express')
const mysql = require('mysql')
const router = express.Router()

const pool = require('../util/database');

router.get('/', (req, res) => {
    console.log("Default Route...")
    res.end()
})

router.get('/profiles', (req, res) => {
    const queryString = "SELECT * FROM profiles"
    pool.query(queryString, (err, rows, fields) =>{
        if(err){
            res.sendStatus(500)
            throw(err)
        }else{
            console.log("Retrieved profiles successfully")
            res.json(rows)
        }
    })
})

router.get('/profiles/:username', (req, res) => {
    console.log("Fetching profile with username: " + req.params.username)

    const username = req.params.username
    //console.log(username)
    const queryString = "SELECT * FROM profiles WHERE username = ?"
    pool.query(queryString, [username], (err, results, fields) =>{
        if(err){
            res.sendStatus(500)
            throw(err)
        }else{
            console.log("Retrieved profile successfully")
            res.json(results)
        }
    })
})

router.post('/profiles', (req, res) => {
    console.log("Trying to create a new profile...")

    let username = req.body.username
    let password = req.body.password
    let name = req.body.name
    let email = req.body.email
    let address = req.body.address

    if(!username || !password) {
        return res.status(400).send({Error: true, message: "Please provide a Username and Password"})
    }

    const queryString = "INSERT INTO profiles (username, password, name, email, address) VALUES (?, ?, ?, ?, ?)"
    pool.query(queryString, [username, password, name, email, address], (err, results, fields) => {
        if(err){
            if(err.errno == 1062){
                return res.status(400).send({Error: true, message: "Username already exists"})
            }else{
                res.status(500)
            }
        }else{
            console.log("Profile was created successfully")
        }
        res.end()
    })
})

router.put('/profiles/:oldUsername', (req, res) => {
    let oldUsername = req.params.oldUsername
    let data = req.body
    let email = req.body.email

    if(email != null){
        return res.status(400).send({Error: true, message: "Email cannot be updated"})
    }

    const queryString = "UPDATE profiles SET ? WHERE username = ?"
    pool.query(queryString, [data, oldUsername], (err, results, fields) => {
        if(err){
            res.status(500)
        }else{
            console.log("Profile was updated successfully")
        }
        res.end()
    })
})

router.post('/profiles/creditcards', (req, res) => {
    let ccnumber = req.body.ccnumber
    let cvc = req.body.cvc
    let expdate = req.body.expdate
    let name = req.body.name
    let username = req.body.username

    if(!ccnumber || !cvc || !expdate || !name || !username) {
        return res.status(400).send({Error: true, message: "Please provide your Credit Card Number, CVC, Expiration Date, Name, and Username"})
    }

    let exists = 0
    const userQuery = "SELECT username FROM profiles WHERE username = ?"
    pool.query(userQuery, [username], (err, results, field) => {
        if(results.length == 0){
            exists = 1
            return res.status(400).send({Error: true, message: "Username does not exist"})
        }else{
            res.end()
        }
    })
    
    if(exists == 0){
        const queryString = "INSERT INTO creditcards (ccnumber, cvc, expdate, name, username) VALUES (?, ?, ?, ?, ?)"
        pool.query(queryString, [ccnumber, cvc, expdate, name, username], (err, results, fields) => {
            if(err){
                if(err.errno == 1062){
                    return res.status(400).send({Error: true, message: "Creditcard number is already in use"})
                }
                res.status(500)
                throw(err)
            }else{
                console.log("Credit card was created successfully")
            }
            res.end()
        })
    }
})

router.get('/profiles/creditcards/:username', (req, res) => {
    console.log("Fetching credit cards for profile with username: " + req.params.username)

    const username = req.params.username

    const queryString = "SELECT * FROM creditcards WHERE username = ?"
    pool.query(queryString, [username], (err, results, fields) => {
        if(err){
            res.sendStatus(500)
            throw(err)
        }else{
            console.log("Credit cards retrieved successfully")
            res.json(results)
        }
    })

})

module.exports = router


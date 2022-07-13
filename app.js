const express = require('express')
const app = express()
const morgan = require('morgan')
const mysql = require('mysql')
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({extended: false}))

app.use(morgan('short'))

const router = require('./routes/profile.js')
app.use(router)

// localhost:3003
app.listen(3003, () => {
    console.log("Server is up and listening on 3003...")
})
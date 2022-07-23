const express = require('express')
const app = express()
const morgan = require('morgan')
const mysql = require('mysql')
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({extended: false}))

app.use(morgan('short'))

const profileRouter = require('./routes/profile.js')
const shoppingCartRouter = require('./routes/shoppingCart.js')
const wishlistRouter = require('./routes/wishlist.js')
const bookRouter = require('./routes/books.js')
const authorRouter = require('./routes/authors.js')

app.use(profileRouter)
app.use(shoppingCartRouter)
app.use(wishlistRouter)
app.use(bookRouter)
app.use(authorRouter)

// localhost:3003
app.listen(3003, () => {
    console.log("Server is up and listening on 3003...")
})



// imports express.js
const express = require('express');
// imports body-parser
const bodyParser = require('body-parser');

// imports route to product page
const bookRoutes = require('./routes/books')

// imports route to author page
const authorRoutes = require('./routes/authors');

// imports route to admin page
const adminRoutes = require('./routes/admin');

// imports route to profile page
const profileRoutes = require('./routes/profile');


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



// GETs all books page
app.use(bookRoutes);

// GETs authors page
app.use(authorRoutes)

// GETs admin page
app.use(adminRoutes);

app.use(profileRoutes);



// listens for activity on port 3000
app.listen(3000);

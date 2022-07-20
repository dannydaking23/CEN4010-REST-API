# CEN4010-REST-API
How my files fit together:

/models/book
/models/author

These files hold the actual objects and the database query parts of some get methods 
which are then made available to be exported to:

/controllers/admin
/controllers/authors
/controllers/books

These files hold the rest of the get methods and the post methods which are then made available 
to be exported to:

/routes/admin
/routes/authors
/routes/books

As the name implies, these hold the routes which then use the previous files made available
for export to interact with their respective database tables

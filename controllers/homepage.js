exports.getHomepage = (req, res, next) => {
    res.status(200).send('Welcome to the homepage!');
};
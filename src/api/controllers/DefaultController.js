exports.defaultController = (req, res) => {
    res.send(`<h1>Running on port ${process.env.PORT || 3001}</h1>`);
};
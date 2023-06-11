const Router = require('./views/Router');

const API = (app) => {
    app.use('/', Router);
};

module.exports = API;
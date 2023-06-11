const db = require('../../db/config');


exports.handleLogout = (req, res) => {

    if (!req.session.user) return res.status(400).send(`Korisnik nije prijavljen!`);
    
    // Odjavi korisnika
    req.session.user = undefined;
    req.session.destroy((err) => {
        if (err) {
            return res.status(400).json(err);
        } else {
            return res.status(200).send(`Uspješno odjavljen korisnik`);
        }
    });
};

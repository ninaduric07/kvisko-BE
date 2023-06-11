
const { validationResult } = require('express-validator');

const hasher = require('../../libs/Hasher');
const db = require('../../db/config');

exports.handleLogin = async function (req, res) {

    // Express-validator validacija
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    // Try login
    const regexExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    const { usernameOrEmail, password } = req.body;

    let sqlQuery;
    if (regexExp.test(usernameOrEmail)) sqlQuery = `SELECT * FROM public."User" WHERE email = $1 AND password = $2`;
    else sqlQuery = `SELECT * FROM public."User" WHERE username = $1 AND password = $2`;

    const { error, result } = await db.query(sqlQuery, [usernameOrEmail, hasher(password)]);
    if (error) return res.status(500).json(error);
    else if (!result.rows[0]) return res.sendStatus(401); // Ne postoji korisnik s tim loginom

    req.session.user = result.rows[0];
    res.sendStatus(200);
};
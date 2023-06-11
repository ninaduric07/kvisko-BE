const { validationResult } = require('express-validator');

const hasher = require('../../libs/Hasher');
const db = require('../../db/config');

exports.handleRegister = async function (req, res) {

    // Validacija pomocu express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    // Dodaj novog korisnika i pošalji mail za verifikaciju
    const { username, email, name, surname, pbr, password } = req.body;

    // Provjeri ako vec postoji korisnik s tim imenom
    const existsResponse = await db.query(`SELECT username FROM public."User" WHERE username=$1`, [username]);
    if (existsResponse.error) return res.status(500).json(existsResponse.error);
    if (existsResponse.result.rowCount) return res.status(400).send("Taj username već postoji!");

    const sqlQuery = 'INSERT INTO public."User" (name, surname, username, email, password, pbr, admin) VALUES($1, $2, $3, $4, $5, $6, $7)';
    const dodajResponse = await db.query(sqlQuery, [name, surname, username, email, hasher(password), pbr, 0]);

    // Ako greska vrati error
    if (dodajResponse.error) return res.status(500).json(dodajResponse.error);

    return res.sendStatus(200);


};
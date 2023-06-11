const db = require('../../db/config');
const { validationResult } = require('express-validator');

exports.createQuiz = async function(req,res) {

    // Validacija pomocu express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    // Dodaj novog korisnika i pošalji mail za verifikaciju
    const { name, image, description, durationSec, reviewDurationSec, availableFrom, availableTo, category } = req.body;
    const sqlQuery = 'INSERT INTO public."Kviz" ("name", "image","description", "durationSec", "reviewDurationSec", "availableFrom", "availableTo", "sifKategorije") VALUES($1, $2, $3, $4, $5, $6, $7, $8)';
    const dodajResponse = await db.query(sqlQuery, [name, image, description, durationSec, reviewDurationSec, availableFrom, availableTo, category]);

    // Ako greska vrati error
    if (dodajResponse.error) return res.status(500).json(dodajResponse.error);

    return res.sendStatus(200);


}
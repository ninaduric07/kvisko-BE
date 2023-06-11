const { validationResult } = require('express-validator');

const hasher = require('../../libs/Hasher');
const db = require('../../db/config');

exports.changeName = async function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    const { name } = req.body;
    const username = req.session.user.username;
    sqlQuery = `UPDATE public."User" SET name = $1 WHERE username = $2`;
    const { error, result } = await db.query(sqlQuery, [name, username]);
    if (error) return res.status(500).json(error);
    res.status(200).json("Uspješno promjenjeno ime!");
}   

exports.changeSurname = async function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    const { surname } = req.body;
    const username = req.session.user.username;
    sqlQuery = `UPDATE public."User" SET surname = $1 WHERE username = $2`;
    const { error, result } = await db.query(sqlQuery, [surname, username]);
    if (error) return res.status(500).json(error);
    res.status(200).json("Uspješno promjenjeno prezime!");
} 


exports.changeEmail = async function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    const { email } = req.body;
    const username = req.session.user.username;
    sqlQuery = `UPDATE public."User" SET email = $1 WHERE username = $2`;
    const { error, result } = await db.query(sqlQuery, [email, username]);
    if (error) return res.status(500).json(error);
    res.status(200).json("Uspješno promjenjen email!");
}  

exports.changePbr = async function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    const { pbr } = req.body;
    const username = req.session.user.username;
    sqlQuery = `UPDATE public."User" SET pbr = $1 WHERE username = $2`;
    const { error, result } = await db.query(sqlQuery, [pbr, username]);
    if (error) return res.status(500).json(error);
    res.status(200).json("Uspješno promjenjeno mjesto stanovanja!");
}  

exports.changePassword = async function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    const { oldPassword, newPassword } = req.body;
    const username = req.session.user.username;
    sqlQueryy = `SELECT * FROM public."User" WHERE username = $1 AND password = $2`;
    const response = await db.query(sqlQueryy, [username, hasher(oldPassword)]);
    if (response.error) return res.status(500).json(error0);
    if (!response.result.rowCount) return res.status(500).send('Nije točna lozinka');
    sqlQuery = `UPDATE public."User" SET password = $1 WHERE username = $2`;
    const { error, result } = await db.query(sqlQuery, [hasher(newPassword), username]);
    if (error) return res.status(500).json(error);
    res.status(200).json("Uspješno promjenjeno mjesto stanovanja!");
} 

exports.changeImage = async function (req, res) {

    const { image } = req.body;
    const username = req.session.user.username;
    sqlQuery = `UPDATE public."User" SET image = $1 WHERE username = $2`;
    const { error, result } = await db.query(sqlQuery, [image, username]);
    if (error) return res.status(500).json(error);
    res.status(200).json("Uspješno promjenjena slika!");
}  
const db = require('../../db/config');
const { validationResult } = require('express-validator');

exports.getCategories = async function (req, res) {

    const existsResponse = await db.query(`SELECT * FROM public."Kategorija"`);
    if (existsResponse.error) return res.status(500).json(existsResponse.error);
    return res.status(200).json(existsResponse.result.rows);
};

exports.newCategory = async function (req, res) {

    name = req.body.name;
    const existsResponse = await db.query(`INSERT INTO public."Kategorija" ("nazivKategorije") VALUES ($1)`, [name]);
    if (existsResponse.error) return res.status(500).json(existsResponse.error);
    return res.sendStatus(200);
};

exports.deleteCategory = async function (req, res) {

    sifKategorije = req.params.sifKategorije;
    const existsResponse2 = await db.query(`UPDATE public."Kviz" SET "sifKategorije" = $1 WHERE "sifKategorije" = $2`, [22, sifKategorije]);
    if (existsResponse2.error) return res.status(500).json(existsResponse2.error);
    const existsResponse = await db.query(`DELETE FROM public."Kategorija" WHERE "sifKategorije" = $1`, [sifKategorije]);
    if (existsResponse.error) return res.status(500).json(existsResponse.error);
    return res.sendStatus(200);
};

exports.searchCategories = async function (req, res) {
    const filter = req.query.searchCategory;
    const { error, result } = await db.query(`SELECT * FROM public."Kategorija" WHERE LOWER("nazivKategorije") LIKE '%' || LOWER($1) || '%'`, [filter]);
    if (error) return res.status(500).json(error);

    return res.status(200).json(result.rows);
}
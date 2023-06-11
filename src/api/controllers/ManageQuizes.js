const db = require('../../db/config');


exports.searchQuizes = async function (req, res) {
    const filter = req.query.quiz;
    const { error, result } = await db.query(`SELECT * FROM public."Kviz" LEFT JOIN public."Kategorija" ON public."Kviz"."sifKategorije" = public."Kategorija"."sifKategorije" WHERE LOWER("name") LIKE '%' || LOWER($1) || '%'`, [filter]);
    if (error) return res.status(500).json(error);

    return res.status(200).json(result.rows);
}

exports.getQuizes = async function (req, res) {

    const existsResponse = await db.query(`SELECT * FROM public."Kviz" LEFT JOIN public."Kategorija" ON public."Kviz"."sifKategorije" = public."Kategorija"."sifKategorije"`);
    if (existsResponse.error) return res.status(500).json(existsResponse.error);
    return res.status(200).json(existsResponse.result.rows);
};

exports.getOneQuiz = async function (req, res) {

    sifKviz = req.params.sifKviz;
    const existsResponse = await db.query(`SELECT * FROM public."Kviz" LEFT JOIN public."Kategorija" ON public."Kviz"."sifKategorije" = public."Kategorija"."sifKategorije" WHERE "sifKviz" = $1`,[sifKviz]);
    if (existsResponse.error) return res.status(500).json(existsResponse.error);
    return res.status(200).json(existsResponse.result.rows[0]);
};

exports.quizChangeName = async function (req, res) {
    const { name } = req.body;
    const sifKviz = req.params.sifKviz;
    sqlQuery = `UPDATE public."Kviz" SET "name" = $1 WHERE "sifKviz" = $2`;
    const { error, result } = await db.query(sqlQuery, [name, sifKviz]);
    if (error) return res.status(500).json(error);
    res.status(200).json("Uspješno promjenjeno ime!");
}  

exports.quizChangeImage = async function (req, res) {
    const { image } = req.body;
    const sifKviz = req.params.sifKviz;
    sqlQuery = `UPDATE public."Kviz" SET "image" = $1 WHERE "sifKviz" = $2`;
    const { error, result } = await db.query(sqlQuery, [image, sifKviz]);
    if (error) return res.status(500).json(error);
    res.status(200).json("Uspješno promjenjeno ime!");
} 

exports.quizChangeDescription = async function (req, res) {
    const { description } = req.body;
    const sifKviz = req.params.sifKviz;
    sqlQuery = `UPDATE public."Kviz" SET "description" = $1 WHERE "sifKviz" = $2`;
    const { error, result } = await db.query(sqlQuery, [description, sifKviz]);
    if (error) return res.status(500).json(error);
    res.status(200).json("Uspješno promjenjeno ime!");
}

exports.quizChangeDuration = async function (req, res) {
    const { duration } = req.body;
    const sifKviz = req.params.sifKviz;
    sqlQuery = `UPDATE public."Kviz" SET "durationSec" = $1 WHERE "sifKviz" = $2`;
    const { error, result } = await db.query(sqlQuery, [duration, sifKviz]);
    if (error) return res.status(500).json(error);
    res.status(200).json("Uspješno promjenjeno ime!");
}

exports.quizChangeReviewDuration = async function (req, res) {
    const { duration } = req.body;
    const sifKviz = req.params.sifKviz;
    sqlQuery = `UPDATE public."Kviz" SET "reviewDurationSec" = $1 WHERE "sifKviz" = $2`;
    const { error, result } = await db.query(sqlQuery, [duration, sifKviz]);
    if (error) return res.status(500).json(error);
    res.status(200).json("Uspješno promjenjeno ime!");
}

exports.editQuiz = async function(req,res) {
    const sifKviz = req.params.sifKviz;
    const { name, image, description, durationSec, reviewDurationSec, availableFrom, availableTo, category } = req.body;
    const sqlQuery = 'UPDATE public."Kviz" SET "name" = $1, "image" =$2,"description"=$3, "durationSec"=$4, "reviewDurationSec"=$5, "availableFrom"=$6, "availableTo"=$7, "sifKategorije"=$8  WHERE "sifKviz" = $9';
    const dodajResponse = await db.query(sqlQuery, [name, image, description, durationSec, reviewDurationSec, availableFrom, availableTo, category, sifKviz]);

    // Ako greska vrati error
    if (dodajResponse.error) return res.status(500).json(dodajResponse.error);

    return res.sendStatus(200);


}

exports.deleteQuiz = async function(req,res) {
    const sifKviz = req.params.sifKviz;
    const sqlQuery1 = 'DELETE FROM public."KvizPitanje" WHERE "sifKviz" = $1';
    const dodajResponse1 = await db.query(sqlQuery1, [sifKviz]);
    if (dodajResponse1.error) return res.status(500).json(dodajResponse1.error);
    const sqlQuery = 'DELETE FROM public."Kviz" WHERE "sifKviz" = $1';
    const dodajResponse = await db.query(sqlQuery, [sifKviz]);
    if (dodajResponse.error) return res.status(500).json(dodajResponse.error);

    return res.sendStatus(200);


}

exports.searchMainQuizes = async function (req, res) {
    const filter = req.query.quiz;
    const { error, result } = await db.query(`SELECT * FROM public."Kviz" LEFT JOIN public."Kategorija" ON public."Kviz"."sifKategorije" = public."Kategorija"."sifKategorije" WHERE LOWER("name") LIKE '%' || LOWER($1) || '%' AND "availableFrom" <= CURRENT_TIMESTAMP and "availableTo" >= CURRENT_TIMESTAMP`, [filter]);
    if (error) return res.status(500).json(error);

    return res.status(200).json(result.rows);
}

exports.getCategoryQuizes = async function (req, res) {
    const sifKategorije = req.params.sifKategorije;
    const existsResponse = await db.query(`SELECT * FROM public."Kviz" LEFT JOIN public."Kategorija" ON public."Kviz"."sifKategorije" = public."Kategorija"."sifKategorije" WHERE public."Kviz"."sifKategorije"=$1`, [sifKategorije]);
    if (existsResponse.error) return res.status(500).json(existsResponse.error);
    return res.status(200).json(existsResponse.result.rows);
};

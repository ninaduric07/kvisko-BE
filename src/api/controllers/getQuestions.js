const db = require('../../db/config');

exports.getQuestion1 = async function(req,res) {
    const sifPitanje = req.params.sifPitanje;
    const sqlQuery2 = 'SELECT "tekstPitanja","odgovor", "isCorrect", "name", "image", "availableFrom", "description", "availableTo", "nazivKategorije", "durationSec", "reviewDurationSec" FROM public."Pitanje" LEFT JOIN public."PitanjeOdgovor" USING("sifPitanje") LEFT JOIN public."KvizPitanje" USING("sifPitanje") LEFT JOIN public."Kviz" USING("sifKviz") LEFT JOIN public."Kategorija" USING("sifKategorije") WHERE "sifPitanje" = $1 GROUP BY "tekstPitanja", "odgovor", "isCorrect", "name", "image", "availableFrom", "description", "availableTo", "nazivKategorije", "durationSec", "reviewDurationSec"' ;
    const dodajResponse2 = await db.query(sqlQuery2, [sifPitanje]);
    if (dodajResponse2.error) return res.status(500).json(dodajResponse2.error);
    return res.status(200).json(dodajResponse2.result.rows);
}

exports.getQuestion2 = async function(req,res) {
    const sifPitanje = req.params.sifPitanje;
    const sqlQuery2 = 'SELECT "odgovor", "isCorrect", "sifPitanjeOdgovor" FROM public."Pitanje" LEFT JOIN public."PitanjeOdgovor" USING("sifPitanje") LEFT JOIN public."KvizPitanje" USING("sifPitanje") LEFT JOIN public."Kviz" USING("sifKviz") LEFT JOIN public."Kategorija" USING("sifKategorije") WHERE "sifPitanje" = $1 GROUP BY "odgovor", "isCorrect", "sifPitanjeOdgovor"' ;
    const dodajResponse2 = await db.query(sqlQuery2, [sifPitanje]);
    if (dodajResponse2.error) return res.status(500).json(dodajResponse2.error);
    return res.status(200).json(dodajResponse2.result.rows);
}

exports.editQuestion1 = async function(req,res) {
    const sifPitanje = req.params.sifPitanje;
    const { question, answer } = req.body;
    const sqlQuery = `UPDATE public."Pitanje" SET "tekstPitanja"=$1 WHERE "sifPitanje"=$2 `;
    const response = await db.query(sqlQuery, [question, sifPitanje]);
    if (response.error) return res.status(500).json(response.error);
    const sqlQuery2 = `UPDATE public."PitanjeOdgovor" SET "odgovor"=$1 WHERE "sifPitanje"=$2 `;
    const response2 = await db.query(sqlQuery2, [answer, sifPitanje]);
    if (response2.error) return res.status(500).json(response2.error);
    return res.status(200).send("Uspješno ažurirano pitanje");
}

exports.getQuizQuestion = async function(req, res) {
    const sifPitanje = req.params.sifPitanje;
    const sqlQuery2 = 'SELECT * FROM public."KvizPitanje" LEFT JOIN public."Kviz" USING("sifKviz") LEFT JOIN public."Kategorija" USING("sifKategorije") WHERE "sifPitanje" = $1' ;
    const dodajResponse2 = await db.query(sqlQuery2, [sifPitanje]);
    if (dodajResponse2.error) return res.status(500).json(dodajResponse2.error);
    return res.status(200).json(dodajResponse2.result.rows);
}

exports.editTextQuestion = async function(req,res) {
    const sifPitanje = req.params.sifPitanje;
    const { question } = req.body;
    const sqlQuery = `UPDATE public."Pitanje" SET "tekstPitanja"=$1 WHERE "sifPitanje"=$2 `;
    const response = await db.query(sqlQuery, [question, sifPitanje]);
    if (response.error) return res.status(500).json(response.error);
    return res.status(200).send("Uspješno ažurirano pitanje");
}

exports.addIncorrectAnswer = async function(req,res) {
    const sifPitanje = req.params.sifPitanje;
    const { incorrectAnswer } = req.body;
    const sqlQuery = `INSERT INTO public."PitanjeOdgovor"("sifPitanje", "odgovor","isCorrect") VALUES($1, $2, $3)`
    const response = await db.query(sqlQuery, [sifPitanje, incorrectAnswer, 0]);
    if (response.error) return res.status(500).json(response.error);
    return res.status(200).send("Uspješno ažurirano pitanje");
}

exports.addAnswer3 = async function(req,res) {
    const sifPitanje = req.params.sifPitanje;
    const { answer, isCorrect } = req.body;
    const sqlQuery = `INSERT INTO public."PitanjeOdgovor"("sifPitanje", "odgovor","isCorrect") VALUES($1, $2, $3)`
    const response = await db.query(sqlQuery, [sifPitanje, answer, isCorrect]);
    if (response.error) return res.status(500).json(response.error);
    return res.status(200).send("Uspješno ažurirano pitanje");
}

exports.getCorrectAnswer = async function(req,res) {
    const sifPitanje = req.params.sifPitanje;
    const sqlQuery2 = 'SELECT * FROM public."PitanjeOdgovor" WHERE "sifPitanje" = $1 AND "isCorrect" = $2' ;
    const dodajResponse2 = await db.query(sqlQuery2, [sifPitanje, 1]);
    if (dodajResponse2.error) return res.status(500).json(dodajResponse2.error);
    return res.status(200).json(dodajResponse2.result.rows);
}

exports.editCorrectAnswer = async function(req,res) {
    const sifPitanjeOdgovor = req.params.sifPitanjeOdgovor;
    const { correctAnswer } = req.body;
    const sqlQuery2 = `UPDATE public."PitanjeOdgovor" SET "odgovor"=$1 WHERE "sifPitanjeOdgovor"=$2 ` ;
    const dodajResponse2 = await db.query(sqlQuery2, [correctAnswer, sifPitanjeOdgovor]);
    if (dodajResponse2.error) return res.status(500).json(dodajResponse2.error);
    return res.status(200).send("Uspješno ažurirano pitanje");
}

exports.deleteIncorrectAnswer = async function(req,res) {
    const sifPitanjeOdgovor = req.params.sifPitanjeOdgovor;
    const sqlQuery2 = `DELETE FROM public."PitanjeOdgovor" WHERE "sifPitanjeOdgovor"=$1 ` ;
    const dodajResponse2 = await db.query(sqlQuery2, [sifPitanjeOdgovor]);
    if (dodajResponse2.error) return res.status(500).json(dodajResponse2.error);
    return res.status(200).send("Uspješno ažurirano pitanje");
}

exports.getSlagalica = async function(req,res) {
    const sifPitanje = req.params.sifPitanje;
    const sqlQuery2 = 'SELECT * FROM public."Pitanje" LEFT JOIN public."Slagalica" USING("sifPitanje") LEFT JOIN public."SlagalicaPar" USING("sifLijeveStranePara") WHERE "sifPitanje" = $1' ;
    const dodajResponse2 = await db.query(sqlQuery2, [sifPitanje]);
    if (dodajResponse2.error) return res.status(500).json(dodajResponse2.error);
    return res.status(200).json(dodajResponse2.result.rows);
}

exports.deletePair = async function(req,res) {
    const sifSlagalicaPar = req.params.sifSlagalicaPar;
    const sqlQuery3 = `SELECT * FROM public."SlagalicaPar" WHERE "sifSlagalicaPar"=$1 ` ;
    const dodajResponse3 = await db.query(sqlQuery3, [sifSlagalicaPar]);
    if (dodajResponse3.error) return res.status(500).json(dodajResponse3.error);
    const sifLijeveStrane = dodajResponse3.result.rows[0].sifLijeveStranePara;
    const sqlQuery2 = `DELETE FROM public."SlagalicaPar" WHERE "sifSlagalicaPar"=$1 ` ;
    const dodajResponse2 = await db.query(sqlQuery2, [sifSlagalicaPar]);
    if (dodajResponse2.error) return res.status(500).json(dodajResponse2.error);
    const sqlQuery4 = `SELECT * FROM public."SlagalicaPar" WHERE "sifLijeveStranePara"=$1 ` ;
    const dodajResponse4 = await db.query(sqlQuery4, [sifLijeveStrane]);
    if (dodajResponse4.error) return res.status(500).json(dodajResponse4.error);
    if(dodajResponse4.result.rows == 0)  {
        const sqlQuery5 = `DELETE FROM public."Slagalica" WHERE "sifLijeveStranePara"=$1 ` ;
        const dodajResponse5 = await db.query(sqlQuery5, [sifLijeveStrane]);
        if (dodajResponse5.error) return res.status(500).json(dodajResponse5.error);
    }
    return res.status(200).send("Uspješno ažurirano pitanje");
}

exports.addPair = async function(req,res) {
    const sifPitanje = req.params.sifPitanje;
    const {pair1, pair2} = req.body;
    var sifLijeveStrane = 0;
    const sqlQuery3 = `SELECT * FROM public."Slagalica" WHERE "sifPitanje"=$1 AND "lijevaStranaPara" = $2` ;
    const dodajResponse3 = await db.query(sqlQuery3, [sifPitanje, pair1]);
    if (dodajResponse3.error) return res.status(500).json(dodajResponse3.error);
    if(dodajResponse3.result.rowCount == 0) {
        const sqlQuery4 = `INSERT INTO public."Slagalica"("sifPitanje", "lijevaStranaPara") VALUES($1, $2)` ;
        const dodajResponse4 = await db.query(sqlQuery4, [sifPitanje, pair1]);
        if (dodajResponse4.error) return res.status(500).json(dodajResponse4.error);
        const sqlQuery2 = `SELECT * FROM public."Slagalica" WHERE "sifPitanje"=$1 AND "lijevaStranaPara" = $2` ;
        const dodajResponse2 = await db.query(sqlQuery2, [sifPitanje, pair1]);
        if (dodajResponse2.error) return res.status(500).json(dodajResponse2.error);
        sifLijeveStrane = dodajResponse2.result.rows[0].sifLijeveStranePara;
    }
    else{
        sifLijeveStrane = dodajResponse3.result.rows[0].sifLijeveStranePara;
    }
    const sqlQuery4 = `INSERT INTO public."SlagalicaPar"("sifLijeveStranePara", "desnaStranaPara") VALUES($1, $2)` ;
    const dodajResponse4 = await db.query(sqlQuery4, [sifLijeveStrane, pair2]);
    if (dodajResponse4.error) return res.status(500).json(dodajResponse4.error);
    return res.status(200).send("Uspješno ažurirano pitanje");
    
}

exports.getAllQuestions = async function(req,res) {
    const sqlQuery2 = 'SELECT * FROM public."Pitanje"' ;
    const dodajResponse2 = await db.query(sqlQuery2, [sifPitanje]);
    if (dodajResponse2.error) return res.status(500).json(dodajResponse2.error);
    return res.status(200).json(dodajResponse2.result.rows);
}

exports.searchQuestions = async function (req, res) {
    const filter = req.query.quiz;
    const { error, result } = await db.query(`SELECT * FROM public."Pitanje" LEFT JOIN public."Tip" USING("sifTip") WHERE LOWER("tekstPitanja") LIKE '%' || LOWER($1) || '%'`, [filter]);
    if (error) return res.status(500).json(error);

    return res.status(200).json(result.rows);
}

exports.addQuestion = async function (req, res) {
    const sifPitanje = req.params.sifPitanje;
    const sifKviz = req.params.sifKviz;
    const { error, result } = await db.query(`INSERT INTO public."KvizPitanje"("sifPitanje", "sifKviz") VALUES($1, $2)`, [sifPitanje, sifKviz]);
    if (error) return res.status(500).json(error);

    return res.status(200).json(result.rows);
}

exports.removeQuestion = async function (req, res) {
    const sifKviz = req.params.sifKviz;
    const sifPitanje = req.params.sifPitanje;
    const { error, result } = await db.query(`DELETE FROM public."KvizPitanje" WHERE "sifPitanje" = $1 AND "sifKviz" = $2 `, [sifPitanje, sifKviz]);
    if (error) return res.status(500).json(error);

    return res.status(200).json(result.rows);
}
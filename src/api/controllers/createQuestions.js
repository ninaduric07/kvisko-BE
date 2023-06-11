const db = require('../../db/config');

exports.createQuestion1 = async function(req, res) {
    const sifKviz = req.params.sifKviz;
    const sifTip = req.params.sifTip;
    const {question1, answer1 } = req.body;
    const sqlQuery = 'INSERT INTO public."Pitanje" ("tekstPitanja", "sifTip") VALUES($1, $2)';
    const dodajResponse = await db.query(sqlQuery, [question1, sifTip]);
    if (dodajResponse.error) return res.status(500).json(dodajResponse.error);
    const sqlQuery2 = 'SELECT "sifPitanje" FROM public."Pitanje" WHERE "tekstPitanja" = $1 AND "sifTip" = $2';
    const dodajResponse2 = await db.query(sqlQuery2, [question1, sifTip]);
    if (dodajResponse2.error) return res.status(500).json(dodajResponse2.error);
    const sifPit = dodajResponse2.result.rows[dodajResponse2.result.rowCount-1].sifPitanje;
    const sqlQuery3 = 'INSERT INTO public."PitanjeOdgovor" ("sifPitanje", "odgovor", "isCorrect") VALUES($1, $2, $3)';
    const dodajResponse3 = await db.query(sqlQuery3, [sifPit, answer1, 1]);
    if (dodajResponse3.error) return res.status(500).json(dodajResponse3.error);
    const sqlQuery4 = 'INSERT INTO public."KvizPitanje" ("sifPitanje", "sifKviz") VALUES($1, $2)';
    const dodajResponse4 = await db.query(sqlQuery4, [sifPit, sifKviz]);
    if (dodajResponse4.error) return res.status(500).json(dodajResponse4.error);
    return res.sendStatus(200);
}

exports.createQuestion3 = async function(req, res) {
    const sifKviz = req.params.sifKviz;
    const sifTip = req.params.sifTip;
    const {question1, answer1, isCorrect } = req.body;
    var sifPit = 0;
    const sqlQuery22 = 'SELECT "sifPitanje" FROM public."Pitanje" LEFT JOIN public."KvizPitanje" USING("sifPitanje") WHERE "tekstPitanja" = $1 AND "sifTip" = $2 AND "sifKviz" = $3';
    const dodajResponse22 = await db.query(sqlQuery22, [question1, sifTip, sifKviz]);
    if (dodajResponse22.error) return res.status(500).json(dodajResponse22.error);
    if(dodajResponse22.result.rowCount == 0) {
        const sqlQuery = 'INSERT INTO public."Pitanje" ("tekstPitanja", "sifTip") VALUES($1, $2)';
        const dodajResponse = await db.query(sqlQuery, [question1, sifTip]);
        if (dodajResponse.error) return res.status(500).json(dodajResponse.error);
        const sqlQuery2 = 'SELECT "sifPitanje" FROM public."Pitanje" WHERE "tekstPitanja" = $1 AND "sifTip" = $2';
        const dodajResponse2 = await db.query(sqlQuery2, [question1, sifTip]);
        if (dodajResponse2.error) return res.status(500).json(dodajResponse2.error);
        sifPit = dodajResponse2.result.rows[dodajResponse2.result.rowCount-1].sifPitanje;
        const sqlQuery4 = 'INSERT INTO public."KvizPitanje" ("sifPitanje", "sifKviz") VALUES($1, $2)';
        const dodajResponse4 = await db.query(sqlQuery4, [sifPit, sifKviz]);
        if (dodajResponse4.error) return res.status(500).json(dodajResponse4.error);
    } else {
        sifPit = dodajResponse22.result.rows[dodajResponse22.result.rowCount-1].sifPitanje;
    }
    
    const sqlQuery3 = 'INSERT INTO public."PitanjeOdgovor" ("sifPitanje", "odgovor", "isCorrect") VALUES($1, $2, $3)';
    const dodajResponse3 = await db.query(sqlQuery3, [sifPit, answer1, isCorrect]);
    if (dodajResponse3.error) return res.status(500).json(dodajResponse3.error);
    return res.sendStatus(200);
}

exports.createIncorrectAnswer = async function(req, res) {
    const sifKviz = req.params.sifKviz;
    const sifTip = req.params.sifTip;
    const {question, correctAnswer, incorrectAnswer } = req.body;
    const sqlQuery2 = 'SELECT "sifPitanje" FROM public."Pitanje" LEFT JOIN public."PitanjeOdgovor" USING("sifPitanje") LEFT JOIN public."KvizPitanje" USING("sifPitanje") WHERE "tekstPitanja" = $1 AND "sifTip" = $2 AND "odgovor" = $3 AND "isCorrect"=$4 AND "sifKviz" = $5';
    const dodajResponse2 = await db.query(sqlQuery2, [question, sifTip, correctAnswer, 1, sifKviz]);
    if (dodajResponse2.error) return res.status(500).json(dodajResponse2.error);
    const sifPit = dodajResponse2.result.rows[dodajResponse2.result.rowCount-1].sifPitanje;
    const sqlQuery3 = 'INSERT INTO public."PitanjeOdgovor" ("sifPitanje", "odgovor", "isCorrect") VALUES($1, $2, $3)';
    const dodajResponse3 = await db.query(sqlQuery3, [sifPit, incorrectAnswer, 0]);
    if (dodajResponse3.error) return res.status(500).json(dodajResponse3.error);
    return res.sendStatus(200);
}

exports.submitSlagalica = async function(req, res) {
    const sifKviz = req.params.sifKviz;
    const sifTip = req.params.sifTip;
    const {question, pair1, pair2 } = req.body;
    const sqlQuery2 = 'SELECT "sifPitanje" FROM public."Pitanje" LEFT JOIN public."Slagalica" USING("sifPitanje") LEFT JOIN public."KvizPitanje" USING("sifPitanje") WHERE "tekstPitanja" = $1 AND "sifTip" = $2 AND "lijevaStranaPara" = $3 AND "sifKviz" = $4' ; 
    const dodajResponse2 = await db.query(sqlQuery2, [question, sifTip, pair1 , sifKviz]);
    if (dodajResponse2.error) return res.status(500).json(dodajResponse2.error);
    if(dodajResponse2.result.rowCount == 0) {
        var sifPit = 0;
        const sqlQuery3 = 'SELECT "sifPitanje" FROM public."Pitanje" LEFT JOIN public."KvizPitanje" USING("sifPitanje") WHERE "tekstPitanja" = $1 AND "sifTip" = $2 AND "sifKviz" = $3';
        const dodajResponse3 = await db.query(sqlQuery3, [question, sifTip, sifKviz]);
        if (dodajResponse3.error) return res.status(500).json(dodajResponse3.error);
        if(dodajResponse3.result.rowCount == 0){
            const sqlQuery = 'INSERT INTO public."Pitanje" ("tekstPitanja", "sifTip") VALUES($1, $2)';
            const dodajResponse = await db.query(sqlQuery, [question, sifTip]);
            if (dodajResponse.error) return res.status(400).json(dodajResponse.error);
            const sqlQuery31 = 'SELECT "sifPitanje" FROM public."Pitanje" WHERE "tekstPitanja" = $1 AND "sifTip" = $2';
            const dodajResponse31 = await db.query(sqlQuery31, [question, sifTip]);
            if (dodajResponse31.error) return res.status(500).json(dodajResponse31.error);
            sifPit = dodajResponse31.result.rows[dodajResponse31.result.rowCount-1].sifPitanje;
            const sqlQuery40 = 'INSERT INTO public."KvizPitanje" ("sifPitanje", "sifKviz") VALUES($1, $2)';
            const dodajResponse40 = await db.query(sqlQuery40, [sifPit, sifKviz]);
            if (dodajResponse40.error) return res.status(500).json(dodajResponse4.error);
        }
        else {
            sifPit = dodajResponse3.result.rows[dodajResponse3.result.rowCount-1].sifPitanje;
        }
        
        const sqlQuery4 = 'INSERT INTO public."Slagalica" ("sifPitanje", "lijevaStranaPara") VALUES($1, $2)';
        const dodajResponse4 = await db.query(sqlQuery4, [sifPit, pair1]);
        if (dodajResponse4.error) return res.status(500).json(dodajResponse4.error);
        const sqlQuery20 = 'SELECT "sifLijeveStranePara" FROM public."Slagalica" WHERE "sifPitanje" = $1 AND "lijevaStranaPara" = $2' ; 
        const dodajResponse20 = await db.query(sqlQuery20, [sifPit, pair1]);
        if (dodajResponse20.error) return res.status(500).json(dodajResponse20.error);
        const sifL = dodajResponse20.result.rows[dodajResponse20.result.rowCount-1].sifLijeveStranePara;
        const sqlQuery10 = 'INSERT INTO public."SlagalicaPar" ("sifLijeveStranePara", "desnaStranaPara") VALUES($1, $2)';
        const dodajResponse10 = await db.query(sqlQuery10, [sifL, pair2]);
        if (dodajResponse10.error) return res.status(500).json(dodajResponse10.error);
        
        return res.sendStatus(200);
    } else{
        const sifPit = dodajResponse2.result.rows[dodajResponse2.result.rowCount-1].sifPitanje;
        const sqlQuery20 = 'SELECT "sifLijeveStranePara" FROM public."Slagalica" WHERE "sifPitanje" = $1 AND "lijevaStranaPara" = $2' ; 
        const dodajResponse20 = await db.query(sqlQuery20, [sifPit, pair1]);
        if (dodajResponse20.error) return res.status(500).json(dodajResponse20.error);
        const sifL = dodajResponse20.result.rows[dodajResponse20.result.rowCount-1].sifLijeveStranePara;
        const sqlQuery10 = 'INSERT INTO public."SlagalicaPar" ("sifLijeveStranePara", "desnaStranaPara") VALUES($1, $2)';
        const dodajResponse10 = await db.query(sqlQuery10, [sifL, pair2]);
        if (dodajResponse10.error) return res.status(500).json(dodajResponse10.error);
        
        return res.sendStatus(200);
    }
    

}

exports.getQuestions = async function(req, res) {
    const sifKviz = req.params.sifKviz;
    const sqlQuery2 = 'SELECT * FROM public."Pitanje" LEFT JOIN public."KvizPitanje" USING("sifPitanje") LEFT JOIN public."Tip" USING("sifTip") LEFT JOIN public."Kviz" USING("sifKviz") WHERE "sifKviz" = $1';
    const dodajResponse2 = await db.query(sqlQuery2, [sifKviz]);
    if (dodajResponse2.error) return res.status(500).json(dodajResponse2.error);
    return res.status(200).json(dodajResponse2.result.rows);
}
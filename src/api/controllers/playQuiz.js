const db = require('../../db/config');
const {StringUtils} = require('turbocommons-ts');

exports.getPlayQuiz = async function (req, res) {

    sifKviz = req.params.sifKviz;
    const existsResponse = await db.query(`SELECT "name", "image", "durationSec", "reviewDurationSec", "availableFrom", "availableTo", "description", "nazivKategorije", COUNT("sifPitanje") AS "numberOfQuestions" FROM public."Kviz" LEFT JOIN public."Kategorija" ON public."Kviz"."sifKategorije" = public."Kategorija"."sifKategorije" LEFT JOIN public."KvizPitanje" USING("sifKviz") WHERE "sifKviz" = $1 GROUP BY "name", "image", "durationSec", "reviewDurationSec", "availableFrom", "availableTo", "description", "nazivKategorije" `,[sifKviz]);
    if (existsResponse.error) return res.status(500).json(existsResponse.error);
    return res.status(200).json(existsResponse.result.rows[0]);
};

exports.getPlayQuizQuestions = async function (req, res) {
    number = req.query.number;
    sifKviz = req.params.sifKviz;
    const existsResponse = await db.query(`SELECT * FROM public."Kviz" LEFT JOIN public."KvizPitanje" USING("sifKviz") LEFT JOIN public."Pitanje" USING("sifPitanje")  WHERE "sifKviz" = $1 `,[sifKviz]);
    if (existsResponse.error) return res.status(500).json(existsResponse.error);
    const pitanje = existsResponse.result.rows[number].sifPitanje;
    const existsResponse2 = await db.query(`SELECT * FROM public."Pitanje" LEFT JOIN public."PitanjeOdgovor" USING("sifPitanje") LEFT JOIN public."Slagalica" USING("sifPitanje") LEFT JOIN public."SlagalicaPar" USING("sifLijeveStranePara") WHERE "sifPitanje" = $1 `,[pitanje]);
    if (existsResponse2.error) return res.status(500).json(existsResponse2.error);
    return res.status(200).json(existsResponse2.result.rows);

}

exports.saveAnswer = async function (req, res) {
    const sifPitanje = req.params.sifPitanje;
    const username = req.params.username;
    const korisnikOdgovor  = req.body.korisnikOdgovor;
    const existsResponse2 = await db.query(`SELECT * FROM public."Pitanje" LEFT JOIN public."PitanjeOdgovor" USING("sifPitanje") WHERE "sifPitanje" = $1 AND "isCorrect" = $2` ,[sifPitanje, 1]);
    if (existsResponse2.error) return res.status(500).json(existsResponse2.error);
    const tocanOdg = existsResponse2.result.rows[0].odgovor;
    const similarity = StringUtils.compareSimilarityPercent(String(korisnikOdgovor), String(tocanOdg));
    let isCorrect = 0;
    if( existsResponse2.result.rows[0].sifTip == 1 && similarity>70) {
        isCorrect = 1;
    } else if( existsResponse2.result.rows[0].sifTip == 2 && similarity==100) {
        isCorrect = 1;
    }
    const existsResponse1 = await db.query(`SELECT * FROM public."KorisnikPitanje" WHERE "username" = $1 AND "sifPitanje" = $2` ,[username, sifPitanje]);
    if (existsResponse1.error) return res.status(500).json(existsResponse1.error);
    if(existsResponse1.result.rowCount == 0) {
        const existsResponse = await db.query(`INSERT INTO public."KorisnikPitanje"("username", "sifPitanje", "korisnikOdgovor", "isAnswerCorrect") VALUES ($1, $2, $3, $4)` ,[username, sifPitanje, korisnikOdgovor, isCorrect]);
        if (existsResponse.error) return res.status(500).json(existsResponse.error);
    }
    else{
        const existsResponse = await db.query(`UPDATE public."KorisnikPitanje" SET "korisnikOdgovor"=$1, "isAnswerCorrect" = $2 WHERE "sifPitanje" = $3 AND "username"=$4` ,[korisnikOdgovor, isCorrect, sifPitanje, username]);
        if (existsResponse.error) return res.status(500).json(existsResponse.error);
    }
    res.status(200).json("Uspješno dodan odgovor!");
    
}

exports.saveMultipleAnswer = async function (req, res) {
    const sifPitanje = req.params.sifPitanje;
    const username = req.session.user.username;
    const selectedItems  = req.body.selectedItems;
    const existsResponse2 = await db.query(`SELECT * FROM public."Pitanje" LEFT JOIN public."PitanjeOdgovor" USING("sifPitanje") WHERE "sifPitanje" = $1 AND "isCorrect" = $2` ,[sifPitanje, 1]);
    if (existsResponse2.error) return res.status(500).json(existsResponse2.error);
    const tocniOdg = existsResponse2.result.rows;
    var bodovi = 0;
    for(var i = 0; i < tocniOdg.length; i++) {
        for(var j= 0; j < selectedItems.length; j++) {
            if (selectedItems[j] == tocniOdg[i].odgovor) {
                bodovi = bodovi + 1/tocniOdg.length;
                break;
            }
        }
    }
    if(selectedItems.length > tocniOdg.length) {
        bodovi = bodovi*(tocniOdg.length/(selectedItems.length));
    }
    
    isCorrect = bodovi.toFixed(2);
    const existsResponse1 = await db.query(`SELECT * FROM public."KorisnikPitanje" WHERE "username" = $1 AND "sifPitanje" = $2` ,[username, sifPitanje]);
    if (existsResponse1.error) return res.status(500).json(existsResponse1.error);
    if(existsResponse1.result.rowCount == 0) {
        for(var i = 0; i < selectedItems.length; i++) {
            if(i == 0) {
                const existsResponse = await db.query(`INSERT INTO public."KorisnikPitanje"("username", "sifPitanje", "korisnikOdgovor", "isAnswerCorrect") VALUES ($1, $2, $3, $4)` ,[username, sifPitanje, selectedItems[i], isCorrect]);
                if (existsResponse.error) return res.status(500).json(existsResponse.error);
            } else {
                const existsResponse = await db.query(`INSERT INTO public."KorisnikPitanje"("username", "sifPitanje", "korisnikOdgovor", "isAnswerCorrect") VALUES ($1, $2, $3, $4)` ,[username, sifPitanje, selectedItems[i], 0]);
                if (existsResponse.error) return res.status(500).json(existsResponse.error);
            }
        }
        
    }
    else{
        const existsResponsee = await db.query(`DELETE FROM public."KorisnikPitanje" WHERE "sifPitanje" = $1 AND "username" = $2` ,[sifPitanje, username]);
        if (existsResponsee.error) return res.status(500).json(existsResponsee.error);
        for(var i = 0; i < selectedItems.length; i++) {
            if(i == 0) {
                const existsResponse = await db.query(`INSERT INTO public."KorisnikPitanje"("username", "sifPitanje", "korisnikOdgovor", "isAnswerCorrect") VALUES ($1, $2, $3, $4)` ,[username, sifPitanje, selectedItems[i], isCorrect]);
                if (existsResponse.error) return res.status(500).json(existsResponse.error);
            } else {
                const existsResponse = await db.query(`INSERT INTO public."KorisnikPitanje"("username", "sifPitanje", "korisnikOdgovor", "isAnswerCorrect") VALUES ($1, $2, $3, $4)` ,[username, sifPitanje, selectedItems[i], 0]);
                if (existsResponse.error) return res.status(500).json(existsResponse.error);
            }
        }
        
    }
    res.status(200).json("Uspješno dodan odgovor!");
    
}



exports.saveResult = async function(req,res) {
    const sifKviz = req.params.sifKviz;
    const username = req.session.user.username;
    const elapsedTime = req.body.elapsedTime;
    const existsResponse2 = await db.query(`SELECT DISTINCT("sifPitanje") FROM public."KorisnikPitanje" LEFT JOIN "KvizPitanje" USING("sifPitanje") WHERE "username" = $1 AND "sifKviz" = $2` ,[username, sifKviz]);
    if (existsResponse2.error) return res.status(500).json(existsResponse2.error);
    var maksBodovi = existsResponse2.result.rowCount;
    const existsResponse1 = await db.query(`SELECT * FROM public."KorisnikPitanjeSlagalica" LEFT JOIN "KvizPitanje" USING("sifPitanje") WHERE "username" = $1 AND "sifKviz" = $2` ,[username, sifKviz]);
    if (existsResponse1.error) return res.status(500).json(existsResponse1.error);
    var bodovi = 0.0;
    var brojPolovicnih = 0;
    var brojTocnih = 0;
    for (var i = 0; i < existsResponse1.result.rowCount; i++) {
        bodovi = bodovi + existsResponse1.result.rows[i].score;
        if(existsResponse1.result.rows[i].score > 0 && existsResponse1.result.rows[i].score < 1) {
            brojPolovicnih = brojPolovicnih + 1;
        } else if (existsResponse1.result.rows[i].score == 1) {
            brojTocnih = brojTocnih + 1;
        }
    }
    maksBodovi = maksBodovi + existsResponse1.result.rowCount;
    const existsResponse3 = await db.query(`SELECT * FROM public."KorisnikPitanje" LEFT JOIN "KvizPitanje" USING("sifPitanje") LEFT JOIN "Pitanje" USING("sifPitanje") WHERE "username" = $1 AND "sifKviz" = $2 AND "isAnswerCorrect" = $3 AND "sifTip" = $4` ,[username, sifKviz, 1, 1]);
    if (existsResponse3.error) return res.status(500).json(existsResponse3.error);
    bodovi = bodovi + existsResponse3.result.rowCount;
    brojTocnih = brojTocnih + existsResponse3.result.rowCount;
    const existsResponse31 = await db.query(`SELECT "sifPitanje", "username", MAX("isAnswerCorrect") AS "isAnswerCorrect" FROM public."KorisnikPitanje" LEFT JOIN "KvizPitanje" USING("sifPitanje") LEFT JOIN "Pitanje" USING("sifPitanje") WHERE "username" = $1 AND "sifKviz" = $2 AND "sifTip" = $3 GROUP BY "sifPitanje", "username"` ,[username, sifKviz, 2]);
    if (existsResponse31.error) return res.status(500).json(existsResponse31.error);
    for (var i = 0; i < existsResponse31.result.rowCount; i++) {
        bodovi = bodovi + existsResponse31.result.rows[i].isAnswerCorrect;
        if(existsResponse31.result.rows[i].isAnswerCorrect > 0 && existsResponse31.result.rows[i].isAnswerCorrect < 1) {
            brojPolovicnih = brojPolovicnih + 1;
        } else if (existsResponse31.result.rows[i].isAnswerCorrect == 1) {
            brojTocnih = brojTocnih + 1;
        }
    }
    bodovi = bodovi.toFixed(2);
    const existsResponse4 = await db.query(`INSERT INTO public."KorisnickiRezultat"("username", "sifKviz", "bodovi", "maksBodovi", "brojTocnih", "brojPolovicnih", "elapsedTime") VALUES ($1, $2, $3, $4, $5, $6, $7)`, [username, sifKviz, bodovi, maksBodovi, brojTocnih, brojPolovicnih, elapsedTime]);
    if (existsResponse4.error) return res.status(500).json(existsResponse4.error);
    res.status(200).json("Uspješno dodan rezultat!");
}

exports.getResult = async function(req,res) {
    const sifKviz = req.params.sifKviz;
    const username = req.session.user.username;
    const existsResponse4 = await db.query(`SELECT * FROM public."KorisnickiRezultat" WHERE "username" = $1 AND "sifKviz" = $2`, [username, sifKviz]);
    if (existsResponse4.error) return res.status(500).json(existsResponse4.error);
    res.status(200).json(existsResponse4.result.rows[existsResponse4.result.rowCount - 1]);
}

exports.getReviewQuizQuestions = async function (req, res) {
    number = req.query.number;
    sifKviz = req.params.sifKviz;
    username = req.session.user.username;
    const existsResponse = await db.query(`SELECT * FROM public."Kviz" LEFT JOIN public."KvizPitanje" USING("sifKviz")   WHERE "sifKviz" = $1`,[sifKviz]);
    if (existsResponse.error) return res.status(500).json(existsResponse.error);
    const pitanje = existsResponse.result.rows[number].sifPitanje;
    const existsResponse2 = await db.query(`SELECT * FROM public."Pitanje" LEFT JOIN public."PitanjeOdgovor" USING("sifPitanje") LEFT JOIN "KorisnikPitanje" USING("sifPitanje") LEFT JOIN public."Slagalica" USING("sifPitanje") LEFT JOIN public."SlagalicaPar" USING("sifLijeveStranePara") WHERE public."Pitanje"."sifPitanje" = $1 AND public."KorisnikPitanje"."username"=$2`,[pitanje, username]);
    if (existsResponse2.error) return res.status(500).json(existsResponse2.error);
    if(existsResponse2.result.rowCount == 0) {
        const existsResponse21 = await db.query(`SELECT *, "Slagalica2"."lijevaStranaPara" AS "lijevaStrana", "Slagalica"."lijevaStranaPara" AS "lijevaStranaPara", "Slagalica"."sifLijeveStranePara" AS "sifLijeveStranePara" FROM public."Pitanje" LEFT JOIN public."Slagalica" USING("sifPitanje") LEFT JOIN public."SlagalicaPar" USING("sifLijeveStranePara") LEFT JOIN public."KorisnikSlagalica" ON public."KorisnikSlagalica"."desnaStrana" = public."SlagalicaPar"."desnaStranaPara" LEFT JOIN public."Slagalica" "Slagalica2" ON public."KorisnikSlagalica"."sifLijeveStranePara" = "Slagalica2"."sifLijeveStranePara" WHERE public."Pitanje"."sifPitanje" = $1 AND "username" = $2`,[pitanje, username]);
        if (existsResponse21.error) return res.status(500).json(existsResponse21.error);
        return res.status(200).json(existsResponse21.result.rows);
    }
    return res.status(200).json(existsResponse2.result.rows);

}

exports.getResultTable = async function (req, res) {
    sifKviz = req.params.sifKviz;
    const existsResponse2 = await db.query(`SELECT "username", "elapsedTime", MAX((("bodovi"*100)/("maksBodovi"))) AS postotak FROM public."KorisnickiRezultat" WHERE "sifKviz" = $1 GROUP BY "username", "elapsedTime" ORDER BY MAX((("bodovi"*100)/"maksBodovi")) DESC, "elapsedTime" ASC`, [sifKviz]);
    if (existsResponse2.error) return res.status(500).json(existsResponse2.error);
    return res.status(200).json(existsResponse2.result.rows);
}

exports.getLeftPair = async function (req, res) {
    sifPitanje = req.params.sifPitanje;
    const existsResponse2 = await db.query(`SELECT DISTINCT("lijevaStranaPara"), DISTINCT("sifLijeveStranePara") FROM public."Slagalica" WHERE "sifPitanje" = $1 ORDER BY "sifLijeveStranePara" ASC`, [sifPitanje]);
    if (existsResponse2.error) return res.status(500).json(existsResponse2.error);
    return res.status(200).json(existsResponse2.result.rows);
}

exports.getRightPair = async function (req, res) {
    sifPitanje = req.params.sifPitanje;
    const existsResponse2 = await db.query(`SELECT "desnaStranaPara", "sifSlagalicaPar" FROM public."Slagalica" LEFT JOIN public."SlagalicaPar" USING("sifLijeveStranePara") WHERE "sifPitanje" = $1 ORDER BY "sifSlagalicaPar" ASC`, [sifPitanje]);
    if (existsResponse2.error) return res.status(500).json(existsResponse2.error);
    return res.status(200).json(existsResponse2.result.rows);
}

exports.savePair = async function (req, res) {
    sifLeft = req.body.sifLeft;
    sifRight = req.body.sifRight;
    sifPitanje = req.body.sifPitanje;
    username = req.session.user.username;
    const existsResponse = await db.query(`SELECT * FROM public."KorisnikSlagalica" WHERE "sifPitanje"=$1 AND "desnaStrana" = $2 AND "username" = $3`, [sifPitanje, sifRight, username]);
    if( existsResponse.result.rows.length > 0) {
        sifKorisnikSlagalica = existsResponse.result.rows[0].sifKorisnikSlagalica;
        const existsResponse1 = await db.query(`UPDATE public."KorisnikSlagalica"  SET "sifLijeveStranePara"=$1 WHERE "sifKorisnikSlagalica" = $2`, [sifLeft, sifKorisnikSlagalica]);
        if (existsResponse1.error) return res.status(500).json(existsResponse1.error);
        return res.status(200).json("Uspješno dodan par!");
    }
    const existsResponse2 = await db.query(`INSERT INTO public."KorisnikSlagalica"("username", "sifLijeveStranePara", "desnaStrana", "sifPitanje") VALUES ($1, $2, $3, $4)`, [username, sifLeft, sifRight, sifPitanje]);
    if (existsResponse2.error) return res.status(500).json(existsResponse2.error);
    return res.status(200).json("Uspješno dodan par!");
}

exports.saveSlagalica = async function (req, res) {
    const sifPitanje = req.params.sifPitanje;
    const username = req.session.user.username;
    const existsResponse2 = await db.query(`SELECT * FROM public."KorisnikSlagalica" LEFT JOIN public."Slagalica" ON public."KorisnikSlagalica"."sifLijeveStranePara" = public."Slagalica"."sifLijeveStranePara" AND public."KorisnikSlagalica"."sifPitanje" = public."Slagalica"."sifPitanje" LEFT JOIN public."SlagalicaPar" ON public."SlagalicaPar"."sifLijeveStranePara" = public."KorisnikSlagalica"."sifLijeveStranePara" AND public."SlagalicaPar"."desnaStranaPara" = public."KorisnikSlagalica"."desnaStrana" WHERE public."KorisnikSlagalica"."sifPitanje" = $1 AND "username" = $2` ,[sifPitanje, username]);
    if (existsResponse2.error) return res.status(500).json(existsResponse2.error);
    var tocno = 0;
    var netocno = 0;
    for(var i = 0; i < existsResponse2.result.rowCount; i++) {
        if(existsResponse2.result.rows[i].desnaStrana == existsResponse2.result.rows[i].desnaStranaPara) {
            tocno++;
        } else {
            netocno++;
        }
    }
    const existsResponse = await db.query(`SELECT * FROM public."KorisnikPitanjeSlagalica" WHERE "sifPitanje" = $1 AND "username" = $2`, [sifPitanje, username]);
    if (existsResponse.error) return res.status(500).json(existsResponse.error);
    var score = tocno * 1.0 / ((1.0) * (netocno + tocno));
    if( existsResponse.result.rows.length > 0) {
        sifKorisnikPitanjeSlagalica = existsResponse.result.rows[0].sifKorisnikPitanjeSlagalica;
        const existsResponse1 = await db.query(`UPDATE public."KorisnikPitanjeSlagalica"  SET "score"=$1 WHERE "sifKorisnikPitanjeSlagalica" = $2`, [score, sifKorisnikPitanjeSlagalica]);
        if (existsResponse1.error) return res.status(500).json(existsResponse1.error);
        return res.status(200).json("Uspješno dodan par!");
    }
    const existsResponse3 = await db.query(`INSERT INTO public."KorisnikPitanjeSlagalica"("username", "score", "sifPitanje") VALUES($1, $2, $3)`, [username, score, sifPitanje]);
    if (existsResponse3.error) return res.status(501).json(existsResponse3.error);
    return res.status(200).json("Uspješno dodan odgovor!");
    
}


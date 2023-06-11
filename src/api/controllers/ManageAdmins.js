const db = require('../../db/config');

exports.getAdmins = async function (req, res) {

    const existsResponse = await db.query(`SELECT * FROM public."User" WHERE admin=$1`, [1]);
    if (existsResponse.error) return res.status(500).json(existsResponse.error);
    return res.status(200).json(existsResponse.result.rows);
};

exports.getNonAdmins = async function (req, res) {

    const existsResponse = await db.query(`SELECT * FROM public."User" WHERE admin=$1`, [0]);
    if (existsResponse.error) return res.status(500).json(existsResponse.error);
    return res.status(200).json(existsResponse.result.rows);
};

exports.setAdmin = async function (req, res) {
    const username = req.params.username;
    const existsResponse = await db.query(`UPDATE public."User" SET admin = $1 WHERE username = $2`, [1, username]);
    if (existsResponse.error) return res.status(500).json(existsResponse.error);
    return res.sendStatus(200);
};

exports.removeAdmin = async function (req, res) {
    const username = req.params.username;
    const existsResponse = await db.query(`UPDATE public."User" SET admin = $1 WHERE username = $2`, [0, username]);
    if (existsResponse.error) return res.status(500).json(existsResponse.error);
    return res.sendStatus(200);
};

exports.searchNonAdmins = async function (req, res) {
    const filter = req.query.searchUsernameNonAdmin;
    const { error, result } = await db.query(`SELECT * FROM public."User" WHERE LOWER(username) LIKE '%' || LOWER($1) || '%'`, [filter]);
    if (error) return res.status(500).json(error);

    return res.status(200).json(result.rows);
}

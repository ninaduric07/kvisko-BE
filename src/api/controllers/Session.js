const db = require('../../db/config');

exports.handleSession = async (req, res) => {
    
    if (!req.session.user) return res.status(200).json(null);

    // Dobavi aktualne vrijednosti, inace se kod promijeni password ili slike ne vracaju novi podaci nego samo session spremljeni
    const { error, result } = await db.query(`SELECT * FROM public."User" WHERE username = $1`, [req.session.user.username]);
    if (error) return res.status(500).json(error);
    
    res.status(200).json(result.rows[0]);
};
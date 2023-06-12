const { Pool, Client } = require('pg');
require('dotenv').config()

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
    ssl:{
            rejectUnauthorized: false,
        }
});

   
  const client = new Client({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
    ssl:{
            rejectUnauthorized: false,
        }
  })
  client.connect()
   
  client.query('SELECT NOW()', (err, res) => {
    console.log(err, res)
    client.end()
  })

  const query = async (text, params) => {
    try {
        const start = Date.now();
        const res = await pool.query(text, params);
        const duration = Date.now() - start;
        console.log('executed query', { text, params, duration, rows: res.rows });
        return {
            error: undefined,
            result: res,
        };
    } catch (err) {
        console.error(err);
        return {
            error: err,
            result: undefined,
        };
    }
};

module.exports = {
    query: query,
};
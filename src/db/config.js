const { Pool, Client } = require('pg');

const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'bazepodataka',
    database: 'Quiz',
    port: 5432,
});

   
  const client = new Client({
    host: 'localhost',
    user: 'postgres',
    password: 'bazepodataka',
    database: 'Quiz',
    port: 5432,
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
const { Pool } = require('pg');
require('dotenv').config();
const fs = require('fs');

const pool = new Pool ({
    user: process.env.DB_user,
    host: process.env.DB_host,
    password: process.env.DB_password,
    database: process.env.DB_database,
    port: process.env.DB_port,
    ssl: {
        rejectUnauthorized: true,
        ca: fs.readFileSync('./ssl.crt').toString(),
      },
});

module.exports = {
    query: (text, params) => pool.query(text, params),
};


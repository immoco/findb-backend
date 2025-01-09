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

console.log(process.env.DB_user);
console.log(process.env.DB_host);
console.log(process.env.DB_password);
console.log(process.env.DB_database);
console.log(process.env.DB_port);
console.log(process.env.DB_user);



module.exports = {
    query: (text, params) => pool.query(text, params),
};


const db = require('./db');

db.query('SELECT NOW()', [])
  .then(res => console.log('Database Connected:', res.rows[0]))
  .catch(err => console.error('Database Connection Error:', err));

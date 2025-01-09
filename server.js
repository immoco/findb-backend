const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = process.env.port || 3000

const db = require('./db');

db.query('SELECT NOW()', [])
  .then(res => console.log('Database Connected:', res.rows[0]))
  .catch(err => console.error('Database Connection Error:', err));

// app.get('/favicon.ico', (req, res) => res.status(204).end());

const AnalysisRouter = require('./routes/analysis');
const EntryRouter = require('./routes/addentry');
const CategoryRouter = require('./routes/addcategory')

app.use(bodyParser.json());
app.use('/addentry', EntryRouter)
app.use('/addcategory', CategoryRouter)
app.use('/', AnalysisRouter)

app.listen(port, () => {
    console.log('Server running')
});


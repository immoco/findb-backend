const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = process.env.port || 3000

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


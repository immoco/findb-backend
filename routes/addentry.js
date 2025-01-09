const express = require('express');
const db = require('../db')
const router = express.Router();
const {insertquery} = require('../functions')

router.post('/', async (req,res) => {
    const {userName, CategoryType, amount, categoryName, date, description, status} = req.body;
    
    const final = await insertquery(CategoryType, userName, amount, categoryName, date, description, status)

    if (final.success) {
        res.status(200).json({ message: 'Entry Added Successfully.'});
    } else {
        res.status(400).json({ message: 'Error Adding Entry' });
    }  
})

module.exports = router;
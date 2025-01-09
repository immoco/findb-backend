const express = require('express');
const db = require('../db');
const router = express.Router();
const {addcategory} = require('../functions');

router.post('/', async (req,res) =>{
    const {categoryName, CategoryType} = req.body;
    const result = await addcategory(categoryName, CategoryType)

    if (result.success) {
        res.status(200).json({ message: result.message });
    } else {
        res.status(400).json({ message: result.message });
    }
})

module.exports = router;

const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/', async (req,res) =>{
    const {userName, CategoryType} = req.query;
    try {
        const result = await db.query(
            `SELECT CategoryName, CategoryType FROM categories WHERE CategoryType = $2 
            UNION 
            SELECT CategoryName, CategoryType FROM user_categories WHERE UserName = $1 AND CategoryType = $2`,
            [userName, CategoryType]);
        res.json(result.rows);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
})

module.exports = router;
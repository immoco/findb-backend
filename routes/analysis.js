const express = require('express');
const router = express.Router();
const db = require('../db')
const {getdata, deletequery, updatequery, getMonthlyData} = require('../functions')

router.get('/:CategoryType', async (req,res) => {
    const {userName} = req.query;
    const {CategoryType} = req.params;

    const result = await getdata(userName, CategoryType)

    if (result.success){
        res.json(result.rows)
    }else{
        res.status(500).json({message: result.message});
    }
})

router.get('/:CategoryType/advanced', async (req, res) => {
    const {userName, phase} = req.query;
    const {CategoryType} = req.params;

    try {
        const income_query = `SELECT Amount, date FROM ${CategoryType} WHERE Username = $1 AND FlowType = $2 ORDER BY DATE DESC`;
        const IncomeData = await db.query(income_query, [userName, 'Income']);

        const expense_query = `SELECT Amount, date FROM ${CategoryType} WHERE Username = $1 AND FlowType = $2 ORDER BY DATE DESC`;
        const ExpenseData = await db.query(expense_query, [userName, 'Expense']);

        let Barchart;
        switch (phase) {
            case 'past':
                const IncomeBarchart = await getMonthlyData(IncomeData.rows)
                const ExpenseBarchart = await getMonthlyData(ExpenseData.rows)
                Barchart = {
                    income: IncomeBarchart,
                    expense: ExpenseBarchart
                };
                break;
            default:
                return res.status(400).json({message: 'Invalid phase'});
        }
        res.json(Barchart);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Internal Server Error'});
    }
    
})

router.post('/delete', async (req, res) => {
    const {userName, CategoryType, entryid, amount, categoryName, date, description, status} = req.body

    const result = await deletequery(userName, CategoryType, entryid, amount, categoryName, date, description, status)

    if (result.success){
        res.json(result.message)
    }else{
        res.status(500).json({message: result.message});
    }
    
})

router.post('/update', async (req, res) => {
    const { userName, CategoryType, entryid, amount, categoryName, date, description, status } = req.body;

    const result = await updatequery(userName, CategoryType, entryid, amount, categoryName, date, description, status)

    if (result.success){
        res.json(result.message)
    }else{
        res.status(500).json({message: result.message});
    }
});

module.exports = router;

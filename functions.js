const db = require('./db');

function generateCustomID(userName, CategoryType) {
    const Name = userName.slice(0, 3).toUpperCase();
    const Ctype = CategoryType.slice(0, 3).toUpperCase();
    const Timestamp = new Date(new Date().getTime() + 5.5 * 60 * 60 * 1000).toISOString().slice(11, 19).replace(/:/g, "");
    return `${Name}${Ctype}${Timestamp}`;
}

async function addcategory(categoryName, CategoryType) {
    try {
        const existingCategory = await db.query('SELECT CategoryName from categories where categoryName = $1', [categoryName]);

        if(existingCategory.rowCount > 0) {
            return {success: false, message: 'Category Already existed!'}
        }

        await db.query(
            'Insert into Categories (categoryName, CategoryType) values ($1, $2)', 
            [categoryName, CategoryType]
        );

        return {success: true, message: 'Category Added Successfully.'};
    
        } catch(error) {
            console.log(error)
            return {success: false, message: 'Error Adding Category'};
        }
}

async function insertquery(CategoryType, userName, amount, categoryName, date, description, status) {
    try {
        const customID = generateCustomID(userName, CategoryType);
        
        if (categoryName) {
            const query = `Insert into ${CategoryType} (entryid, userName, amount, CategoryName, date, description) 
        values ($1, $2, $3, $4, $5, $6)`

            const queryParams = [customID, userName, amount, categoryName, date, description]

            await db.query(query, queryParams);

            const in_out_query = `Insert into cashflow (entryid, userName, FlowType, amount, categoryName, date, description) values ($1, $2, $3, $4, $5, $6, $7)`
            const in_out_queryParams = [customID, userName, CategoryType, amount, categoryName, date, description]

            await db.query(in_out_query, in_out_queryParams);
        }

        else if (status){

            const query = `Insert into ${CategoryType} (entryid, userName, amount, status, date, description) 
        values ($1, $2, $3, $4, $5, $6)`

            const queryParams = [customID, userName, amount, status, date, description]

            await db.query(query, queryParams);

            const debt_query = `Insert into debt_repayments(entryid, userName, DebtType, Amount, date,  Description, Status) values ($1, $2, $3, $4, $5, $6, $7)`
            const debt_queryParams = [customID, userName, CategoryType, amount, date, description, status]

            await db.query(debt_query, debt_queryParams);

        } else {

            const query = `Insert into ${CategoryType} (entryid, userName, amount, date, description) 
        values ($1, $2, $3, $4, $5)`

            const queryParams = [customID, userName, amount, date, description]

            await db.query(query, queryParams);

            const reserve_query = `Insert into wealth_reserve (entryid, userName, reserve_type, amount, date, description) values ($1, $2, $3, $4, $5, $6)`
            const reserve_queryParams = [customID, userName, CategoryType, amount, date, description]

            await db.query(reserve_query, reserve_queryParams);
        }
        
        return {success: true};
            
    } catch(error) {
        console.log(error)
        return {success: false};
    }
}

async function getdata(userName, CategoryType) {
    try {
        const query = `SELECT * FROM ${CategoryType} WHERE Username = $1 ORDER BY DATE DESC`;
        const result = await db.query(query, [userName]);

        if (result.rows.length === 0) {
            return { success: false, message: `No ${CategoryType} data found for ${userName}.` };
        }

        return { success: true, rows: result.rows }; 

    } catch (error) {
        console.log(error);
        return { success: false, message: 'Internal Server Error' };
    }
}

async function deletequery(userName, CategoryType, entryid, amount, categoryName, date, description, status) {
    try {
        const query = `Delete FROM ${CategoryType} WHERE Username = $1 and EntryID = $2`;
        const result = await db.query(query, [userName, entryid]);

        if (result.rowCount === 0) {
            return { success: false, message: 'No matching entry found to delete.' };
        }

        if (categoryName) {
            const in_out_query = `Delete FROM cashflow WHERE Username = $1 and EntryID = $2`
            const in_out_queryParams = [userName, entryid]

            const result = await db.query(in_out_query, in_out_queryParams)
        }

        else if (status) {
            const debt_query = `Delete FROM debt_repayments WHERE Username = $1 and EntryID = $2`
            const debt_queryParams = [userName, entryid]

            const result = await db.query(debt_query, debt_queryParams)
        }

        else {
            const reserve_query = `Delete FROM wealth_reserve WHERE Username = $1 and EntryID = $2`
            const reserve_queryParams = [userName, entryid]

            const result = await db.query(reserve_query, reserve_queryParams)
        }

        return { success: true , message: 'Entry Deleted Successfully.'}; 

    } catch(error) {
        console.log(error)
        return {success: false, message: 'Error deleting entry'}
    }
}

async function updatequery(userName, CategoryType, entryid, amount, categoryName, date, description, status ) {
    try {
        if (categoryName) {
            const query = `UPDATE ${CategoryType} SET Amount = $1, Date = $2, Description = $3, CategoryName = $4
        WHERE Username = $5 AND entryid = $6 RETURNING *`

            const queryParams = [amount, date, description, categoryName, userName, entryid]

            await db.query(query, queryParams);

            const in_out_query = `UPDATE cashflow SET Amount = $1,  Date = $2, Description = $3, CategoryName = $4,
        WHERE Username = $5 AND entryid = $6 RETURNING *`
            const in_out_queryParams = [amount, date, description, categoryName, userName, entryid]

            await db.query(in_out_query, in_out_queryParams)
        }
        
        else if (status) {
            const query = `UPDATE ${CategoryType} SET Amount = $1, Date = $2, Description = $3, status = $4
        WHERE Username = $5 AND entryid = $6 RETURNING *`

            const queryParams = [amount, date, description, status, userName, entryid]

            await db.query(query, queryParams);

            const debt_query = `UPDATE Debt_repayments SET Amount = $1, Date = $2, Description = $3, status = $4
        WHERE Username = $5 AND entryid = $6 RETURNING *`
            const debt_queryParams = [amount, date, description, status, userName, entryid]

            await db.query(debt_query, debt_queryParams)
        }

        else {
            const query = `UPDATE ${CategoryType} SET Amount = $1, Date = $2, Description = $3
        WHERE Username = $4 AND entryid = $5 RETURNING *`

            const queryParams = [amount, date, description, userName, entryid]

            await db.query(query, queryParams);

            const reserve_query = `UPDATE Debt_repayments SET Amount = $1, Date = $2, Description = $3
        WHERE Username = $4 AND entryid = $5 RETURNING *`
            const reserve_queryParams = [amount, date, description, userName, entryid]

            await db.query(reserve_query, reserve_queryParams)
        }

        return {success: true, message: `${CategoryType} entry updated successfully.` };

    } catch (error) {
        console.log(error)
        return {success: false, message: 'Error Updating entry'}
    }
}

async function getMonthlyData(data) {
    const monthMap = new Map();
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    data.forEach(entry => {
        const date = new Date(entry.date);
        const month = monthNames[date.getMonth()];
        const amount = parseFloat(entry.amount);

        if (monthMap.has(month)) {
            monthMap.set(month, monthMap.get(month) + amount);
        } else {
            monthMap.set(month, amount);
        }
    });

    return Array.from(monthMap.entries()).map(([month, amount]) => ({
        month, amount
    }));
};

module.exports = {
    addcategory, insertquery, getdata, deletequery, updatequery, getMonthlyData
}
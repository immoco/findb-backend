const db = require('./db');  // Import the database connection

async function testQuery() {
  try {
    // Run a simple SQL query
    const result = await db.query('SELECT * FROM users');
    console.log('Query Result:', result.rows);  // Output the result
  } catch (err) {
    console.error('Database query failed:', err);
  }
}

testQuery();  // Call the testQuery function to run it

require('dotenv').config(); // Load environment variables
const { Pool } = require('pg');

// Function to open the database connection using environment variables
const openDb = () => {
  const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });
  return pool;
};

// Function to execute SQL queries (SELECT, INSERT, DELETE, etc.)
const query = (sql, values = []) => {
  return new Promise(async (resolve, reject) => {
    try {
      const pool = openDb();  // Open DB connection
      const result = await pool.query(sql, values);  // Execute SQL query
      resolve(result);  // Return the result of the query
    } catch (error) {
      //console.log(error);
      reject(error.message);  // If error occurs, reject the promise with the error message
    }
  });
};

module.exports = {
  query,
};

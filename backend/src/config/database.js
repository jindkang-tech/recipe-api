const mysql = require('mysql2/promise');

// Database configuration with Codio-specific settings
const dbConfig = {
  host: 'localhost', 
  user: 'root', 
  password: '', 
  database: 'recipe_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Create a connection pool
const pool = mysql.createPool(dbConfig);

// Test connection function
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Database connection established successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
};

// Initialize connection
testConnection();

module.exports = pool;

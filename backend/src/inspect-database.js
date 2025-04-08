/**
 * Script to inspect database schema in Codio
 * Run this with: node src/inspect-database.js
 */

const db = require('./config/database');

async function inspectDatabase() {
  try {
    console.log('Connected to database. Inspecting schema...');
    const conn = await db.getConnection();
    
    // List all tables
    console.log('\n=== Tables in recipe_db ===');
    const [tables] = await conn.query('SHOW TABLES');
    for (const table of tables) {
      const tableName = Object.values(table)[0];
      console.log(`- ${tableName}`);
    }
    
    // Inspect recipe table structure
    console.log('\n=== Structure of recipes table ===');
    const [recipeColumns] = await conn.query('DESCRIBE recipes');
    for (const column of recipeColumns) {
      console.log(`- ${column.Field}: ${column.Type} ${column.Null === 'YES' ? 'NULL' : 'NOT NULL'} ${column.Default ? `DEFAULT ${column.Default}` : ''}`);
    }
    
    // Inspect users table structure
    console.log('\n=== Structure of users table ===');
    const [userColumns] = await conn.query('DESCRIBE users');
    for (const column of userColumns) {
      console.log(`- ${column.Field}: ${column.Type} ${column.Null === 'YES' ? 'NULL' : 'NOT NULL'} ${column.Default ? `DEFAULT ${column.Default}` : ''}`);
    }
    
    // Inspect categories table structure
    console.log('\n=== Structure of categories table (if exists) ===');
    try {
      const [categoryColumns] = await conn.query('DESCRIBE categories');
      for (const column of categoryColumns) {
        console.log(`- ${column.Field}: ${column.Type} ${column.Null === 'YES' ? 'NULL' : 'NOT NULL'} ${column.Default ? `DEFAULT ${column.Default}` : ''}`);
      }
    } catch (error) {
      console.log('Categories table does not exist');
    }
    
    // Check for meal_plans table
    console.log('\n=== Structure of meal_plans table (if exists) ===');
    try {
      const [mealPlanColumns] = await conn.query('DESCRIBE meal_plans');
      for (const column of mealPlanColumns) {
        console.log(`- ${column.Field}: ${column.Type} ${column.Null === 'YES' ? 'NULL' : 'NOT NULL'} ${column.Default ? `DEFAULT ${column.Default}` : ''}`);
      }
    } catch (error) {
      console.log('meal_plans table does not exist');
    }
    
    // Generate ALTER TABLE statements to fix schema discrepancies
    console.log('\n=== Schema Fix Script ===');
    
    // Check if rating column exists in recipes table
    const ratingExists = recipeColumns.some(col => col.Field === 'rating');
    if (!ratingExists) {
      console.log(`ALTER TABLE recipes ADD COLUMN rating FLOAT DEFAULT NULL;`);
    }
    
    // Check if category_id column exists in recipes table
    const categoryIdExists = recipeColumns.some(col => col.Field === 'category_id');
    if (!categoryIdExists) {
      console.log(`ALTER TABLE recipes ADD COLUMN category_id INT DEFAULT NULL;`);
    }
    
    // Closing connection
    conn.release();
    console.log('\nDatabase inspection complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error inspecting database:', error);
    process.exit(1);
  }
}

// Run the function
inspectDatabase();

/**
 * Script to update the database schema to match the application requirements
 * Run this with: node src/update-schema.js
 */

const db = require('./config/database');

async function updateSchema() {
  try {
    console.log('Connected to database. Updating schema...');
    const conn = await db.getConnection();
    
    // Check recipes table structure
    console.log('\nChecking recipes table...');
    const [recipeColumns] = await conn.query('DESCRIBE recipes');
    const recipeColumnNames = recipeColumns.map(col => col.Field);
    
    // Add missing columns to recipes table
    const missingColumns = {
      category_id: 'INT DEFAULT NULL',
      rating: 'FLOAT DEFAULT NULL',
      cooking_time: 'INT DEFAULT NULL',
      difficulty: 'VARCHAR(50) DEFAULT NULL',
      calories: 'INT DEFAULT NULL',
      protein: 'FLOAT DEFAULT NULL',
      carbs: 'FLOAT DEFAULT NULL',
      fat: 'FLOAT DEFAULT NULL',
      user_id: 'INT DEFAULT NULL',
      image_url: 'VARCHAR(255) DEFAULT NULL'
    };
    
    let alterTableStatements = [];
    
    for (const [column, type] of Object.entries(missingColumns)) {
      if (!recipeColumnNames.includes(column)) {
        console.log(`- Adding missing column: ${column}`);
        alterTableStatements.push(`ALTER TABLE recipes ADD COLUMN ${column} ${type};`);
      } else {
        console.log(`- Column already exists: ${column}`);
      }
    }
    
    // Execute all alter table statements
    if (alterTableStatements.length > 0) {
      console.log('\nExecuting schema updates...');
      for (const statement of alterTableStatements) {
        console.log(`Executing: ${statement}`);
        await conn.query(statement);
      }
      console.log('Schema updates completed successfully!');
    } else {
      console.log('\nNo schema updates needed.');
    }
    
    // Check for categories table
    console.log('\nChecking for categories table...');
    const [tables] = await conn.query('SHOW TABLES LIKE "categories"');
    
    if (tables.length === 0) {
      console.log('Creating categories table...');
      await conn.query(`
        CREATE TABLE categories (
          id INT PRIMARY KEY AUTO_INCREMENT,
          name VARCHAR(100) NOT NULL,
          description TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);
      
      // Add some default categories
      console.log('Adding default categories...');
      await conn.query(`
        INSERT INTO categories (name, description) VALUES
        ('Breakfast', 'Morning meals to start your day'),
        ('Lunch', 'Midday meals'),
        ('Dinner', 'Evening meals'),
        ('Dessert', 'Sweet treats'),
        ('Snacks', 'Quick bites between meals'),
        ('Drinks', 'Beverages of all kinds')
      `);
      console.log('Categories table created and populated!');
    } else {
      console.log('Categories table already exists.');
    }
    
    // Check for meal_plans table
    console.log('\nChecking for meal_plans table...');
    const [mealPlanTables] = await conn.query('SHOW TABLES LIKE "meal_plans"');
    
    if (mealPlanTables.length === 0) {
      console.log('Creating meal_plans table...');
      await conn.query(`
        CREATE TABLE meal_plans (
          id INT PRIMARY KEY AUTO_INCREMENT,
          title VARCHAR(100) NOT NULL,
          user_id INT NOT NULL,
          start_date DATE NOT NULL,
          end_date DATE NOT NULL,
          recipes TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);
      console.log('meal_plans table created!');
    } else {
      console.log('meal_plans table already exists.');
    }
    
    // Closing connection
    conn.release();
    console.log('\nDatabase schema update complete! The application should now work correctly.');
    process.exit(0);
  } catch (error) {
    console.error('Error updating database schema:', error);
    process.exit(1);
  }
}

// Run the function
updateSchema();

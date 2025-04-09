const mysql = require('mysql2/promise');

async function updateDatabase() {
  // Create a connection to the database
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'JindKang',
    database: 'recipe_db',
    multipleStatements: true // Enable multiple statements
  });

  console.log('Connected to database');

  try {
    // First, check which columns already exist in the recipes table
    const [columns] = await connection.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = 'recipe_db' 
      AND TABLE_NAME = 'recipes'
    `);
    
    const existingColumns = columns.map(col => col.COLUMN_NAME.toLowerCase());
    console.log('Existing columns:', existingColumns);
    
    // Add missing columns one by one
    if (!existingColumns.includes('category_id')) {
      await connection.query('ALTER TABLE recipes ADD COLUMN category_id INT NULL');
      console.log('Added category_id column');
    }
    
    if (!existingColumns.includes('cooking_time')) {
      await connection.query('ALTER TABLE recipes ADD COLUMN cooking_time INT NULL');
      console.log('Added cooking_time column');
    }
    
    if (!existingColumns.includes('difficulty')) {
      await connection.query('ALTER TABLE recipes ADD COLUMN difficulty VARCHAR(10) NULL');
      console.log('Added difficulty column');
    }
    
    if (!existingColumns.includes('calories')) {
      await connection.query('ALTER TABLE recipes ADD COLUMN calories INT NULL');
      console.log('Added calories column');
    }
    
    if (!existingColumns.includes('protein')) {
      await connection.query('ALTER TABLE recipes ADD COLUMN protein DECIMAL(5,2) NULL');
      console.log('Added protein column');
    }
    
    if (!existingColumns.includes('carbs')) {
      await connection.query('ALTER TABLE recipes ADD COLUMN carbs DECIMAL(5,2) NULL');
      console.log('Added carbs column');
    }
    
    if (!existingColumns.includes('fat')) {
      await connection.query('ALTER TABLE recipes ADD COLUMN fat DECIMAL(5,2) NULL');
      console.log('Added fat column');
    }
    
    if (!existingColumns.includes('rating')) {
      await connection.query('ALTER TABLE recipes ADD COLUMN rating DECIMAL(3,2) DEFAULT 0');
      console.log('Added rating column');
    }

    // Create categories table if it doesn't exist
    await connection.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Categories table created or already exists');

    // Insert some sample categories if they don't exist
    await connection.query(`
      INSERT IGNORE INTO categories (name) VALUES
      ('Breakfast'),
      ('Lunch'),
      ('Dinner'),
      ('Dessert'),
      ('Snack'),
      ('Vegetarian'),
      ('Vegan');
    `);
    console.log('Sample categories inserted');

    // Check if foreign key exists
    const [foreignKeys] = await connection.query(`
      SELECT CONSTRAINT_NAME
      FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
      WHERE TABLE_SCHEMA = 'recipe_db'
      AND TABLE_NAME = 'recipes'
      AND COLUMN_NAME = 'category_id'
      AND REFERENCED_TABLE_NAME = 'categories'
    `);
    
    // Add foreign key constraint if it doesn't exist
    if (foreignKeys.length === 0) {
      try {
        await connection.query(`
          ALTER TABLE recipes
          ADD CONSTRAINT fk_category
          FOREIGN KEY (category_id) REFERENCES categories(id)
          ON DELETE SET NULL;
        `);
        console.log('Foreign key constraint added');
      } catch (err) {
        console.log('Note: Could not add foreign key constraint:', err.message);
      }
    } else {
      console.log('Foreign key constraint already exists');
    }

    // Create users table for authentication
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Users table created or already exists');

    // Create meal plans table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS meal_plans (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        recipe_id INT NOT NULL,
        meal_date DATE NOT NULL,
        meal_type VARCHAR(20) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
      );
    `);
    console.log('Meal plans table created or already exists');

    console.log('Database update completed successfully');
  } catch (error) {
    console.error('Error updating database schema:', error);
  } finally {
    await connection.end();
    console.log('Database connection closed');
  }
}

// Run the update
updateDatabase();

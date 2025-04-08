const db = require('./src/config/database');

async function checkMealPlanTable() {
  try {
    console.log('Connecting to database...');
    
    // Check what columns exist in the meal_plans table
    const [columns] = await db.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = 'recipe_db' 
      AND TABLE_NAME = 'meal_plans'
    `);
    
    console.log('meal_plans table columns:');
    columns.forEach(col => {
      console.log(`- ${col.COLUMN_NAME}`);
    });
    
    // Check sample data
    try {
      const [rows] = await db.query('SELECT * FROM meal_plans LIMIT 1');
      console.log('\nSample meal_plan row:');
      console.log(rows[0] || 'No meal plans found');
    } catch (err) {
      console.log('Could not fetch sample data:', err.message);
    }
    
    console.log('\nDone');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0);
  }
}

checkMealPlanTable();

/**
 * Script to initialize admin user in the database
 * Run this with: node src/init-admin.js
 */

const db = require('./config/database');
const bcrypt = require('bcryptjs');

async function initAdminUser() {
  try {
    console.log('Checking if admin user exists...');
    
    // Connect to database
    const conn = await db.getConnection();
    
    // Check if the admin user already exists
    const [existingUsers] = await conn.query('SELECT * FROM users WHERE username = ?', ['jind']);
    
    if (existingUsers.length > 0) {
      console.log('Admin user "jind" already exists, updating password...');
      
      // Hash the password (admin123)
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash('admin123', saltRounds);
      
      // Update the existing user
      await conn.query(
        'UPDATE users SET password = ?, is_admin = 1 WHERE username = ?',
        [hashedPassword, 'jind']
      );
      
      console.log('Admin user password updated successfully');
    } else {
      console.log('Admin user does not exist, creating...');
      
      // Hash the password (admin123)
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash('admin123', saltRounds);
      
      // Create the admin user
      await conn.query(
        'INSERT INTO users (username, email, password, is_admin) VALUES (?, ?, ?, ?)',
        ['jind', 'admin@recipe.app', hashedPassword, 1]
      );
      
      console.log('Admin user created successfully');
    }
    
    // Release connection
    conn.release();
    
    console.log('Done! You can now login with:');
    console.log('Username: jind');
    console.log('Password: admin123');
    
    // Exit process
    process.exit(0);
  } catch (error) {
    console.error('Error initializing admin user:', error);
    process.exit(1);
  }
}

// Run the function
initAdminUser();

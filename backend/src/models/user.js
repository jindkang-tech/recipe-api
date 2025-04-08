const db = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  // Get all users
  static async getAll() {
    try {
      const [rows] = await db.query(
        'SELECT id, username, email, is_admin, created_at FROM users ORDER BY id'
      );
      return rows;
    } catch (error) {
      console.error('Error fetching all users:', error);
      throw error;
    }
  }

  // Get user by ID
  static async getById(id) {
    try {
      const [rows] = await db.query(
        'SELECT id, username, email, is_admin, created_at FROM users WHERE id = ?', 
        [id]
      );
      return rows[0];
    } catch (error) {
      console.error(`Error fetching user with ID ${id}:`, error);
      throw error;
    }
  }

  // Get user by username
  static async getByUsername(username) {
    try {
      const [rows] = await db.query(
        'SELECT * FROM users WHERE username = ?', 
        [username]
      );
      return rows[0];
    } catch (error) {
      console.error(`Error fetching user with username ${username}:`, error);
      throw error;
    }
  }

  // Get user by email
  static async getByEmail(email) {
    try {
      const [rows] = await db.query(
        'SELECT * FROM users WHERE email = ?', 
        [email]
      );
      return rows[0];
    } catch (error) {
      console.error(`Error fetching user with email ${email}:`, error);
      throw error;
    }
  }

  // Create a new user
  static async create(userData) {
    try {
      // Hash the password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
      
      // Check if this is the special admin user 'jind'
      const isAdmin = userData.username.toLowerCase() === 'jind';
      
      // Insert user with admin role if username is 'jind'
      const [result] = await db.query(
        'INSERT INTO users (username, email, password, is_admin) VALUES (?, ?, ?, ?)',
        [userData.username, userData.email, hashedPassword, isAdmin ? 1 : 0]
      );
      
      return { 
        id: result.insertId, 
        username: userData.username, 
        email: userData.email,
        is_admin: isAdmin,
        created_at: new Date()
      };
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  // Validate user credentials
  static async validateCredentials(username, password) {
    try {
      const user = await this.getByUsername(username);
      
      if (!user) {
        return null;
      }
      
      const isPasswordValid = await bcrypt.compare(password, user.password);
      
      if (!isPasswordValid) {
        return null;
      }
      
      // Special case for admin user 'jind' - ensure admin flag is set
      if (username.toLowerCase() === 'jind' && !user.is_admin) {
        // Update the user to have admin privileges if not already set
        await db.query('UPDATE users SET is_admin = 1 WHERE id = ?', [user.id]);
        user.is_admin = 1;
      }
      
      // Don't return the password
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      console.error('Error validating credentials:', error);
      throw error;
    }
  }

  // Update user
  static async update(id, userData) {
    try {
      let queryParts = [];
      let queryParams = [];
      
      if (userData.username) {
        queryParts.push('username = ?');
        queryParams.push(userData.username);
      }
      
      if (userData.email) {
        queryParts.push('email = ?');
        queryParams.push(userData.email);
      }
      
      if (userData.password) {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
        queryParts.push('password = ?');
        queryParams.push(hashedPassword);
      }
      
      if (queryParts.length === 0) {
        return { id: parseInt(id) };
      }
      
      queryParams.push(id);
      
      await db.query(
        `UPDATE users SET ${queryParts.join(', ')} WHERE id = ?`,
        queryParams
      );
      
      return { id: parseInt(id) };
    } catch (error) {
      console.error(`Error updating user with ID ${id}:`, error);
      throw error;
    }
  }

  // Delete user
  static async delete(id) {
    try {
      await db.query('DELETE FROM users WHERE id = ?', [id]);
      return { id: parseInt(id) };
    } catch (error) {
      console.error(`Error deleting user with ID ${id}:`, error);
      throw error;
    }
  }
}

module.exports = User;

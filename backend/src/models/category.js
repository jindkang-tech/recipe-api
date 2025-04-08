const db = require('../config/database');

class Category {
  // Get all categories
  static async getAll() {
    try {
      const [rows] = await db.query('SELECT * FROM categories ORDER BY name');
      return rows;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  // Get category by ID
  static async getById(id) {
    try {
      const [rows] = await db.query('SELECT * FROM categories WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      console.error(`Error fetching category with ID ${id}:`, error);
      throw error;
    }
  }

  // Create a new category
  static async create(category) {
    try {
      const [result] = await db.query(
        'INSERT INTO categories (name) VALUES (?)',
        [category.name]
      );
      return { id: result.insertId, ...category };
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  }

  // Update a category
  static async update(id, category) {
    try {
      await db.query(
        'UPDATE categories SET name = ? WHERE id = ?',
        [category.name, id]
      );
      return { id: parseInt(id), ...category };
    } catch (error) {
      console.error(`Error updating category with ID ${id}:`, error);
      throw error;
    }
  }

  // Delete a category
  static async delete(id) {
    try {
      await db.query('DELETE FROM categories WHERE id = ?', [id]);
      return true;
    } catch (error) {
      console.error(`Error deleting category with ID ${id}:`, error);
      throw error;
    }
  }
}

module.exports = Category;

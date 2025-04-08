const db = require('../config/database');

class MealPlan {
  // Get all meal plans
  static async getAll(userId) {
    try {
      const [rows] = await db.query(`
        SELECT mp.*, r.title as recipe_title 
        FROM meal_plans mp
        LEFT JOIN recipes r ON mp.recipe_id = r.id
        WHERE mp.user_id = ?
        ORDER BY mp.date
      `, [userId]);
      
      // Transform for UI compatibility
      return rows.map(row => ({
        id: row.id,
        name: row.name || `Meal Plan for ${row.date}`,
        date: row.date,
        recipe_id: row.recipe_id,
        recipe_title: row.recipe_title,
        user_id: row.user_id
      }));
    } catch (error) {
      console.error('Error fetching meal plans:', error);
      throw error;
    }
  }

  // Get meal plans by date range
  static async getByDateRange(startDate, endDate, userId) {
    try {
      const [rows] = await db.query(`
        SELECT mp.*, r.title as recipe_title 
        FROM meal_plans mp
        LEFT JOIN recipes r ON mp.recipe_id = r.id
        WHERE mp.date BETWEEN ? AND ? AND mp.user_id = ?
        ORDER BY mp.date
      `, [startDate, endDate, userId]);
      
      // Transform for UI compatibility
      return rows.map(row => ({
        id: row.id,
        name: row.name || `Meal Plan for ${row.date}`,
        date: row.date,
        recipe_id: row.recipe_id,
        recipe_title: row.recipe_title,
        user_id: row.user_id
      }));
    } catch (error) {
      console.error('Error fetching meal plans by date range:', error);
      throw error;
    }
  }

  // Get meal plan by ID
  static async getById(id, userId) {
    try {
      const [rows] = await db.query(`
        SELECT mp.*, r.title as recipe_title 
        FROM meal_plans mp
        LEFT JOIN recipes r ON mp.recipe_id = r.id
        WHERE mp.id = ? AND mp.user_id = ?
      `, [id, userId]);
      
      if (rows.length === 0) return null;
      
      const row = rows[0];
      return {
        id: row.id,
        name: row.name || `Meal Plan for ${row.date}`,
        date: row.date,
        recipe_id: row.recipe_id,
        recipe_title: row.recipe_title,
        user_id: row.user_id
      };
    } catch (error) {
      console.error(`Error fetching meal plan with ID ${id}:`, error);
      throw error;
    }
  }

  // Create a new meal plan
  static async create(mealPlan) {
    try {
      // Use the simplest set of fields that definitely exist in the database
      const date = mealPlan.date || new Date().toISOString().split('T')[0];
      const recipe_id = mealPlan.recipe_id || null;
      // Store name in memory for response, but don't try to save to DB
      const name = mealPlan.name || mealPlan.title || `Meal Plan for ${date}`;
      
      const [result] = await db.query(
        'INSERT INTO meal_plans (date, recipe_id, user_id) VALUES (?, ?, ?)',
        [date, recipe_id, mealPlan.user_id]
      );
      
      // Get the recipe title if recipe_id is provided
      let recipe_title = null;
      if (recipe_id) {
        try {
          const [recipes] = await db.query('SELECT title FROM recipes WHERE id = ?', [recipe_id]);
          if (recipes.length > 0) {
            recipe_title = recipes[0].title;
          }
        } catch (err) {
          console.error('Error fetching recipe title:', err);
        }
      }
      
      return { 
        id: result.insertId, 
        name,
        date,
        recipe_id,
        recipe_title,
        user_id: mealPlan.user_id
      };
    } catch (error) {
      console.error('Error creating meal plan:', error);
      throw error;
    }
  }

  // Update a meal plan
  static async update(id, mealPlan) {
    try {
      // Use only fields that exist in the database
      const date = mealPlan.date || '';
      const recipe_id = mealPlan.recipe_id || null;
      // Store name in memory for response, but don't try to save to DB
      const name = mealPlan.name || mealPlan.title || '';
      
      await db.query(
        'UPDATE meal_plans SET date = ?, recipe_id = ? WHERE id = ? AND user_id = ?',
        [date, recipe_id, id, mealPlan.user_id]
      );
      
      // Get the recipe title if recipe_id is provided
      let recipe_title = null;
      if (recipe_id) {
        try {
          const [recipes] = await db.query('SELECT title FROM recipes WHERE id = ?', [recipe_id]);
          if (recipes.length > 0) {
            recipe_title = recipes[0].title;
          }
        } catch (err) {
          console.error('Error fetching recipe title:', err);
        }
      }
      
      return { 
        id: parseInt(id), 
        name,
        date,
        recipe_id,
        recipe_title,
        user_id: mealPlan.user_id
      };
    } catch (error) {
      console.error(`Error updating meal plan with ID ${id}:`, error);
      throw error;
    }
  }

  // Delete a meal plan
  static async delete(id, userId) {
    try {
      await db.query('DELETE FROM meal_plans WHERE id = ? AND user_id = ?', [id, userId]);
      return { id: parseInt(id) };
    } catch (error) {
      console.error(`Error deleting meal plan with ID ${id}:`, error);
      throw error;
    }
  }
}

module.exports = MealPlan;

const db = require('../config/database');

class Recipe {
  // Helper method to ensure ingredients and instructions are arrays
  static formatRecipeData(recipe) {
    let ingredients = recipe.ingredients;
    let instructions = recipe.instructions;

    // Handle ingredients
    if (typeof ingredients === 'string') {
      try {
        // Try parsing as JSON first
        ingredients = JSON.parse(ingredients);
      } catch (e) {
        // If not JSON, split by commas and clean up
        ingredients = ingredients.split(',').map(item => item.trim());
      }
    }
    
    // Handle instructions
    if (typeof instructions === 'string') {
      try {
        // Try parsing as JSON first
        instructions = JSON.parse(instructions);
      } catch (e) {
        // If not JSON, split by newlines and clean up
        instructions = instructions.split('\n').map(item => item.trim()).filter(Boolean);
      }
    }

    return {
      ...recipe,
      ingredients: Array.isArray(ingredients) ? JSON.stringify(ingredients) : JSON.stringify([ingredients]),
      instructions: Array.isArray(instructions) ? JSON.stringify(instructions) : JSON.stringify([instructions])
    };
  }

  // Get all recipes
  static async getAll() {
    try {
      const [rows] = await db.query(`
        SELECT * FROM recipes
        ORDER BY created_at DESC
      `);
      return rows;
    } catch (error) {
      console.error('Error fetching recipes:', error);
      throw error;
    }
  }
  
  // Get all recipes sorted by a field
  static async getAllSorted(field, order = 'DESC', limit = null) {
    try {
      let query = `SELECT * FROM recipes ORDER BY ${field} ${order}`;
      if (limit) {
        query += ` LIMIT ${parseInt(limit)}`;
      }
      const [rows] = await db.query(query);
      return rows;
    } catch (error) {
      console.error('Error in Recipe.getAllSorted:', error);
      throw error;
    }
  }

  // Search recipes
  static async search(query) {
    try {
      const searchTerm = `%${query}%`;
      const [rows] = await db.query(`
        SELECT * FROM recipes
        WHERE title LIKE ? OR ingredients LIKE ? OR instructions LIKE ?
        ORDER BY created_at DESC
      `, [searchTerm, searchTerm, searchTerm]);
      return rows;
    } catch (error) {
      console.error('Error searching recipes:', error);
      throw error;
    }
  }
  
  // Get recipes by category (currently a no-op since categories not implemented)
  static async getByCategory(categoryId) {
    try {
      // Fallback to get all recipes since category not implemented
      return this.getAll();
    } catch (error) {
      console.error(`Error fetching recipes by category ${categoryId}:`, error);
      throw error;
    }
  }

  // Get recipe by ID
  static async getById(id) {
    try {
      const [rows] = await db.query(`
        SELECT * FROM recipes
        WHERE id = ?
      `, [id]);
      return rows[0];
    } catch (error) {
      console.error(`Error fetching recipe with ID ${id}:`, error);
      throw error;
    }
  }

  // Create a new recipe
  static async create(recipe) {
    try {
      const formattedRecipe = Recipe.formatRecipeData(recipe);
      const [result] = await db.query(
        `INSERT INTO recipes (
          title, ingredients, instructions
        ) VALUES (?, ?, ?)`,
        [
          formattedRecipe.title, 
          formattedRecipe.ingredients, 
          formattedRecipe.instructions
        ]
      );
      return { id: result.insertId, ...formattedRecipe };
    } catch (error) {
      console.error('Error creating recipe:', error);
      throw error;
    }
  }

  // Update a recipe
  static async update(id, recipe) {
    try {
      const formattedRecipe = Recipe.formatRecipeData(recipe);
      await db.query(
        `UPDATE recipes SET 
          title = ?, 
          ingredients = ?, 
          instructions = ?
        WHERE id = ?`,
        [
          formattedRecipe.title, 
          formattedRecipe.ingredients, 
          formattedRecipe.instructions,
          id
        ]
      );
      return { id: parseInt(id), ...formattedRecipe };
    } catch (error) {
      console.error(`Error updating recipe with ID ${id}:`, error);
      throw error;
    }
  }
  
  // Update recipe rating
  static async updateRating(id, rating) {
    try {
      // Since the rating column doesn't exist in the current schema,
      // we'll log the rating but not attempt to update the database
      console.log(`Rating for recipe ${id} would be set to ${rating} (feature not implemented in current schema)`);
      return { id: parseInt(id), rating };
    } catch (error) {
      console.error(`Error updating rating for recipe with ID ${id}:`, error);
      throw error;
    }
  }

  // Delete a recipe
  static async delete(id) {
    try {
      await db.query('DELETE FROM recipes WHERE id = ?', [id]);
      return true;
    } catch (error) {
      console.error(`Error deleting recipe with ID ${id}:`, error);
      throw error;
    }
  }
}

module.exports = Recipe;

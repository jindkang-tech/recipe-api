const Recipe = require('../models/recipe');

// Controller for recipe-related operations
class RecipeController {
  // Get all recipes
  static async getAll(ctx) {
    try {
      const { sort, limit } = ctx.query;
      let recipes;
      
      if (sort === 'rating') {
        recipes = await Recipe.getAllSorted('rating', 'DESC', limit);
      } else if (sort === 'created') {
        recipes = await Recipe.getAllSorted('created_at', 'DESC', limit);
      } else {
        recipes = await Recipe.getAll();
      }
      
      ctx.body = recipes;
    } catch (err) {
      console.error('Error in getAll:', err);
      ctx.status = 500;
      ctx.body = { error: 'Failed to fetch recipes' };
    }
  }
  
  // Search recipes
  static async search(ctx) {
    try {
      const { query } = ctx.query;
      
      if (!query) {
        ctx.status = 400;
        ctx.body = { error: 'Search query is required' };
        return;
      }
      
      const recipes = await Recipe.search(query);
      ctx.body = recipes;
    } catch (error) {
      ctx.status = 500;
      ctx.body = { error: 'Failed to search recipes' };
    }
  }
  
  // Get recipes by category
  static async getByCategory(ctx) {
    try {
      const categoryId = ctx.params.categoryId;
      const recipes = await Recipe.getByCategory(categoryId);
      ctx.body = recipes;
    } catch (error) {
      ctx.status = 500;
      ctx.body = { error: 'Failed to retrieve recipes by category' };
    }
  }

  // Get recipe by ID
  static async getById(ctx) {
    try {
      const id = ctx.params.id;
      const recipe = await Recipe.getById(id);
      
      if (!recipe) {
        ctx.status = 404;
        ctx.body = { error: 'Recipe not found' };
        return;
      }
      
      ctx.body = recipe;
    } catch (error) {
      ctx.status = 500;
      ctx.body = { error: 'Failed to retrieve recipe' };
    }
  }

  // Create a new recipe
  static async create(ctx) {
    try {
      const { 
        title, ingredients, instructions, category_id, cooking_time,
        difficulty, calories, protein, carbs, fat 
      } = ctx.request.body;
      
      // Validate input
      if (!title || !ingredients || !instructions) {
        ctx.status = 400;
        ctx.body = { error: 'Missing required fields' };
        return;
      }
      
      // Get user ID from JWT token
      const userId = ctx.state.user.id;
      
      const recipe = await Recipe.create({ 
        title, ingredients, instructions, category_id, cooking_time,
        difficulty, calories, protein, carbs, fat, user_id: userId
      });
      ctx.status = 201;
      ctx.body = recipe;
    } catch (error) {
      ctx.status = 500;
      ctx.body = { error: 'Failed to create recipe' };
    }
  }

  // Update a recipe
  static async update(ctx) {
    try {
      const id = ctx.params.id;
      const { 
        title, ingredients, instructions, category_id, cooking_time,
        difficulty, calories, protein, carbs, fat 
      } = ctx.request.body;
      
      // Validate input
      if (!title || !ingredients || !instructions) {
        ctx.status = 400;
        ctx.body = { error: 'Missing required fields' };
        return;
      }
      
      // Check if recipe exists
      const existingRecipe = await Recipe.getById(id);
      if (!existingRecipe) {
        ctx.status = 404;
        ctx.body = { error: 'Recipe not found' };
        return;
      }
      
      const updatedRecipe = await Recipe.update(id, { 
        title, ingredients, instructions, category_id, cooking_time,
        difficulty, calories, protein, carbs, fat
      });
      ctx.body = updatedRecipe;
    } catch (error) {
      ctx.status = 500;
      ctx.body = { error: 'Failed to update recipe' };
    }
  }
  
  // Rate a recipe
  static async rateRecipe(ctx) {
    try {
      const id = ctx.params.id;
      let { rating } = ctx.request.body;
      
      // Convert rating to number if it's a string
      rating = Number(rating);
      
      // Validate input
      if (isNaN(rating) || rating < 0 || rating > 5) {
        ctx.status = 400;
        ctx.body = { error: 'Rating must be between 0 and 5' };
        return;
      }
      
      // Round to 2 decimal places
      rating = Math.round(rating * 100) / 100;
      
      // Check if recipe exists
      const existingRecipe = await Recipe.getById(id);
      if (!existingRecipe) {
        ctx.status = 404;
        ctx.body = { error: 'Recipe not found' };
        return;
      }
      
      const updatedRating = await Recipe.updateRating(id, rating);
      ctx.body = updatedRating;
    } catch (error) {
      console.error('Error in rateRecipe:', error);
      ctx.status = 500;
      ctx.body = { error: 'Failed to rate recipe' };
    }
  }

  // Delete a recipe
  static async delete(ctx) {
    try {
      const id = ctx.params.id;
      
      // Check if recipe exists
      const existingRecipe = await Recipe.getById(id);
      if (!existingRecipe) {
        ctx.status = 404;
        ctx.body = { error: 'Recipe not found' };
        return;
      }
      
      await Recipe.delete(id);
      ctx.status = 204; // No content
      ctx.body = null;
    } catch (error) {
      ctx.status = 500;
      ctx.body = { error: 'Failed to delete recipe' };
    }
  }
}

module.exports = RecipeController;

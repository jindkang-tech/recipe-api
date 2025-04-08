const MealPlan = require('../models/mealPlan');

// Controller for meal plan-related operations
class MealPlanController {
  // Get all meal plans
  static async getAll(ctx) {
    try {
      const userId = ctx.state.user.id;
      const mealPlans = await MealPlan.getAll(userId);
      ctx.body = mealPlans;
    } catch (error) {
      console.error('Error in getAll:', error);
      ctx.status = 500;
      ctx.body = { error: 'Failed to retrieve meal plans' };
    }
  }

  // Get meal plans by date range
  static async getByDateRange(ctx) {
    try {
      const { startDate, endDate } = ctx.query;
      const userId = ctx.state.user.id;

      if (!startDate || !endDate) {
        ctx.status = 400;
        ctx.body = { error: 'Start date and end date are required' };
        return;
      }
      
      const mealPlans = await MealPlan.getByDateRange(startDate, endDate, userId);
      ctx.body = mealPlans;
    } catch (error) {
      console.error('Error in getByDateRange:', error);
      ctx.status = 500;
      ctx.body = { error: 'Failed to retrieve meal plans by date range' };
    }
  }

  // Get meal plan by ID
  static async getById(ctx) {
    try {
      const id = ctx.params.id;
      const userId = ctx.state.user.id;
      const mealPlan = await MealPlan.getById(id, userId);
      
      if (!mealPlan) {
        ctx.status = 404;
        ctx.body = { error: 'Meal plan not found' };
        return;
      }
      
      ctx.body = mealPlan;
    } catch (error) {
      console.error('Error in getById:', error);
      ctx.status = 500;
      ctx.body = { error: 'Failed to retrieve meal plan' };
    }
  }

  // Create a new meal plan
  static async create(ctx) {
    try {
      const mealPlanData = {
        ...ctx.request.body,
        user_id: ctx.state.user.id
      };
      
      if (!mealPlanData.name || !mealPlanData.date || !mealPlanData.recipe_id) {
        ctx.status = 400;
        ctx.body = { error: 'Name, date, and recipe_id are required' };
        return;
      }
      
      const newMealPlan = await MealPlan.create(mealPlanData);
      ctx.status = 201;
      ctx.body = newMealPlan;
    } catch (error) {
      console.error('Error in create:', error);
      ctx.status = 500;
      ctx.body = { error: 'Failed to create meal plan' };
    }
  }

  // Update a meal plan
  static async update(ctx) {
    try {
      const id = ctx.params.id;
      const mealPlanData = {
        ...ctx.request.body,
        user_id: ctx.state.user.id
      };
      
      if (!mealPlanData.name || !mealPlanData.date || !mealPlanData.recipe_id) {
        ctx.status = 400;
        ctx.body = { error: 'Name, date, and recipe_id are required' };
        return;
      }
      
      const updatedMealPlan = await MealPlan.update(id, mealPlanData);
      ctx.body = updatedMealPlan;
    } catch (error) {
      console.error('Error in update:', error);
      ctx.status = 500;
      ctx.body = { error: 'Failed to update meal plan' };
    }
  }

  // Delete a meal plan
  static async delete(ctx) {
    try {
      const id = ctx.params.id;
      const userId = ctx.state.user.id;
      await MealPlan.delete(id, userId);
      ctx.body = { message: 'Meal plan deleted successfully' };
    } catch (error) {
      console.error('Error in delete:', error);
      ctx.status = 500;
      ctx.body = { error: 'Failed to delete meal plan' };
    }
  }
}

module.exports = MealPlanController;

const Category = require('../models/category');

// Controller for category-related operations
class CategoryController {
  // Get all categories
  static async getAll(ctx) {
    try {
      const categories = await Category.getAll();
      ctx.body = categories;
    } catch (error) {
      ctx.status = 500;
      ctx.body = { error: 'Failed to retrieve categories' };
    }
  }

  // Get category by ID
  static async getById(ctx) {
    try {
      const id = ctx.params.id;
      const category = await Category.getById(id);
      
      if (!category) {
        ctx.status = 404;
        ctx.body = { error: 'Category not found' };
        return;
      }
      
      ctx.body = category;
    } catch (error) {
      ctx.status = 500;
      ctx.body = { error: 'Failed to retrieve category' };
    }
  }

  // Create a new category
  static async create(ctx) {
    try {
      const { name } = ctx.request.body;
      
      // Validate input
      if (!name) {
        ctx.status = 400;
        ctx.body = { error: 'Category name is required' };
        return;
      }
      
      const category = await Category.create({ name });
      ctx.status = 201;
      ctx.body = category;
    } catch (error) {
      ctx.status = 500;
      ctx.body = { error: 'Failed to create category' };
    }
  }

  // Update a category
  static async update(ctx) {
    try {
      const id = ctx.params.id;
      const { name } = ctx.request.body;
      
      // Validate input
      if (!name) {
        ctx.status = 400;
        ctx.body = { error: 'Category name is required' };
        return;
      }
      
      // Check if category exists
      const existingCategory = await Category.getById(id);
      if (!existingCategory) {
        ctx.status = 404;
        ctx.body = { error: 'Category not found' };
        return;
      }
      
      const updatedCategory = await Category.update(id, { name });
      ctx.body = updatedCategory;
    } catch (error) {
      ctx.status = 500;
      ctx.body = { error: 'Failed to update category' };
    }
  }

  // Delete a category
  static async delete(ctx) {
    try {
      const id = ctx.params.id;
      
      // Check if category exists
      const existingCategory = await Category.getById(id);
      if (!existingCategory) {
        ctx.status = 404;
        ctx.body = { error: 'Category not found' };
        return;
      }
      
      await Category.delete(id);
      ctx.status = 204; // No content
      ctx.body = null;
    } catch (error) {
      ctx.status = 500;
      ctx.body = { error: 'Failed to delete category' };
    }
  }
}

module.exports = CategoryController;

const supertest = require('supertest');
const app = require('../app');

// Mock the database module
jest.mock('../config/database', () => {
  const mockPool = {
    query: jest.fn()
  };
  return mockPool;
});

const db = require('../config/database');
const request = supertest(app.callback());

describe('Recipe API Endpoints', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('GET /api/recipes', () => {
    it('should return all recipes', async () => {
      // Mock database response
      const mockRecipes = [
        { id: 1, title: 'Test Recipe 1', ingredients: 'Ingredient 1', instructions: 'Instructions 1' },
        { id: 2, title: 'Test Recipe 2', ingredients: 'Ingredient 2', instructions: 'Instructions 2' }
      ];
      db.query.mockResolvedValueOnce([mockRecipes]);

      // Make request
      const response = await request.get('/api/recipes');

      // Assertions
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockRecipes);
      expect(db.query).toHaveBeenCalledWith('SELECT * FROM recipes ORDER BY created_at DESC');
    });

    it('should handle database errors', async () => {
      // Mock database error
      db.query.mockRejectedValueOnce(new Error('Database error'));

      // Make request
      const response = await request.get('/api/recipes');

      // Assertions
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/recipes/:id', () => {
    it('should return a recipe by id', async () => {
      // Mock database response
      const mockRecipe = { id: 1, title: 'Test Recipe', ingredients: 'Ingredient', instructions: 'Instructions' };
      db.query.mockResolvedValueOnce([[mockRecipe]]);

      // Make request
      const response = await request.get('/api/recipes/1');

      // Assertions
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockRecipe);
      expect(db.query).toHaveBeenCalledWith('SELECT * FROM recipes WHERE id = ?', ['1']);
    });

    it('should return 404 if recipe not found', async () => {
      // Mock empty database response
      db.query.mockResolvedValueOnce([[]]);

      // Make request
      const response = await request.get('/api/recipes/999');

      // Assertions
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Recipe not found');
    });
  });

  describe('POST /api/recipes', () => {
    it('should create a new recipe', async () => {
      // Mock database response
      const mockInsertResult = { insertId: 1 };
      db.query.mockResolvedValueOnce([mockInsertResult]);

      // Recipe data
      const newRecipe = {
        title: 'New Recipe',
        ingredients: 'New Ingredients',
        instructions: 'New Instructions'
      };

      // Make request
      const response = await request
        .post('/api/recipes')
        .send(newRecipe);

      // Assertions
      expect(response.status).toBe(201);
      expect(response.body).toEqual({ id: 1, ...newRecipe });
      expect(db.query).toHaveBeenCalledWith(
        'INSERT INTO recipes (title, ingredients, instructions) VALUES (?, ?, ?)',
        [newRecipe.title, newRecipe.ingredients, newRecipe.instructions]
      );
    });

    it('should return 400 if required fields are missing', async () => {
      // Recipe data with missing fields
      const incompleteRecipe = {
        title: 'Incomplete Recipe'
        // Missing ingredients and instructions
      };

      // Make request
      const response = await request
        .post('/api/recipes')
        .send(incompleteRecipe);

      // Assertions
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Missing required fields');
      expect(db.query).not.toHaveBeenCalled();
    });
  });

  describe('PUT /api/recipes/:id', () => {
    it('should update an existing recipe', async () => {
      // Mock database responses
      db.query.mockResolvedValueOnce([[{ id: 1 }]]); // Recipe exists
      db.query.mockResolvedValueOnce([{}]); // Update successful

      // Recipe update data
      const updateData = {
        title: 'Updated Recipe',
        ingredients: 'Updated Ingredients',
        instructions: 'Updated Instructions'
      };

      // Make request
      const response = await request
        .put('/api/recipes/1')
        .send(updateData);

      // Assertions
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ id: 1, ...updateData });
      expect(db.query).toHaveBeenCalledWith('SELECT * FROM recipes WHERE id = ?', ['1']);
      expect(db.query).toHaveBeenCalledWith(
        'UPDATE recipes SET title = ?, ingredients = ?, instructions = ? WHERE id = ?',
        [updateData.title, updateData.ingredients, updateData.instructions, '1']
      );
    });

    it('should return 404 if recipe to update is not found', async () => {
      // Mock empty database response (recipe not found)
      db.query.mockResolvedValueOnce([[]]);

      // Recipe update data
      const updateData = {
        title: 'Updated Recipe',
        ingredients: 'Updated Ingredients',
        instructions: 'Updated Instructions'
      };

      // Make request
      const response = await request
        .put('/api/recipes/999')
        .send(updateData);

      // Assertions
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Recipe not found');
      expect(db.query).toHaveBeenCalledTimes(1); // Only the first query to check existence
    });
  });

  describe('DELETE /api/recipes/:id', () => {
    it('should delete an existing recipe', async () => {
      // Mock database responses
      db.query.mockResolvedValueOnce([[{ id: 1 }]]); // Recipe exists
      db.query.mockResolvedValueOnce([{}]); // Delete successful

      // Make request
      const response = await request.delete('/api/recipes/1');

      // Assertions
      expect(response.status).toBe(204);
      expect(response.body).toEqual({});
      expect(db.query).toHaveBeenCalledWith('SELECT * FROM recipes WHERE id = ?', ['1']);
      expect(db.query).toHaveBeenCalledWith('DELETE FROM recipes WHERE id = ?', ['1']);
    });

    it('should return 404 if recipe to delete is not found', async () => {
      // Mock empty database response (recipe not found)
      db.query.mockResolvedValueOnce([[]]);

      // Make request
      const response = await request.delete('/api/recipes/999');

      // Assertions
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Recipe not found');
      expect(db.query).toHaveBeenCalledTimes(1); // Only the first query to check existence
    });
  });
});

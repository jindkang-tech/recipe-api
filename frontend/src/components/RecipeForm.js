import React, { useState, useEffect } from 'react';
import { CategoryService } from '../services/api';

const RecipeForm = ({ recipe, onSubmit, onCancel }) => {
  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [cookingTime, setCookingTime] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch categories when component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await CategoryService.getAllCategories();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Initialize form with recipe data if editing
  useEffect(() => {
    if (recipe) {
      setTitle(recipe.title || '');
      setIngredients(recipe.ingredients || '');
      setInstructions(recipe.instructions || '');
      setCategoryId(recipe.category_id || '');
      setCookingTime(recipe.cooking_time || '');
      setDifficulty(recipe.difficulty || '');
      setCalories(recipe.calories || '');
      setProtein(recipe.protein || '');
      setCarbs(recipe.carbs || '');
      setFat(recipe.fat || '');
    }
  }, [recipe]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form - ensure values are strings before calling trim()
    if (!title || typeof title !== 'string' || title.trim() === '' || 
        !ingredients || typeof ingredients !== 'string' || ingredients.trim() === '' || 
        !instructions || typeof instructions !== 'string' || instructions.trim() === '') {
      alert('Please fill in all required fields');
      return;
    }
    
    // Submit form data
    onSubmit({
      title,
      ingredients,
      instructions,
      category_id: categoryId || null,
      cooking_time: cookingTime || null,
      difficulty: difficulty || null,
      calories: calories || null,
      protein: protein || null,
      carbs: carbs || null,
      fat: fat || null
    });
    
    // Reset form
    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setIngredients('');
    setInstructions('');
    setCategoryId('');
    setCookingTime('');
    setDifficulty('');
    setCalories('');
    setProtein('');
    setCarbs('');
    setFat('');
  };

  return (
    <div className="recipe-form">
      <h2>{recipe ? 'Edit Recipe' : 'Add New Recipe'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Recipe title"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="ingredients">Ingredients</label>
          <textarea
            id="ingredients"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            placeholder="Enter ingredients (one per line)"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="instructions">Instructions</label>
          <textarea
            id="instructions"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="Enter cooking instructions"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">Select a category</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-row">
          <div className="form-group half">
            <label htmlFor="cookingTime">Cooking Time (minutes)</label>
            <input
              type="number"
              id="cookingTime"
              value={cookingTime}
              onChange={(e) => setCookingTime(e.target.value)}
              placeholder="e.g., 30"
              min="0"
            />
          </div>
          
          <div className="form-group half">
            <label htmlFor="difficulty">Difficulty</label>
            <select
              id="difficulty"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option value="">Select difficulty</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
        </div>
        
        <h3>Nutrition Information (per serving)</h3>
        <div className="form-row">
          <div className="form-group half">
            <label htmlFor="calories">Calories</label>
            <input
              type="number"
              id="calories"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              placeholder="e.g., 250"
              min="0"
            />
          </div>
          
          <div className="form-group half">
            <label htmlFor="protein">Protein (g)</label>
            <input
              type="number"
              id="protein"
              value={protein}
              onChange={(e) => setProtein(e.target.value)}
              placeholder="e.g., 15"
              min="0"
              step="0.1"
            />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group half">
            <label htmlFor="carbs">Carbs (g)</label>
            <input
              type="number"
              id="carbs"
              value={carbs}
              onChange={(e) => setCarbs(e.target.value)}
              placeholder="e.g., 30"
              min="0"
              step="0.1"
            />
          </div>
          
          <div className="form-group half">
            <label htmlFor="fat">Fat (g)</label>
            <input
              type="number"
              id="fat"
              value={fat}
              onChange={(e) => setFat(e.target.value)}
              placeholder="e.g., 10"
              min="0"
              step="0.1"
            />
          </div>
        </div>
        
        <div className="form-actions">
          <button type="submit" className="submit-button">
            {recipe ? 'Update Recipe' : 'Add Recipe'}
          </button>
          {onCancel && (
            <button 
              type="button" 
              className="cancel-button" 
              onClick={() => {
                resetForm();
                onCancel();
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default RecipeForm;

import React, { useState, useEffect } from 'react';
import { MealPlanService, RecipeService } from '../services/api';
import './styles.css';

const MealPlanList = () => {
  const [mealPlans, setMealPlans] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [newMealPlan, setNewMealPlan] = useState({
    name: '',
    date: new Date().toISOString().split('T')[0],
    recipe_id: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchMealPlans();
    fetchRecipes();
  }, []);

  const fetchMealPlans = async () => {
    try {
      setLoading(true);
      const data = await MealPlanService.getAllMealPlans();
      setMealPlans(data);
      setError(null);
    } catch (err) {
      setError('Failed to load meal plans');
      console.error('Error fetching meal plans:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecipes = async () => {
    try {
      const data = await RecipeService.getAllRecipes();
      setRecipes(data);
    } catch (err) {
      console.error('Error fetching recipes:', err);
    }
  };

  const handleFilterByDateRange = async () => {
    try {
      setLoading(true);
      const data = await MealPlanService.getMealPlansByDateRange(
        dateRange.startDate, 
        dateRange.endDate
      );
      setMealPlans(data);
      setError(null);
    } catch (err) {
      setError('Failed to filter meal plans by date range');
      console.error('Error filtering meal plans:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMealPlan({
      ...newMealPlan,
      [name]: value
    });
  };

  const handleDateRangeChange = (e) => {
    const { name, value } = e.target;
    setDateRange({
      ...dateRange,
      [name]: value
    });
  };

  const handleAddMealPlan = async (e) => {
    e.preventDefault();
    if (!newMealPlan.name.trim() || !newMealPlan.date || !newMealPlan.recipe_id) return;

    try {
      await MealPlanService.createMealPlan(newMealPlan);
      setNewMealPlan({
        name: '',
        date: new Date().toISOString().split('T')[0],
        recipe_id: ''
      });
      fetchMealPlans();
    } catch (err) {
      setError('Failed to add meal plan');
      console.error('Error adding meal plan:', err);
    }
  };

  const handleDeleteMealPlan = async (id) => {
    try {
      await MealPlanService.deleteMealPlan(id);
      fetchMealPlans();
    } catch (err) {
      setError('Failed to delete meal plan');
      console.error('Error deleting meal plan:', err);
    }
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading && mealPlans.length === 0) return <div>Loading meal plans...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="meal-plan-container">
      <h2>Meal Planning</h2>
      
      <div className="date-range-filter">
        <h3>Filter by Date Range</h3>
        <div className="date-inputs">
          <div>
            <label>Start Date:</label>
            <input
              type="date"
              name="startDate"
              value={dateRange.startDate}
              onChange={handleDateRangeChange}
            />
          </div>
          <div>
            <label>End Date:</label>
            <input
              type="date"
              name="endDate"
              value={dateRange.endDate}
              onChange={handleDateRangeChange}
            />
          </div>
          <button onClick={handleFilterByDateRange}>Filter</button>
        </div>
      </div>

      <div className="meal-plans-list">
        <h3>Your Meal Plans</h3>
        {mealPlans.length === 0 ? (
          <p>No meal plans found. Start planning your meals!</p>
        ) : (
          <ul>
            {mealPlans.map(plan => (
              <li key={plan.id} className="meal-plan-item">
                <div className="meal-plan-details">
                  <h4>{plan.name}</h4>
                  <p><strong>Date:</strong> {formatDate(plan.date)}</p>
                  <p><strong>Recipe:</strong> {plan.recipe_title || 'No recipe selected'}</p>
                </div>
                <button 
                  className="delete-btn"
                  onClick={() => handleDeleteMealPlan(plan.id)}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      <div className="add-meal-plan">
        <h3>Add New Meal Plan</h3>
        <form onSubmit={handleAddMealPlan}>
          <div className="form-group">
            <label>Name (e.g., Breakfast, Lunch, Dinner):</label>
            <input
              type="text"
              name="name"
              value={newMealPlan.name}
              onChange={handleInputChange}
              placeholder="Meal name"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Date:</label>
            <input
              type="date"
              name="date"
              value={newMealPlan.date}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Recipe:</label>
            <select
              name="recipe_id"
              value={newMealPlan.recipe_id}
              onChange={handleInputChange}
              required
            >
              <option value="">Select a recipe</option>
              {recipes.map(recipe => (
                <option key={recipe.id} value={recipe.id}>
                  {recipe.title}
                </option>
              ))}
            </select>
          </div>
          
          <button type="submit" className="add-btn">Add Meal Plan</button>
        </form>
      </div>
    </div>
  );
};

export default MealPlanList;

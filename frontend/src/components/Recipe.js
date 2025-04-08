import React, { useState } from 'react';
import RecipeRating from './RecipeRating';

const Recipe = ({ recipe, onEdit, onDelete }) => {
  const [currentRating, setCurrentRating] = useState(recipe.rating || 0);

  return (
    <div className="recipe-card">
      <h3>{recipe.title}</h3>
      
      {recipe.category_name && (
        <div className="recipe-category">
          <span className="category-tag">{recipe.category_name}</span>
        </div>
      )}
      
      <div className="recipe-meta">
        {recipe.cooking_time && (
          <div className="meta-item">
            <span className="meta-label">Cooking Time:</span>
            <span>{recipe.cooking_time} minutes</span>
          </div>
        )}
        
        {recipe.difficulty && (
          <div className="meta-item">
            <span className="meta-label">Difficulty:</span>
            <span>{recipe.difficulty}</span>
          </div>
        )}
        
        <div className="meta-item">
          <span className="meta-label">Rating:</span>
          <RecipeRating 
            recipeId={recipe.id} 
            initialRating={currentRating} 
            onRatingChange={setCurrentRating} 
          />
        </div>
      </div>
      
      <div className="recipe-section">
        <h4>Ingredients:</h4>
        <p>{recipe.ingredients}</p>
      </div>
      
      <div className="recipe-section">
        <h4>Instructions:</h4>
        <p>{recipe.instructions}</p>
      </div>
      
      {(recipe.calories || recipe.protein || recipe.carbs || recipe.fat) && (
        <div className="recipe-section nutrition">
          <h4>Nutrition Information (per serving):</h4>
          <div className="nutrition-grid">
            {recipe.calories && (
              <div className="nutrition-item">
                <span className="nutrition-value">{recipe.calories}</span>
                <span className="nutrition-label">Calories</span>
              </div>
            )}
            {recipe.protein && (
              <div className="nutrition-item">
                <span className="nutrition-value">{recipe.protein}g</span>
                <span className="nutrition-label">Protein</span>
              </div>
            )}
            {recipe.carbs && (
              <div className="nutrition-item">
                <span className="nutrition-value">{recipe.carbs}g</span>
                <span className="nutrition-label">Carbs</span>
              </div>
            )}
            {recipe.fat && (
              <div className="nutrition-item">
                <span className="nutrition-value">{recipe.fat}g</span>
                <span className="nutrition-label">Fat</span>
              </div>
            )}
          </div>
        </div>
      )}
      
      <div className="recipe-actions">
        <button 
          className="edit-button" 
          onClick={() => onEdit(recipe)}
        >
          Edit
        </button>
        <button 
          className="delete-button" 
          onClick={() => onDelete(recipe.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default Recipe;

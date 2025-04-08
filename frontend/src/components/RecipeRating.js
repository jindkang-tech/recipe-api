import React, { useState } from 'react';
import { RecipeService } from '../services/api';
import './styles.css';

const RecipeRating = ({ recipeId, initialRating = 0, onRatingChange }) => {
  const [rating, setRating] = useState(initialRating);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [error, setError] = useState(null);

  const handleRatingClick = async (newRating) => {
    try {
      setError(null);
      await RecipeService.rateRecipe(recipeId, newRating);
      setRating(newRating);
      if (onRatingChange) {
        onRatingChange(newRating);
      }
    } catch (err) {
      setError('Failed to update rating');
      console.error('Error updating rating:', err);
    }
  };

  return (
    <div className="recipe-rating">
      <div className="stars">
        {[1, 2, 3, 4, 5].map(star => (
          <span
            key={star}
            className={`star ${star <= (hoveredRating || rating) ? 'filled' : ''}`}
            onClick={() => handleRatingClick(star)}
            onMouseEnter={() => setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(0)}
          >
            ★
          </span>
        ))}
      </div>
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default RecipeRating;

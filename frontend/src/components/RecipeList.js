import React, { useState, useEffect } from 'react';
import Recipe from './Recipe';
import SearchBar from './SearchBar';
import CategoryList from './CategoryList';
import { RecipeService } from '../services/api';

const RecipeList = ({ recipes: initialRecipes, onEdit, onDelete }) => {
  const [recipes, setRecipes] = useState(initialRecipes || []);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    setRecipes(initialRecipes || []);
    setFilteredRecipes(initialRecipes || []);
  }, [initialRecipes]);

  // Handle search
  const handleSearch = async (query) => {
    setSearchQuery(query);
    setSelectedCategory(null);
    setLoading(true);
    
    try {
      const searchResults = await RecipeService.searchRecipes(query);
      setFilteredRecipes(searchResults);
      setError(null);
    } catch (err) {
      setError('Failed to search recipes');
      console.error('Error searching recipes:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle category selection
  const handleCategorySelect = async (categoryId) => {
    setSelectedCategory(categoryId);
    setSearchQuery('');
    setLoading(true);
    
    try {
      let categoryRecipes;
      if (categoryId) {
        categoryRecipes = await RecipeService.getRecipesByCategory(categoryId);
      } else {
        categoryRecipes = await RecipeService.getAllRecipes();
      }
      setFilteredRecipes(categoryRecipes);
      setError(null);
    } catch (err) {
      setError('Failed to load recipes');
      console.error('Error loading recipes by category:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Reset filters
  const resetFilters = async () => {
    setSelectedCategory(null);
    setSearchQuery('');
    setFilteredRecipes(recipes);
  };
  
  if (loading) {
    return <div className="loading">Loading recipes...</div>;
  }
  
  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!filteredRecipes || filteredRecipes.length === 0) {
    return (
      <div className="recipe-container">
        <div className="sidebar">
          <CategoryList onSelectCategory={handleCategorySelect} />
        </div>
        <div className="main-content">
          <SearchBar onSearch={handleSearch} />
          {searchQuery && (
            <div className="search-info">
              <p>No recipes found for "{searchQuery}"</p>
              <button onClick={resetFilters}>Clear Search</button>
            </div>
          )}
          {selectedCategory && (
            <div className="search-info">
              <p>No recipes found in this category</p>
              <button onClick={resetFilters}>Show All Recipes</button>
            </div>
          )}
          {!searchQuery && !selectedCategory && (
            <div className="no-recipes">
              <p>No recipes found. Add a new recipe to get started!</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="recipe-container">
      <div className="sidebar">
        <CategoryList onSelectCategory={handleCategorySelect} />
      </div>
      <div className="main-content">
        <div className="recipe-controls">
          <SearchBar onSearch={handleSearch} />
          {(searchQuery || selectedCategory) && (
            <button className="reset-button" onClick={resetFilters}>
              Clear Filters
            </button>
          )}
        </div>
        
        {searchQuery && (
          <div className="search-info">
            <p>Showing results for "{searchQuery}"</p>
          </div>
        )}
        
        <div className="recipe-list">
          {filteredRecipes.map(recipe => (
            <Recipe
              key={recipe.id}
              recipe={recipe}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecipeList;

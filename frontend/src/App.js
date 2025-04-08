import React, { useState, useEffect } from 'react';
import { ConfigProvider } from 'antd';
import RecipeList from './components/RecipeList';
import RecipeForm from './components/RecipeForm';
import MealPlanList from './components/MealPlanList';
import AdminPanel from './components/AdminPanel';
import Auth from './components/Auth';
import { RecipeService, AuthService } from './services/api';
import customTheme from './theme';
import './App.css';
import './components/styles.css';

function App() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [activeTab, setActiveTab] = useState('recipes');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Check authentication on component mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      if (AuthService.isAuthenticated()) {
        try {
          const user = await AuthService.getCurrentUser();
          if (user) {
            setIsAuthenticated(true);
            setCurrentUser(user);
          }
        } catch (error) {
          console.error('Auth check error:', error);
          AuthService.logout();
        }
      }
      setLoading(false);
    };
    
    checkAuthStatus();
  }, []);
  
  // Fetch recipes when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchRecipes();
    }
  }, [isAuthenticated]);

  // Fetch all recipes
  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const data = await RecipeService.getAllRecipes();
      setRecipes(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch recipes. Please try again later.');
      console.error('Error fetching recipes:', err);
    } finally {
      setLoading(false);
    }
  };

  // Add a new recipe
  const handleAddRecipe = async (recipeData) => {
    try {
      setLoading(true);
      const newRecipe = await RecipeService.createRecipe(recipeData);
      setRecipes([...recipes, newRecipe]);
      setError(null);
    } catch (err) {
      setError('Failed to add recipe. Please try again.');
      console.error('Error adding recipe:', err);
    } finally {
      setLoading(false);
    }
  };

  // Update a recipe
  const handleUpdateRecipe = async (recipeData) => {
    try {
      setLoading(true);
      const updatedRecipe = await RecipeService.updateRecipe(editingRecipe.id, recipeData);
      
      setRecipes(recipes.map(recipe => 
        recipe.id === editingRecipe.id ? updatedRecipe : recipe
      ));
      
      setEditingRecipe(null);
      setError(null);
    } catch (err) {
      setError('Failed to update recipe. Please try again.');
      console.error('Error updating recipe:', err);
    } finally {
      setLoading(false);
    }
  };

  // Delete a recipe
  const handleDeleteRecipe = async (id) => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      try {
        setLoading(true);
        await RecipeService.deleteRecipe(id);
        setRecipes(recipes.filter(recipe => recipe.id !== id));
        setError(null);
      } catch (err) {
        setError('Failed to delete recipe. Please try again.');
        console.error('Error deleting recipe:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  // Handle form submission
  const handleSubmit = (recipeData) => {
    if (editingRecipe) {
      handleUpdateRecipe(recipeData);
    } else {
      handleAddRecipe(recipeData);
    }
  };

  // Set recipe for editing
  const handleEdit = (recipe) => {
    setEditingRecipe(recipe);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cancel editing
  const handleCancel = () => {
    setEditingRecipe(null);
  };

  // Handle user authentication
  const handleAuthenticated = (user) => {
    setIsAuthenticated(true);
    setCurrentUser(user);
    fetchRecipes();
  };
  
  // Handle user logout
  const handleLogout = () => {
    AuthService.logout();
    setIsAuthenticated(false);
    setCurrentUser(null);
    setRecipes([]);
  };
  
  return (
    <ConfigProvider theme={customTheme}>
      <div className="app">
        {isAuthenticated ? (
          <>
            <header className="app-header">
              <h1>Recipe Manager</h1>
              <div className="user-info">
                <span>
                  Welcome, {currentUser?.username}!
                  {currentUser?.is_admin && (
                    <span className="admin-badge">Admin</span>
                  )}
                </span>
                <button onClick={handleLogout} className="logout-button">
                  <span role="img" aria-label="Logout">🚪</span> Logout
                </button>
              </div>
              <nav className="app-nav">
                <ul>
                  <li>
                    <button 
                      className={activeTab === 'recipes' ? 'active' : ''}
                      onClick={() => setActiveTab('recipes')}
                    >
                      <span role="img" aria-label="Recipe icon" style={{ fontSize: '18px' }}>📖</span> Recipes
                    </button>
                  </li>
                  <li>
                    <button 
                      className={activeTab === 'meal-plans' ? 'active' : ''}
                      onClick={() => setActiveTab('meal-plans')}
                    >
                      <span role="img" aria-label="Meal plan icon" style={{ fontSize: '18px' }}>🍽️</span> Meal Planning
                    </button>
                  </li>
                  {currentUser?.is_admin && (
                    <li>
                      <button 
                        className={activeTab === 'admin' ? 'active' : ''}
                        onClick={() => setActiveTab('admin')}
                      >
                        <span role="img" aria-label="Admin icon" style={{ fontSize: '18px' }}>🛠️</span> Admin Panel
                      </button>
                    </li>
                  )}
                </ul>
              </nav>
            </header>
        
            <main className="app-main">
              {activeTab === 'recipes' ? (
                <>
                  <section className="form-section">
                    <RecipeForm 
                      recipe={editingRecipe}
                      onSubmit={handleSubmit}
                      onCancel={editingRecipe ? handleCancel : null}
                    />
                  </section>
                  
                  <section className="recipes-section">
                    <h2>My Recipes</h2>
                    
                    {error && <div className="error-message">{error}</div>}
                    
                    {loading ? (
                      <div className="loading">Loading recipes...</div>
                    ) : (
                      <RecipeList 
                        recipes={recipes}
                        onEdit={handleEdit}
                        onDelete={handleDeleteRecipe}
                      />
                    )}
                  </section>
                </>
              ) : activeTab === 'meal-plans' ? (
                <section className="meal-plans-section">
                  <MealPlanList />
                </section>
              ) : activeTab === 'admin' && currentUser?.is_admin ? (
                <section className="admin-section">
                  <AdminPanel />
                </section>
              ) : (
                <>
                  <section className="form-section">
                    <RecipeForm 
                      recipe={editingRecipe}
                      onSubmit={handleSubmit}
                      onCancel={editingRecipe ? handleCancel : null}
                    />
                  </section>
                  
                  <section className="recipes-section">
                    <h2>My Recipes</h2>
                    
                    {error && <div className="error-message">{error}</div>}
                    
                    {loading ? (
                      <div className="loading">Loading recipes...</div>
                    ) : (
                      <RecipeList 
                        recipes={recipes}
                        onEdit={handleEdit}
                        onDelete={handleDeleteRecipe}
                      />
                    )}
                  </section>
                </>
              )}
            </main>
            
            <footer className="app-footer">
              <p>&copy; {new Date().getFullYear()} Recipe Manager</p>
            </footer>
          </>
        ) : (
          <Auth onAuthenticated={handleAuthenticated} />
        )}
      </div>
    </ConfigProvider>
  );
}

export default App;

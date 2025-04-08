import axios from 'axios';

// Create API instance
const getBaseUrl = () => {
  // Check if we're running on Codio
  const hostname = window.location.hostname;
  
  if (hostname.includes('codio-box.uk') || hostname.includes('codio.io')) {
    // Handle Codio URL pattern like: peacehoney-lauraeric-3000.codio-box.uk
    // Extract the box name and backend port
    const frontendUrl = window.location.origin;
    
    // Replace the frontend port (3000) with backend port (3005)
    // This handles URLs like: 
    // https://peacehoney-lauraeric-3000.codio-box.uk/ → https://peacehoney-lauraeric-3005.codio-box.uk/
    const backendUrl = frontendUrl.replace('-3000', '-3005');
    
    return backendUrl;
  }
  
  // Local development
  return 'http://localhost:3005';
};

// Create axios instance
const api = axios.create({
  baseURL: `${getBaseUrl()}/api`,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Recipe API service
const RecipeService = {
  // Get all recipes
  getAllRecipes: async () => {
    try {
      const response = await api.get('/recipes');
      return response.data;
    } catch (error) {
      console.error('Error fetching recipes:', error);
      throw error;
    }
  },
  
  // Search recipes
  searchRecipes: async (query) => {
    try {
      const response = await api.get(`/recipes/search?query=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      console.error('Error searching recipes:', error);
      throw error;
    }
  },
  
  // Get recipes by category
  getRecipesByCategory: async (categoryId) => {
    try {
      const response = await api.get(`/recipes/category/${categoryId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching recipes for category ${categoryId}:`, error);
      throw error;
    }
  },

  // Get recipe by ID
  getRecipeById: async (id) => {
    try {
      const response = await api.get(`/recipes/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching recipe with ID ${id}:`, error);
      throw error;
    }
  },

  // Create a new recipe
  createRecipe: async (recipe) => {
    try {
      const response = await api.post('/recipes', recipe);
      return response.data;
    } catch (error) {
      console.error('Error creating recipe:', error);
      throw error;
    }
  },

  // Update a recipe
  updateRecipe: async (id, recipe) => {
    try {
      const response = await api.put(`/recipes/${id}`, recipe);
      return response.data;
    } catch (error) {
      console.error(`Error updating recipe with ID ${id}:`, error);
      throw error;
    }
  },

  // Delete a recipe
  deleteRecipe: async (id) => {
    try {
      await api.delete(`/recipes/${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting recipe with ID ${id}:`, error);
      throw error;
    }
  },
  
  // Rate a recipe
  rateRecipe: async (id, rating) => {
    try {
      const response = await api.post(`/recipes/${id}/rate`, { rating });
      return response.data;
    } catch (error) {
      console.error(`Error rating recipe with ID ${id}:`, error);
      throw error;
    }
  },
  
  // Get top rated recipes
  getTopRatedRecipes: async (limit = 5) => {
    try {
      const response = await api.get(`/recipes?sort=rating&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching top rated recipes:', error);
      throw error;
    }
  },
  
  // Get recently added recipes
  getRecentRecipes: async (limit = 5) => {
    try {
      const response = await api.get(`/recipes?sort=created&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching recent recipes:', error);
      throw error;
    }
  }
};

// Category API service
const CategoryService = {
  // Get all categories
  getAllCategories: async () => {
    try {
      const response = await api.get('/categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },
  
  // Get category by ID
  getCategoryById: async (id) => {
    try {
      const response = await api.get(`/categories/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching category with ID ${id}:`, error);
      throw error;
    }
  },
  
  // Create a new category
  createCategory: async (category) => {
    try {
      const response = await api.post('/categories', category);
      return response.data;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  },
  
  // Update a category
  updateCategory: async (id, category) => {
    try {
      const response = await api.put(`/categories/${id}`, category);
      return response.data;
    } catch (error) {
      console.error(`Error updating category with ID ${id}:`, error);
      throw error;
    }
  },
  
  // Delete a category
  deleteCategory: async (id) => {
    try {
      await api.delete(`/categories/${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting category with ID ${id}:`, error);
      throw error;
    }
  }
};

// Meal Plan API service
const MealPlanService = {
  // Get all meal plans
  getAllMealPlans: async () => {
    try {
      const response = await api.get('/meal-plans');
      return response.data;
    } catch (error) {
      console.error('Error fetching meal plans:', error);
      throw error;
    }
  },
  
  // Get meal plans by date range
  getMealPlansByDateRange: async (startDate, endDate) => {
    try {
      const response = await api.get(`/meal-plans/date-range?startDate=${startDate}&endDate=${endDate}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching meal plans by date range:', error);
      throw error;
    }
  },

  // Get meal plan by ID
  getMealPlanById: async (id) => {
    try {
      const response = await api.get(`/meal-plans/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching meal plan with ID ${id}:`, error);
      throw error;
    }
  },

  // Create a new meal plan
  createMealPlan: async (mealPlan) => {
    try {
      const response = await api.post('/meal-plans', mealPlan);
      return response.data;
    } catch (error) {
      console.error('Error creating meal plan:', error);
      throw error;
    }
  },

  // Update a meal plan
  updateMealPlan: async (id, mealPlan) => {
    try {
      const response = await api.put(`/meal-plans/${id}`, mealPlan);
      return response.data;
    } catch (error) {
      console.error(`Error updating meal plan with ID ${id}:`, error);
      throw error;
    }
  },

  // Delete a meal plan
  deleteMealPlan: async (id) => {
    try {
      const response = await api.delete(`/meal-plans/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting meal plan with ID ${id}:`, error);
      throw error;
    }
  }
};

// Auth API service
const AuthService = {
  // Register a new user
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      console.log('Registration response:', response);
      // Store token in localStorage
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      console.log('Login response:', response);
      // Store token in localStorage
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Get all users (admin only)
  getAllUsers: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }
      
      // Set authorization header
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      const response = await api.get('/auth/users');
      return response.data;
    } catch (error) {
      console.error('Error getting all users:', error);
      throw error;
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return null;
      }
      
      // Set authorization header
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      const response = await api.get('/auth/me');
      console.log('Get current user response:', response);
      return response.data;
    } catch (error) {
      console.error('Error getting current user:', error);
      // If token is invalid, logout
      if (error.response && error.response.status === 401) {
        AuthService.logout();
      }
      throw error;
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Get auth token
  getToken: () => {
    return localStorage.getItem('token');
  }
};

// Add authorization header to all requests if token exists
api.interceptors.request.use(
  (config) => {
    const token = AuthService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export { RecipeService, CategoryService, MealPlanService, AuthService };

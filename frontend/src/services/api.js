import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor for JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle 401 Unauthorized errors
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      return Promise.reject(error.response.data);
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const register = (userData) => api.post('/auth/register', userData);
export const login = (credentials) => api.post('/auth/login', credentials);
export const getCurrentUser = () => api.get('/auth/me');

// Recipe endpoints
export const getRecipes = () => api.get('/recipes');
export const getRecipe = (id) => api.get(`/recipes/${id}`);
export const createRecipe = (recipeData) => api.post('/recipes', recipeData);
export const updateRecipe = (id, recipeData) => api.put(`/recipes/${id}`, recipeData);
export const deleteRecipe = (id) => api.delete(`/recipes/${id}`);
export const searchRecipes = (query) => api.get(`/recipes/search?query=${query}`);
export const getRecipesByCategory = (categoryId) => api.get(`/recipes/category/${categoryId}`);
export const rateRecipe = (id, rating) => api.post(`/recipes/${id}/rate`, { rating });

// Category endpoints
export const getCategories = () => api.get('/categories');
export const getCategory = (id) => api.get(`/categories/${id}`);
export const createCategory = (categoryData) => api.post('/categories', categoryData);
export const updateCategory = (id, categoryData) => api.put(`/categories/${id}`, categoryData);
export const deleteCategory = (id) => api.delete(`/categories/${id}`);

// Meal plan endpoints
export const getMealPlans = () => api.get('/meal-plans');
export const getMealPlan = (id) => api.get(`/meal-plans/${id}`);
export const createMealPlan = (mealPlanData) => api.post('/meal-plans', mealPlanData);
export const updateMealPlan = (id, mealPlanData) => api.put(`/meal-plans/${id}`, mealPlanData);
export const deleteMealPlan = (id) => api.delete(`/meal-plans/${id}`);
export const getMealPlansByDateRange = (startDate, endDate) => 
  api.get(`/meal-plans/date-range?startDate=${startDate}&endDate=${endDate}`);

export default api;
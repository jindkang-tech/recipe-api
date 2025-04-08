import React, { useState, useEffect } from 'react';
import { CategoryService } from '../services/api';
import './styles.css';

const CategoryList = ({ onSelectCategory }) => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await CategoryService.getAllCategories();
      setCategories(data);
      setError(null);
    } catch (err) {
      setError('Failed to load categories');
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    try {
      await CategoryService.createCategory({ name: newCategory });
      setNewCategory('');
      fetchCategories();
    } catch (err) {
      setError('Failed to add category');
      console.error('Error adding category:', err);
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await CategoryService.deleteCategory(id);
      fetchCategories();
    } catch (err) {
      setError('Failed to delete category');
      console.error('Error deleting category:', err);
    }
  };

  if (loading) return <div>Loading categories...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="category-list">
      <h2>Categories</h2>
      <ul>
        <li key="all" className="category-item">
          <button onClick={() => onSelectCategory(null)}>All Recipes</button>
        </li>
        {categories.map(category => (
          <li key={category.id} className="category-item">
            <button onClick={() => onSelectCategory(category.id)}>
              {category.name}
            </button>
            <button 
              className="delete-btn"
              onClick={() => handleDeleteCategory(category.id)}
            >
              ×
            </button>
          </li>
        ))}
      </ul>
      
      <form onSubmit={handleAddCategory} className="add-category-form">
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="New category name"
          required
        />
        <button type="submit">Add</button>
      </form>
    </div>
  );
};

export default CategoryList;

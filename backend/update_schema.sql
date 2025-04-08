-- Alter the recipes table to add the missing columns
ALTER TABLE recipes
ADD COLUMN category_id INT NULL,
ADD COLUMN cooking_time INT NULL,
ADD COLUMN difficulty ENUM('easy', 'medium', 'hard') NULL,
ADD COLUMN calories INT NULL,
ADD COLUMN protein DECIMAL(5,2) NULL,
ADD COLUMN carbs DECIMAL(5,2) NULL,
ADD COLUMN fat DECIMAL(5,2) NULL,
ADD COLUMN rating DECIMAL(3,2) DEFAULT 0;

-- Create categories table if it doesn't exist
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add foreign key constraint
ALTER TABLE recipes
ADD CONSTRAINT fk_category
FOREIGN KEY (category_id) REFERENCES categories(id)
ON DELETE SET NULL;

-- Insert some sample categories
INSERT INTO categories (name) VALUES
('Breakfast'),
('Lunch'),
('Dinner'),
('Dessert'),
('Snack'),
('Vegetarian'),
('Vegan');

-- Create users table for authentication
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create meal plans table
CREATE TABLE IF NOT EXISTS meal_plans (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  recipe_id INT NOT NULL,
  meal_date DATE NOT NULL,
  meal_type ENUM('breakfast', 'lunch', 'dinner', 'snack') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

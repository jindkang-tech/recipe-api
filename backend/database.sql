-- Create the database
CREATE DATABASE IF NOT EXISTS recipe_db;
USE recipe_db;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  is_admin TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create recipes table
CREATE TABLE IF NOT EXISTS recipes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  ingredients TEXT NOT NULL,
  instructions TEXT NOT NULL,
  category_id INT,
  user_id INT,
  image_url VARCHAR(255),
  prep_time INT,
  cook_time INT,
  servings INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create recipe ratings table
CREATE TABLE IF NOT EXISTS recipe_ratings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  recipe_id INT NOT NULL,
  user_id INT NOT NULL,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_rating (recipe_id, user_id)
);

-- Create meal plans table
CREATE TABLE IF NOT EXISTS meal_plans (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  date DATE NOT NULL,
  meal_type ENUM('breakfast', 'lunch', 'dinner', 'snack') NOT NULL,
  recipe_id INT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE SET NULL
);

-- Insert default admin user (username: admin, password: admin123)
INSERT INTO users (username, email, password, is_admin) VALUES
('jind', 'admin@gmail.com', '$2a$10$3YX0fMxMDTbYBw0.3kp7zedpRPcTZWPfRzqwA3ORSK5tLN2I5N362', 1);

-- Insert some sample categories
INSERT INTO categories (name, description) VALUES
('Breakfast', 'Morning meals to start your day'),
('Lunch', 'Midday meals'),
('Dinner', 'Evening meals'),
('Dessert', 'Sweet treats'),
('Vegetarian', 'Meat-free recipes');

-- Insert some sample recipes
INSERT INTO recipes (title, ingredients, instructions, category_id, user_id) VALUES
('Chocolate Chip Cookies', 'Flour, sugar, butter, chocolate chips, eggs, vanilla extract, baking soda, salt', 'Mix ingredients, form into balls, bake at 350°F for 10-12 minutes.', 4, 1),
('Spaghetti Carbonara', 'Spaghetti, eggs, bacon, parmesan cheese, black pepper, salt', 'Cook pasta, fry bacon, mix eggs and cheese, combine all ingredients.', 3, 1),
('Chicken Stir Fry', 'Chicken breast, bell peppers, broccoli, soy sauce, garlic, ginger, vegetable oil', 'Cut chicken and vegetables, stir fry with garlic and ginger, add soy sauce.', 3, 1),
('Vegetarian Lasagna', 'Lasagna noodles, tomato sauce, ricotta cheese, spinach, zucchini, mozzarella, garlic, basil', 'Layer ingredients in baking dish, bake at 375°F for 45 minutes.', 5, 1),
('Banana Pancakes', 'Flour, milk, eggs, banana, baking powder, sugar, salt, butter', 'Mix ingredients, cook on griddle until golden brown.', 1, 1);

-- Insert sample ratings
INSERT INTO recipe_ratings (recipe_id, user_id, rating, comment) VALUES
(1, 1, 5, 'Delicious cookies! My family loved them.'),
(2, 1, 4, 'Great recipe, I added extra cheese.'),
(3, 1, 5, 'Quick and tasty weeknight dinner.');

-- Insert sample meal plans
INSERT INTO meal_plans (user_id, date, meal_type, recipe_id, notes) VALUES
(1, '2025-04-09', 'breakfast', 5, 'Add berries on top'),
(1, '2025-04-09', 'dinner', 2, 'Make extra for lunch tomorrow'),
(1, '2025-04-10', 'dinner', 3, 'Use chicken from freezer');

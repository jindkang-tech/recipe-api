const mysql = require('mysql2/promise');

const recipes = [
  // Breakfast recipes
  {
    title: 'Classic Pancakes',
    description: 'Fluffy and delicious breakfast pancakes',
    ingredients: JSON.stringify([
      '2 cups all-purpose flour',
      '2 1/4 cups milk',
      '2 eggs',
      '1/4 cup sugar',
      '2 tsp baking powder',
      '1/2 tsp salt',
      '2 tbsp melted butter'
    ]),
    instructions: JSON.stringify([
      'Mix dry ingredients',
      'Whisk wet ingredients separately',
      'Combine and mix until just blended',
      'Cook on hot griddle until bubbles form',
      'Flip and cook other side'
    ]),
    category_id: 1,
    user_id: 2
  },
  {
    title: 'Eggs Benedict',
    description: 'Traditional breakfast with hollandaise sauce',
    ingredients: JSON.stringify([
      '4 English muffins',
      '8 eggs',
      '8 slices Canadian bacon',
      'Hollandaise sauce',
      'Fresh chives'
    ]),
    instructions: JSON.stringify([
      'Toast English muffins',
      'Cook Canadian bacon',
      'Poach eggs',
      'Make hollandaise sauce',
      'Assemble and garnish'
    ]),
    category_id: 1,
    user_id: 2
  },
  // Lunch recipes
  {
    title: 'Chicken Caesar Salad',
    description: 'Classic lunch salad',
    ingredients: JSON.stringify([
      'Romaine lettuce',
      'Grilled chicken breast',
      'Croutons',
      'Parmesan cheese',
      'Caesar dressing'
    ]),
    instructions: JSON.stringify([
      'Grill chicken and slice',
      'Chop lettuce',
      'Toss with dressing',
      'Add croutons and cheese'
    ]),
    category_id: 2,
    user_id: 2
  },
  {
    title: 'Turkey Club Sandwich',
    description: 'Triple-decker sandwich',
    ingredients: JSON.stringify([
      '12 slices bread',
      '1 lb turkey',
      '12 slices bacon',
      'Lettuce',
      'Tomato',
      'Mayo'
    ]),
    instructions: JSON.stringify([
      'Toast bread',
      'Cook bacon',
      'Layer ingredients',
      'Cut diagonally'
    ]),
    category_id: 2,
    user_id: 2
  },
  // Dinner recipes
  {
    title: 'Spaghetti Bolognese',
    description: 'Classic Italian pasta dish',
    ingredients: JSON.stringify([
      '1 lb spaghetti',
      '1 lb ground beef',
      'Tomato sauce',
      'Onion',
      'Garlic',
      'Italian herbs'
    ]),
    instructions: JSON.stringify([
      'Cook pasta',
      'Make meat sauce',
      'Combine and serve'
    ]),
    category_id: 3,
    user_id: 2
  },
  {
    title: 'Grilled Salmon',
    description: 'Healthy dinner option',
    ingredients: JSON.stringify([
      '4 salmon fillets',
      'Lemon',
      'Olive oil',
      'Herbs',
      'Salt and pepper'
    ]),
    instructions: JSON.stringify([
      'Season salmon',
      'Grill until done',
      'Serve with lemon'
    ]),
    category_id: 3,
    user_id: 2
  },
  // Dessert recipes
  {
    title: 'Chocolate Cake',
    description: 'Rich chocolate dessert',
    ingredients: JSON.stringify([
      'Flour',
      'Cocoa powder',
      'Sugar',
      'Eggs',
      'Milk',
      'Butter'
    ]),
    instructions: JSON.stringify([
      'Mix dry ingredients',
      'Add wet ingredients',
      'Bake',
      'Frost'
    ]),
    category_id: 4,
    user_id: 2
  },
  {
    title: 'Apple Pie',
    description: 'Classic American dessert',
    ingredients: JSON.stringify([
      'Pie crust',
      '6 apples',
      'Sugar',
      'Cinnamon',
      'Butter'
    ]),
    instructions: JSON.stringify([
      'Make crust',
      'Prepare filling',
      'Assemble and bake'
    ]),
    category_id: 4,
    user_id: 2
  }
];

async function addRecipes() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'JindKang',
    database: 'recipe_db'
  });

  try {
    for (const recipe of recipes) {
      await connection.execute(
        'INSERT INTO recipes (title, description, ingredients, instructions, category_id, user_id) VALUES (?, ?, ?, ?, ?, ?)',
        [recipe.title, recipe.description, recipe.ingredients, recipe.instructions, recipe.category_id, recipe.user_id]
      );
      console.log(`Added recipe: ${recipe.title}`);
    }
    console.log('All recipes added successfully!');
  } catch (error) {
    console.error('Error adding recipes:', error);
  } finally {
    await connection.end();
  }
}

addRecipes();

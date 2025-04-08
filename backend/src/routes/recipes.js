const Router = require('koa-router');
const RecipeController = require('../controllers/recipeController');
const { verifyToken } = require('../middleware/auth');

const router = new Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Recipe:
 *       type: object
 *       required:
 *         - title
 *         - ingredients
 *         - instructions
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the recipe
 *         title:
 *           type: string
 *           description: The title of the recipe
 *         ingredients:
 *           type: array
 *           items:
 *             type: string
 *           description: List of ingredients
 *         instructions:
 *           type: array
 *           items:
 *             type: string
 *           description: List of cooking instructions
 *         category_id:
 *           type: integer
 *           description: The category ID this recipe belongs to
 *         rating:
 *           type: number
 *           format: float
 *           minimum: 0
 *           maximum: 5
 *           description: The recipe's rating (0-5 stars)
 *         cooking_time:
 *           type: integer
 *           description: Cooking time in minutes
 *         difficulty:
 *           type: string
 *           enum: [easy, medium, hard]
 *           description: Recipe difficulty level
 *         calories:
 *           type: integer
 *           description: Calories per serving
 *         protein:
 *           type: number
 *           description: Protein content in grams
 *         carbs:
 *           type: number
 *           description: Carbohydrate content in grams
 *         fat:
 *           type: number
 *           description: Fat content in grams
 */

/**
 * @swagger
 * /recipes:
 *   get:
 *     summary: Get all recipes
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of recipes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Recipe'
 */
router.get('/recipes', RecipeController.getAll);

/**
 * @swagger
 * /recipes/search:
 *   get:
 *     summary: Search recipes
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         required: true
 *         description: Search term
 *     responses:
 *       200:
 *         description: List of matching recipes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Recipe'
 */
router.get('/recipes/search', RecipeController.search);

/**
 * @swagger
 * /recipes/category/{categoryId}:
 *   get:
 *     summary: Get recipes by category
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Category ID
 *     responses:
 *       200:
 *         description: List of recipes in category
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Recipe'
 */
router.get('/recipes/category/:categoryId', RecipeController.getByCategory);

/**
 * @swagger
 * /recipes/{id}:
 *   get:
 *     summary: Get recipe by ID
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Recipe ID
 *     responses:
 *       200:
 *         description: Recipe details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Recipe'
 *       404:
 *         description: Recipe not found
 */
router.get('/recipes/:id', RecipeController.getById);

/**
 * @swagger
 * /recipes:
 *   post:
 *     summary: Create a new recipe
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Recipe'
 *     responses:
 *       201:
 *         description: Created recipe
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Recipe'
 *       400:
 *         description: Invalid input
 */
router.post('/recipes', verifyToken, RecipeController.create);

/**
 * @swagger
 * /recipes/{id}:
 *   put:
 *     summary: Update a recipe
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Recipe ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Recipe'
 *     responses:
 *       200:
 *         description: Updated recipe
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Recipe'
 *       404:
 *         description: Recipe not found
 */
router.put('/recipes/:id', verifyToken, RecipeController.update);

/**
 * @swagger
 * /recipes/{id}/rate:
 *   post:
 *     summary: Rate a recipe
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Recipe ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rating
 *             properties:
 *               rating:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 5
 *                 description: Rating value (0-5)
 *     responses:
 *       200:
 *         description: Updated rating
 *       400:
 *         description: Invalid rating value
 *       404:
 *         description: Recipe not found
 */
router.post('/recipes/:id/rate', verifyToken, RecipeController.rateRecipe);

/**
 * @swagger
 * /recipes/{id}:
 *   delete:
 *     summary: Delete a recipe
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Recipe ID
 *     responses:
 *       204:
 *         description: Recipe deleted
 *       404:
 *         description: Recipe not found
 */
router.delete('/recipes/:id', verifyToken, RecipeController.delete);

module.exports = router;

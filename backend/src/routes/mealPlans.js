const Router = require('koa-router');
const MealPlanController = require('../controllers/mealPlanController');
const { verifyToken } = require('../middleware/auth');

const router = new Router();

// Meal plan routes
router.get('/meal-plans', verifyToken, MealPlanController.getAll);
router.get('/meal-plans/date-range', verifyToken, MealPlanController.getByDateRange);
router.get('/meal-plans/:id', verifyToken, MealPlanController.getById);
router.post('/meal-plans', verifyToken, MealPlanController.create);
router.put('/meal-plans/:id', verifyToken, MealPlanController.update);
router.delete('/meal-plans/:id', verifyToken, MealPlanController.delete);

module.exports = router;

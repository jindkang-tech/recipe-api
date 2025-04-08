const Router = require('koa-router');
const CategoryController = require('../controllers/categoryController');

const router = new Router();

// Category routes
router.get('/categories', CategoryController.getAll);
router.get('/categories/:id', CategoryController.getById);
router.post('/categories', CategoryController.create);
router.put('/categories/:id', CategoryController.update);
router.delete('/categories/:id', CategoryController.delete);

module.exports = router;

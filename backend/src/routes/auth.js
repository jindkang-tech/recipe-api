const Router = require('koa-router');
const AuthController = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');

const router = new Router();

// Auth routes
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.get('/me', verifyToken, AuthController.getCurrentUser);
router.get('/users', verifyToken, AuthController.getAllUsers);

module.exports = router;

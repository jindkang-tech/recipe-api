const Koa = require('koa');
const Router = require('@koa/router');
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');
const serve = require('koa-static');
const mount = require('koa-mount');
const path = require('path');

const app = new Koa();
const router = new Router();

// Enable CORS
app.use(cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
  maxAge: 5,
  credentials: true,
}));

// Body parser
app.use(bodyParser());

// Routes
const authRoutes = require('./routes/authRoutes');
const recipeRoutes = require('./routes/recipeRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const mealPlanRoutes = require('./routes/mealPlanRoutes');

// Use routes
app.use(authRoutes.routes());
app.use(recipeRoutes.routes());
app.use(categoryRoutes.routes());
app.use(mealPlanRoutes.routes());

// Error handling
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = {
      error: err.message || 'Internal Server Error'
    };
    ctx.app.emit('error', err, ctx);
  }
});

// Start server
const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('API documentation available at http://localhost:${PORT}/api-docs');
  console.log('API endpoints:');
  console.log('Recipe endpoints:');
  console.log('GET    /api/recipes');
  console.log('GET    /api/recipes/search?query=<searchterm>');
  console.log('GET    /api/recipes/category/:categoryId');
  console.log('GET    /api/recipes/:id');
  console.log('POST   /api/recipes');
  console.log('PUT    /api/recipes/:id');
  console.log('POST   /api/recipes/:id/rate');
  console.log('DELETE /api/recipes/:id');
  console.log('');
  console.log('Category endpoints:');
  console.log('GET    /api/categories');
  console.log('GET    /api/categories/:id');
  console.log('POST   /api/categories');
  console.log('PUT    /api/categories/:id');
  console.log('DELETE /api/categories/:id');
  console.log('');
  console.log('Meal Plan endpoints:');
  console.log('GET    /api/meal-plans');
  console.log('GET    /api/meal-plans/date-range?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD');
  console.log('GET    /api/meal-plans/:id');
  console.log('POST   /api/meal-plans');
  console.log('PUT    /api/meal-plans/:id');
  console.log('DELETE /api/meal-plans/:id');
  console.log('');
  console.log('Authentication endpoints:');
  console.log('POST   /api/auth/register');
  console.log('POST   /api/auth/login');
  console.log('GET    /api/auth/me');
});

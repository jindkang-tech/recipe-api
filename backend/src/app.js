const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const cors = require('koa-cors');
const swaggerJsdoc = require('swagger-jsdoc');
const { koaSwagger } = require('koa2-swagger-ui');
const swaggerSpec = require('./config/swagger');
const recipeRoutes = require('./routes/recipes');
const categoryRoutes = require('./routes/categories');
const mealPlanRoutes = require('./routes/mealPlans');
const authRoutes = require('./routes/auth');

// Initialize Koa app
const app = new Koa();

// Middleware
app.use(bodyParser());
app.use(cors({
  origin: function(ctx) {
    // Check if ctx and ctx.request exist before accessing headers
    if (!ctx || !ctx.request) {
      return '*'; // Fallback to allow all origins if ctx or ctx.request is undefined
    }

    const allowedOrigins = [
      'http://localhost:3000',                         // Local development
      /^https:\/\/.*\.codio-box\.uk$/,                 // Codio box URLs
      /^https:\/\/.*\.codio\.io$/                      // Alternative Codio domain
    ];
    
    const origin = ctx.request.headers ? ctx.request.headers.origin : null;
    if (!origin) return '*';
    
    // Check if origin matches any of the allowed patterns
    for (const allowedOrigin of allowedOrigins) {
      if (typeof allowedOrigin === 'string') {
        if (allowedOrigin === origin) return origin;
      } else if (allowedOrigin instanceof RegExp) {
        if (allowedOrigin.test(origin)) return origin;
      }
    }
    
    return '*'; // Fallback to allow all origins if none match
  },
  credentials: true,
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE']
}));

// Request logging middleware
app.use(async (ctx, next) => {
  const start = Date.now();
  console.log(`[${new Date().toISOString()}] ${ctx.method} ${ctx.url} - Request received`);
  
  if (ctx.request.body && Object.keys(ctx.request.body).length > 0) {
    console.log('Request body:', JSON.stringify(ctx.request.body, null, 2));
  }
  
  await next();
  
  const ms = Date.now() - start;
  console.log(`[${new Date().toISOString()}] ${ctx.method} ${ctx.url} - Response sent (${ctx.status}) - ${ms}ms`);
});

// Error handling middleware
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    console.error('Server error:', err);
    ctx.status = err.status || 500;
    ctx.body = {
      error: err.message || 'Internal Server Error'
    };
  }
});

// Serve Swagger documentation
app.use(
  koaSwagger({
    routePrefix: '/api-docs',
    swaggerOptions: {
      spec: swaggerSpec
    }
  })
);

// Routes
const router = new Router();
router.use('/api/auth', authRoutes.routes(), authRoutes.allowedMethods());
router.use('/api', recipeRoutes.routes(), recipeRoutes.allowedMethods());
router.use('/api', categoryRoutes.routes(), categoryRoutes.allowedMethods());
router.use('/api', mealPlanRoutes.routes(), mealPlanRoutes.allowedMethods());
app.use(router.routes());
app.use(router.allowedMethods());

// Start server
const port = process.env.PORT || 3005;
const host = process.env.HOST || '0.0.0.0';
app.listen(port, host, () => {
  console.log(`Server running on http://${host}:${port}`);
  console.log(`API documentation available at http://${host}:${port}/api-docs`);
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
  
  console.log('\nCategory endpoints:');
  console.log('GET    /api/categories');
  console.log('GET    /api/categories/:id');
  console.log('POST   /api/categories');
  console.log('PUT    /api/categories/:id');
  console.log('DELETE /api/categories/:id');
  
  console.log('\nMeal Plan endpoints:');
  console.log('GET    /api/meal-plans');
  console.log('GET    /api/meal-plans/date-range?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD');
  console.log('GET    /api/meal-plans/:id');
  console.log('POST   /api/meal-plans');
  console.log('PUT    /api/meal-plans/:id');
  console.log('DELETE /api/meal-plans/:id');
  
  console.log('\nAuthentication endpoints:');
  console.log('POST   /api/auth/register');
  console.log('POST   /api/auth/login');
  console.log('GET    /api/auth/me');
  console.log('GET    /api/auth/users');
});

module.exports = app;

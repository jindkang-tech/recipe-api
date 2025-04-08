const jwt = require('jsonwebtoken');

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, username: user.username },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// Verify JWT token middleware
const verifyToken = async (ctx, next) => {
  try {
    // Get the token from the Authorization header
    const authHeader = ctx.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      ctx.status = 401;
      ctx.body = { error: 'Access denied. No token provided.' };
      return;
    }
    
    const token = authHeader.split(' ')[1];
    
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      ctx.state.user = decoded;
      await next();
    } catch (error) {
      ctx.status = 401;
      ctx.body = { error: 'Invalid token.' };
    }
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: 'Authentication error.' };
  }
};

module.exports = {
  generateToken,
  verifyToken,
  JWT_SECRET
};

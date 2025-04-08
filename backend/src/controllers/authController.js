const User = require('../models/user');
const { generateToken } = require('../middleware/auth');

class AuthController {
  // Register a new user
  static async register(ctx) {
    try {
      const userData = ctx.request.body;
      
      // Validate input
      if (!userData.username || !userData.email || !userData.password) {
        ctx.status = 400;
        ctx.body = { error: 'Username, email, and password are required' };
        return;
      }
      
      // Check if username already exists
      const existingUsername = await User.getByUsername(userData.username);
      if (existingUsername) {
        ctx.status = 400;
        ctx.body = { error: 'Username already exists' };
        return;
      }
      
      // Check if email already exists
      const existingEmail = await User.getByEmail(userData.email);
      if (existingEmail) {
        ctx.status = 400;
        ctx.body = { error: 'Email already exists' };
        return;
      }
      
      // Create user
      const newUser = await User.create(userData);
      
      // Generate token
      const token = generateToken(newUser);
      
      ctx.status = 201;
      ctx.body = {
        message: 'User registered successfully',
        user: newUser,
        token
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { error: 'Failed to register user' };
    }
  }

  // Login user
  static async login(ctx) {
    try {
      const { username, password } = ctx.request.body;
      
      // Validate input
      if (!username || !password) {
        ctx.status = 400;
        ctx.body = { error: 'Username and password are required' };
        return;
      }
      
      // Validate credentials
      const user = await User.validateCredentials(username, password);
      
      if (!user) {
        ctx.status = 401;
        ctx.body = { error: 'Invalid username or password' };
        return;
      }
      
      // Generate token
      const token = generateToken(user);
      
      ctx.body = {
        message: 'Login successful',
        user,
        token
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { error: 'Failed to login' };
    }
  }

  // Get current user
  static async getCurrentUser(ctx) {
    try {
      const userId = ctx.state.user.id;
      const user = await User.getById(userId);
      
      if (!user) {
        ctx.status = 404;
        ctx.body = { error: 'User not found' };
        return;
      }
      
      ctx.status = 200;
      ctx.body = user;
    } catch (error) {
      ctx.status = 500;
      ctx.body = { error: 'Failed to get user information' };
    }
  }

  // Get all users (admin only)
  static async getAllUsers(ctx) {
    try {
      console.log('getAllUsers method called');
      
      // Check if user is admin
      const userId = ctx.state.user.id;
      console.log('User ID from token:', userId);
      
      const user = await User.getById(userId);
      console.log('User details:', user);
      
      if (!user || !user.is_admin) {
        console.log('User is not admin, access denied');
        ctx.status = 403;
        ctx.body = { error: 'Unauthorized: Admin access required' };
        return;
      }
      
      console.log('User is admin, fetching all users');
      const users = await User.getAll();
      console.log('Users fetched:', users.length);
      
      ctx.status = 200;
      ctx.body = users;
    } catch (error) {
      console.error('Error fetching all users:', error);
      ctx.status = 500;
      ctx.body = { error: 'Failed to get users' };
    }
  }
}

module.exports = AuthController;

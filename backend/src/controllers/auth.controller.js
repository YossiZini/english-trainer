const AuthService = require('../services/auth.service');

class AuthController {
  /**
   * Register a new user
   * POST /api/auth/register
   */
  static async register(req, res) {
    try {
      const { name, email, password, age, studentName } = req.body;

      const result = await AuthService.register({ name, email, password, age, studentName });

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: result
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Registration failed'
      });
    }
  }

  /**
   * Login user
   * POST /api/auth/login
   */
  static async login(req, res) {
    try {
      const { identifier, password } = req.body;

      const result = await AuthService.login({ identifier, password });

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(401).json({
        success: false,
        message: error.message || 'Login failed'
      });
    }
  }

  /**
   * Get current user
   * GET /api/auth/me
   */
  static async getCurrentUser(req, res) {
    try {
      const user = await AuthService.getCurrentUser(req.userId);

      res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      console.error('Get current user error:', error);
      res.status(404).json({
        success: false,
        message: error.message || 'User not found'
      });
    }
  }

  /**
   * Logout user
   * POST /api/auth/logout
   */
  static async logout(req, res) {
    try {
      // For JWT, logout is handled client-side by removing the token
      // We just return success here
      res.status(200).json({
        success: true,
        message: 'Logged out successfully'
      });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({
        success: false,
        message: 'Logout failed'
      });
    }
  }
}

module.exports = AuthController;

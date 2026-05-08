import AuthService from '../services/AuthService.js';

export default class AuthController {
  constructor() {
    this.authService = new AuthService();
  }

  register = (req, res, next) => {
    try {
      const user = this.authService.register(req.body);
      res.status(201).json({ success: true, data: user, message: 'Registered successfully' });
    } catch (error) {
      next(error);
    }
  };

  login = (req, res, next) => {
    try {
      const data = this.authService.login(req.body);
      res.json({ success: true, data, message: 'Login successful' });
    } catch (error) {
      next(error);
    }
  };

  profile = (req, res, next) => {
    try {
      const data = this.authService.getProfile(req.user.userID);
      res.json({ success: true, data, message: 'Profile fetched successfully' });
    } catch (error) {
      next(error);
    }
  };

  updateProfile = (req, res, next) => {
    try {
      const data = this.authService.updateProfile(req.user.userID, req.body);
      res.json({ success: true, data, message: 'Profile updated successfully' });
    } catch (error) {
      next(error);
    }
  };

  updatePassword = (req, res, next) => {
    try {
      this.authService.updatePassword(req.user.userID, req.body);
      res.json({ success: true, data: true, message: 'Password updated successfully' });
    } catch (error) {
      next(error);
    }
  };
}

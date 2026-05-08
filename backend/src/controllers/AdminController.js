import AdminService from '../services/AdminService.js';

export default class AdminController {
  constructor() {
    this.adminService = new AdminService();
  }

  getDashboardSummary = (req, res, next) => {
    try {
      const data = this.adminService.getDashboardSummary();
      res.json({ success: true, data, message: 'Dashboard summary fetched successfully' });
    } catch (error) {
      next(error);
    }
  };
}

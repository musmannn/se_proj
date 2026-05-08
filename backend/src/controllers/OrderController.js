import OrderService from '../services/OrderService.js';

export default class OrderController {
  constructor() {
    this.orderService = new OrderService();
  }

  checkout = (req, res, next) => {
    try {
      const data = this.orderService.checkout(req.user.userID, req.body);
      res.status(201).json({ success: true, data, message: 'Checkout completed successfully' });
    } catch (error) {
      next(error);
    }
  };

  getOwnOrders = (req, res, next) => {
    try {
      const data = this.orderService.getOwnOrders(req.user.userID);
      res.json({ success: true, data, message: 'Orders fetched successfully' });
    } catch (error) {
      next(error);
    }
  };

  getOrderById = (req, res, next) => {
    try {
      const data = this.orderService.getOrderDetail(Number(req.params.id), req.user);
      res.json({ success: true, data, message: 'Order detail fetched successfully' });
    } catch (error) {
      next(error);
    }
  };

  cancelOwnOrder = (req, res, next) => {
    try {
      const data = this.orderService.cancelOwnOrder(Number(req.params.id), req.user.userID);
      res.json({ success: true, data, message: 'Order cancelled successfully' });
    } catch (error) {
      next(error);
    }
  };

  getAllOrders = (req, res, next) => {
    try {
      const data = this.orderService.getAllOrders();
      res.json({ success: true, data, message: 'All orders fetched successfully' });
    } catch (error) {
      next(error);
    }
  };

  updateOrderStatus = (req, res, next) => {
    try {
      const data = this.orderService.updateOrderStatus(Number(req.params.id), req.body.status);
      res.json({ success: true, data, message: 'Order status updated successfully' });
    } catch (error) {
      next(error);
    }
  };
}

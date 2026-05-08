import CartService from '../services/CartService.js';

export default class CartController {
  constructor() {
    this.cartService = new CartService();
  }

  getCart = (req, res, next) => {
    try {
      const data = this.cartService.getCart(req.user.userID);
      res.json({ success: true, data, message: 'Cart fetched successfully' });
    } catch (error) {
      next(error);
    }
  };

  addItem = (req, res, next) => {
    try {
      const data = this.cartService.addCartItem(req.user.userID, req.body);
      res.status(201).json({ success: true, data, message: 'Item added to cart' });
    } catch (error) {
      next(error);
    }
  };

  updateItem = (req, res, next) => {
    try {
      const data = this.cartService.updateCartItem(req.user.userID, Number(req.params.cartItemId), req.body);
      res.json({ success: true, data, message: 'Cart item updated' });
    } catch (error) {
      next(error);
    }
  };

  removeItem = (req, res, next) => {
    try {
      const data = this.cartService.removeCartItem(req.user.userID, Number(req.params.cartItemId));
      res.json({ success: true, data, message: 'Cart item removed' });
    } catch (error) {
      next(error);
    }
  };
}

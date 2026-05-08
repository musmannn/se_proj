import CartService from '../services/CartService.js';

export default class CartController {
  constructor() {
    this.cartService = new CartService();
  }

  getCart = async (req, res, next) => {
    try {
      const data = await this.cartService.getCart(req.user.userID);
      res.json({ success: true, data, message: 'Cart fetched successfully' });
    } catch (error) {
      next(error);
    }
  };

  addItem = async (req, res, next) => {
    try {
      const data = await this.cartService.addCartItem(req.user.userID, req.body);
      res.status(201).json({ success: true, data, message: 'Item added to cart' });
    } catch (error) {
      next(error);
    }
  };

  updateItem = async (req, res, next) => {
    try {
      const data = await this.cartService.updateCartItem(req.user.userID, Number(req.params.cartItemId), req.body);
      res.json({ success: true, data, message: 'Cart item updated' });
    } catch (error) {
      next(error);
    }
  };

  removeItem = async (req, res, next) => {
    try {
      const data = await this.cartService.removeCartItem(req.user.userID, Number(req.params.cartItemId));
      res.json({ success: true, data, message: 'Cart item removed' });
    } catch (error) {
      next(error);
    }
  };
}

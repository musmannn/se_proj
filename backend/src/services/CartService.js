import CartRepository from '../repositories/CartRepository.js';
import CartItemRepository from '../repositories/CartItemRepository.js';
import InventoryRepository from '../repositories/InventoryRepository.js';
import ProductRepository from '../repositories/ProductRepository.js';

export default class CartService {
  constructor() {
    this.cartRepository = new CartRepository();
    this.cartItemRepository = new CartItemRepository();
    this.inventoryRepository = new InventoryRepository();
    this.productRepository = new ProductRepository();
  }

  async getCart(userID) {
    return this.cartRepository.getCartWithItemsByUserId(userID);
  }

  async addCartItem(userID, payload) {
    const cart = await this.cartRepository.getByUserId(userID);
    const product = await this.productRepository.getById(payload.productId);
    if (!product || product.status === 'discontinued') {
      throw new Error('Product not available');
    }

    const inventoryRows = await this.inventoryRepository.getByProductId(payload.productId);
    const stockRow = inventoryRows.find((row) => row.size === payload.size);
    if (!stockRow) {
      throw new Error('Invalid size selection');
    }
    if (Number(payload.quantity) <= 0) {
      throw new Error('Quantity must be at least 1');
    }
    if (Number(payload.quantity) > stockRow.stockQty) {
      throw new Error('Requested quantity exceeds stock');
    }

    await this.cartItemRepository.create({
      cartID: cart.cartID,
      productID: Number(payload.productId),
      quantity: Number(payload.quantity),
      size: payload.size
    });

    return this.getCart(userID);
  }

  async updateCartItem(userID, cartItemId, payload) {
    const cart = await this.cartRepository.getByUserId(userID);
    const cartItem = await this.cartItemRepository.getById(cartItemId);
    if (!cartItem || cartItem.cartID !== cart.cartID) {
      throw new Error('Cart item not found');
    }

    const inventoryRows = await this.inventoryRepository.getByProductId(cartItem.productID);
    const stockRow = inventoryRows.find((row) => row.size === cartItem.size);
    if (!stockRow) {
      throw new Error('Inventory record not found');
    }

    const quantity = Number(payload.quantity);
    if (quantity <= 0) {
      throw new Error('Quantity must be at least 1');
    }
    if (quantity > stockRow.stockQty) {
      throw new Error('Requested quantity exceeds stock');
    }

    await this.cartItemRepository.update(cartItemId, { quantity });
    return this.getCart(userID);
  }

  async removeCartItem(userID, cartItemId) {
    const cart = await this.cartRepository.getByUserId(userID);
    const cartItem = await this.cartItemRepository.getById(cartItemId);
    if (!cartItem || cartItem.cartID !== cart.cartID) {
      throw new Error('Cart item not found');
    }
    await this.cartItemRepository.delete(cartItemId);
    return this.getCart(userID);
  }
}

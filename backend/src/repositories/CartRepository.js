import { query } from '../db/connection.js';
import IDataPersist from './IDataPersist.js';

export default class CartRepository extends IDataPersist {
  async create(payload) {
    const result = await query(
      'INSERT INTO Cart (userID, createdAt) VALUES ($1, $2) RETURNING cartID AS "cartID", userID AS "userID", createdAt AS "createdAt"',
      [payload.userID, payload.createdAt || new Date().toISOString()]
    );
    return result.rows[0];
  }

  async getById(id) {
    const result = await query('SELECT cartID AS "cartID", userID AS "userID", createdAt AS "createdAt" FROM Cart WHERE cartID = $1', [id]);
    return result.rows[0] || null;
  }

  async getByUserId(userID) {
    const result = await query(
      'SELECT cartID AS "cartID", userID AS "userID", createdAt AS "createdAt" FROM Cart WHERE userID = $1',
      [userID]
    );
    const cart = result.rows[0];
    if (cart) {
      return cart;
    }
    return this.create({ userID });
  }

  async getAll() {
    const result = await query('SELECT cartID AS "cartID", userID AS "userID", createdAt AS "createdAt" FROM Cart');
    return result.rows;
  }

  async getCartWithItemsByUserId(userID) {
    const cart = await this.getByUserId(userID);
    const itemsResult = await query(
      `SELECT ci.cartItemID AS "cartItemID", ci.cartID AS "cartID", ci.productID AS "productID",
         ci.quantity, ci.size,
         p.name AS "productName", p.price, p.status, c.name AS "categoryName",
         i.stockQty AS "stockQty"
       FROM CartItems ci
       JOIN Products p ON ci.productID = p.productID
       JOIN Categories c ON p.categoryID = c.categoryID
       LEFT JOIN Inventory i ON i.productID = ci.productID AND i.size = ci.size
       WHERE ci.cartID = $1
       ORDER BY ci.cartItemID DESC`,
      [cart.cartID]
    );
    const items = itemsResult.rows;

    const total = items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
    return { ...cart, items, total: Number(total.toFixed(2)) };
  }

  async update(id, payload) {
    await query('UPDATE Cart SET createdAt = $1 WHERE cartID = $2', [payload.createdAt, id]);
    return this.getById(id);
  }

  async clearCart(cartID) {
    await query('DELETE FROM CartItems WHERE cartID = $1', [cartID]);
    return true;
  }

  async delete(id) {
    await query('DELETE FROM Cart WHERE cartID = $1', [id]);
    return true;
  }
}

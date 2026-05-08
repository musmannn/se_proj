import db from '../db/connection.js';
import IDataPersist from './IDataPersist.js';

export default class CartRepository extends IDataPersist {
  create(payload) {
    const result = db
      .prepare('INSERT INTO Cart (userID, createdAt) VALUES (?, ?)')
      .run(payload.userID, payload.createdAt || new Date().toISOString());
    return this.getById(result.lastInsertRowid);
  }

  getById(id) {
    return db.prepare('SELECT * FROM Cart WHERE cartID = ?').get(id);
  }

  getByUserId(userID) {
    const cart = db.prepare('SELECT * FROM Cart WHERE userID = ?').get(userID);
    if (cart) {
      return cart;
    }
    return this.create({ userID });
  }

  getAll() {
    return db.prepare('SELECT * FROM Cart').all();
  }

  getCartWithItemsByUserId(userID) {
    const cart = this.getByUserId(userID);
    const items = db
      .prepare(
        `SELECT ci.cartItemID, ci.cartID, ci.productID, ci.quantity, ci.size,
         p.name as productName, p.price, p.status, c.name as categoryName,
         i.stockQty
         FROM CartItems ci
         JOIN Products p ON ci.productID = p.productID
         JOIN Categories c ON p.categoryID = c.categoryID
         LEFT JOIN Inventory i ON i.productID = ci.productID AND i.size = ci.size
         WHERE ci.cartID = ?
         ORDER BY ci.cartItemID DESC`
      )
      .all(cart.cartID);

    const total = items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
    return { ...cart, items, total: Number(total.toFixed(2)) };
  }

  update(id, payload) {
    db.prepare('UPDATE Cart SET createdAt = ? WHERE cartID = ?').run(payload.createdAt, id);
    return this.getById(id);
  }

  clearCart(cartID) {
    db.prepare('DELETE FROM CartItems WHERE cartID = ?').run(cartID);
    return true;
  }

  delete(id) {
    db.prepare('DELETE FROM Cart WHERE cartID = ?').run(id);
    return true;
  }
}

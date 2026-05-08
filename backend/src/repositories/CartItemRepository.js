import db from '../db/connection.js';
import IDataPersist from './IDataPersist.js';

export default class CartItemRepository extends IDataPersist {
  create(payload) {
    const existing = db
      .prepare('SELECT * FROM CartItems WHERE cartID = ? AND productID = ? AND size = ?')
      .get(payload.cartID, payload.productID, payload.size);

    if (existing) {
      db
        .prepare('UPDATE CartItems SET quantity = quantity + ? WHERE cartItemID = ?')
        .run(payload.quantity, existing.cartItemID);
      return this.getById(existing.cartItemID);
    }

    const result = db
      .prepare('INSERT INTO CartItems (cartID, productID, quantity, size) VALUES (?, ?, ?, ?)')
      .run(payload.cartID, payload.productID, payload.quantity, payload.size);
    return this.getById(result.lastInsertRowid);
  }

  getById(id) {
    return db.prepare('SELECT * FROM CartItems WHERE cartItemID = ?').get(id);
  }

  getByCartId(cartID) {
    return db.prepare('SELECT * FROM CartItems WHERE cartID = ?').all(cartID);
  }

  getAll() {
    return db.prepare('SELECT * FROM CartItems').all();
  }

  update(id, payload) {
    db.prepare('UPDATE CartItems SET quantity = ? WHERE cartItemID = ?').run(payload.quantity, id);
    return this.getById(id);
  }

  delete(id) {
    db.prepare('DELETE FROM CartItems WHERE cartItemID = ?').run(id);
    return true;
  }
}

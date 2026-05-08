import db from '../db/connection.js';
import IDataPersist from './IDataPersist.js';

export default class OrderItemRepository extends IDataPersist {
  create(payload) {
    const result = db
      .prepare(
        'INSERT INTO OrderItems (orderID, productID, quantity, unitPrice, size) VALUES (?, ?, ?, ?, ?)'
      )
      .run(payload.orderID, payload.productID, payload.quantity, payload.unitPrice, payload.size);
    return this.getById(result.lastInsertRowid);
  }

  getById(id) {
    return db.prepare('SELECT * FROM OrderItems WHERE orderItemID = ?').get(id);
  }

  getByOrderId(orderID) {
    return db
      .prepare(
        `SELECT oi.*, p.name as productName
         FROM OrderItems oi
         JOIN Products p ON oi.productID = p.productID
         WHERE oi.orderID = ?`
      )
      .all(orderID);
  }

  getAll() {
    return db.prepare('SELECT * FROM OrderItems').all();
  }

  update(id, payload) {
    db
      .prepare('UPDATE OrderItems SET quantity = ?, unitPrice = ?, size = ? WHERE orderItemID = ?')
      .run(payload.quantity, payload.unitPrice, payload.size, id);
    return this.getById(id);
  }

  delete(id) {
    db.prepare('DELETE FROM OrderItems WHERE orderItemID = ?').run(id);
    return true;
  }
}

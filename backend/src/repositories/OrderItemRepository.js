import { query } from '../db/connection.js';
import IDataPersist from './IDataPersist.js';

export default class OrderItemRepository extends IDataPersist {
  async create(payload) {
    const result = await query(
      'INSERT INTO OrderItems (orderID, productID, quantity, unitPrice, size) VALUES ($1, $2, $3, $4, $5) RETURNING orderItemID AS "orderItemID", orderID AS "orderID", productID AS "productID", quantity, unitPrice AS "unitPrice", size',
      [payload.orderID, payload.productID, payload.quantity, payload.unitPrice, payload.size]
    );
    return result.rows[0];
  }

  async getById(id) {
    const result = await query(
      'SELECT orderItemID AS "orderItemID", orderID AS "orderID", productID AS "productID", quantity, unitPrice AS "unitPrice", size FROM OrderItems WHERE orderItemID = $1',
      [id]
    );
    return result.rows[0] || null;
  }

  async getByOrderId(orderID) {
    const result = await query(
      `SELECT oi.orderItemID AS "orderItemID", oi.orderID AS "orderID", oi.productID AS "productID",
         oi.quantity, oi.unitPrice AS "unitPrice", oi.size, p.name AS "productName"
       FROM OrderItems oi
       JOIN Products p ON oi.productID = p.productID
       WHERE oi.orderID = $1`,
      [orderID]
    );
    return result.rows;
  }

  async getAll() {
    const result = await query(
      'SELECT orderItemID AS "orderItemID", orderID AS "orderID", productID AS "productID", quantity, unitPrice AS "unitPrice", size FROM OrderItems'
    );
    return result.rows;
  }

  async update(id, payload) {
    await query('UPDATE OrderItems SET quantity = $1, unitPrice = $2, size = $3 WHERE orderItemID = $4', [
      payload.quantity,
      payload.unitPrice,
      payload.size,
      id
    ]);
    return this.getById(id);
  }

  async delete(id) {
    await query('DELETE FROM OrderItems WHERE orderItemID = $1', [id]);
    return true;
  }
}

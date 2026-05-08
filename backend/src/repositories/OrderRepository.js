import { query, withTransaction } from '../db/connection.js';
import IDataPersist from './IDataPersist.js';

export default class OrderRepository extends IDataPersist {
  async create(payload) {
    const result = await query(
      'INSERT INTO Orders (userID, orderDate, totalAmount, status, shippingAddr) VALUES ($1, $2, $3, $4, $5) RETURNING orderID AS "orderID", userID AS "userID", orderDate AS "orderDate", totalAmount AS "totalAmount", status, shippingAddr AS "shippingAddr"',
      [
        payload.userID,
        payload.orderDate || new Date().toISOString(),
        payload.totalAmount,
        payload.status || 'pending',
        payload.shippingAddr
      ]
    );
    return result.rows[0];
  }

  async getById(id) {
    const result = await query(
      'SELECT orderID AS "orderID", userID AS "userID", orderDate AS "orderDate", totalAmount AS "totalAmount", status, shippingAddr AS "shippingAddr" FROM Orders WHERE orderID = $1',
      [id]
    );
    return result.rows[0] || null;
  }

  async getDetailById(id) {
    const orderResult = await query(
      `SELECT o.orderID AS "orderID", o.userID AS "userID", o.orderDate AS "orderDate",
         o.totalAmount AS "totalAmount", o.status, o.shippingAddr AS "shippingAddr",
         u.name AS "customerName", u.email AS "customerEmail"
       FROM Orders o
       JOIN Users u ON o.userID = u.userID
       WHERE o.orderID = $1`,
      [id]
    );
    const order = orderResult.rows[0];

    if (!order) {
      return null;
    }

    const itemsResult = await query(
      `SELECT oi.orderItemID AS "orderItemID", oi.orderID AS "orderID", oi.productID AS "productID",
         oi.quantity, oi.unitPrice AS "unitPrice", oi.size, p.name AS "productName"
       FROM OrderItems oi
       JOIN Products p ON oi.productID = p.productID
       WHERE oi.orderID = $1`,
      [id]
    );

    return { ...order, items: itemsResult.rows };
  }

  async getByUserId(userID) {
    const result = await query(
      'SELECT orderID AS "orderID", userID AS "userID", orderDate AS "orderDate", totalAmount AS "totalAmount", status, shippingAddr AS "shippingAddr" FROM Orders WHERE userID = $1 ORDER BY orderDate DESC',
      [userID]
    );
    return result.rows;
  }

  async getAll() {
    const result = await query(
      `SELECT o.orderID AS "orderID", o.userID AS "userID", o.orderDate AS "orderDate",
         o.totalAmount AS "totalAmount", o.status, o.shippingAddr AS "shippingAddr",
         u.name AS "customerName", u.email AS "customerEmail"
       FROM Orders o
       JOIN Users u ON o.userID = u.userID
       ORDER BY o.orderDate DESC`
    );
    return result.rows;
  }

  async update(id, payload) {
    await query('UPDATE Orders SET totalAmount = $1, status = $2, shippingAddr = $3 WHERE orderID = $4', [
      payload.totalAmount,
      payload.status,
      payload.shippingAddr,
      id
    ]);
    return this.getById(id);
  }

  async updateStatus(id, status) {
    await query('UPDATE Orders SET status = $1 WHERE orderID = $2', [status, id]);
    return this.getById(id);
  }

  async cancelAndRestock(orderId) {
    return withTransaction(async (client) => {
      const orderResult = await client.query(
        'SELECT orderID AS "orderID", userID AS "userID", status FROM Orders WHERE orderID = $1',
        [orderId]
      );
      const order = orderResult.rows[0];
      if (!order) {
        throw new Error('Order not found');
      }

      const itemsResult = await client.query(
        'SELECT productID AS "productID", size, quantity FROM OrderItems WHERE orderID = $1',
        [orderId]
      );

      for (const item of itemsResult.rows) {
        await client.query('UPDATE Inventory SET stockQty = stockQty + $1 WHERE productID = $2 AND size = $3', [
          item.quantity,
          item.productID,
          item.size
        ]);
      }

      await client.query("UPDATE Orders SET status = 'cancelled' WHERE orderID = $1", [orderId]);
      const updated = await client.query(
        'SELECT orderID AS "orderID", userID AS "userID", orderDate AS "orderDate", totalAmount AS "totalAmount", status, shippingAddr AS "shippingAddr" FROM Orders WHERE orderID = $1',
        [orderId]
      );
      return updated.rows[0];
    });
  }

  async checkout({ userID, shippingAddr }) {
    const orderId = await withTransaction(async (client) => {
      const cartResult = await client.query(
        'SELECT cartID AS "cartID", userID AS "userID" FROM Cart WHERE userID = $1',
        [userID]
      );
      const cart = cartResult.rows[0];
      if (!cart) {
        throw new Error('Cart not found');
      }

      const cartItemsResult = await client.query(
        `SELECT ci.cartItemID AS "cartItemID", ci.cartID AS "cartID", ci.productID AS "productID",
           ci.quantity, ci.size, p.price, p.name AS "productName", i.stockQty AS "stockQty"
         FROM CartItems ci
         JOIN Products p ON ci.productID = p.productID
         JOIN Inventory i ON i.productID = ci.productID AND i.size = ci.size
         WHERE ci.cartID = $1`,
        [cart.cartID]
      );
      const cartItems = cartItemsResult.rows;

      if (!cartItems.length) {
        throw new Error('Cart is empty');
      }

      for (const item of cartItems) {
        if (item.stockQty - item.quantity < 0) {
          throw new Error(`Insufficient stock for ${item.productName} (${item.size})`);
        }
      }

      const totalAmount = cartItems.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

      const orderResult = await client.query(
        'INSERT INTO Orders (userID, orderDate, totalAmount, status, shippingAddr) VALUES ($1, $2, $3, $4, $5) RETURNING orderID AS "orderID"',
        [userID, new Date().toISOString(), totalAmount, 'pending', shippingAddr]
      );
      const orderID = orderResult.rows[0].orderID;

      for (const item of cartItems) {
        await client.query(
          'INSERT INTO OrderItems (orderID, productID, quantity, unitPrice, size) VALUES ($1, $2, $3, $4, $5)',
          [orderID, item.productID, item.quantity, item.price, item.size]
        );
        await client.query('UPDATE Inventory SET stockQty = stockQty - $1 WHERE productID = $2 AND size = $3', [
          item.quantity,
          item.productID,
          item.size
        ]);
      }

      await client.query('DELETE FROM CartItems WHERE cartID = $1', [cart.cartID]);
      return orderID;
    });

    return this.getDetailById(orderId);
  }

  async delete(id) {
    await query('DELETE FROM Orders WHERE orderID = $1', [id]);
    return true;
  }
}

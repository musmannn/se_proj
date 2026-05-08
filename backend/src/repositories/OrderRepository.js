import db from '../db/connection.js';
import IDataPersist from './IDataPersist.js';

export default class OrderRepository extends IDataPersist {
  create(payload) {
    const result = db
      .prepare(
        'INSERT INTO Orders (userID, orderDate, totalAmount, status, shippingAddr) VALUES (?, ?, ?, ?, ?)'
      )
      .run(
        payload.userID,
        payload.orderDate || new Date().toISOString(),
        payload.totalAmount,
        payload.status || 'pending',
        payload.shippingAddr
      );
    return this.getById(result.lastInsertRowid);
  }

  getById(id) {
    return db.prepare('SELECT * FROM Orders WHERE orderID = ?').get(id);
  }

  getDetailById(id) {
    const order = db
      .prepare(
        `SELECT o.*, u.name as customerName, u.email as customerEmail
         FROM Orders o
         JOIN Users u ON o.userID = u.userID
         WHERE o.orderID = ?`
      )
      .get(id);

    if (!order) {
      return null;
    }

    const items = db
      .prepare(
        `SELECT oi.*, p.name as productName
         FROM OrderItems oi
         JOIN Products p ON oi.productID = p.productID
         WHERE oi.orderID = ?`
      )
      .all(id);

    return { ...order, items };
  }

  getByUserId(userID) {
    return db
      .prepare('SELECT * FROM Orders WHERE userID = ? ORDER BY orderDate DESC')
      .all(userID);
  }

  getAll() {
    return db
      .prepare(
        `SELECT o.*, u.name as customerName, u.email as customerEmail
         FROM Orders o
         JOIN Users u ON o.userID = u.userID
         ORDER BY o.orderDate DESC`
      )
      .all();
  }

  update(id, payload) {
    db
      .prepare('UPDATE Orders SET totalAmount = ?, status = ?, shippingAddr = ? WHERE orderID = ?')
      .run(payload.totalAmount, payload.status, payload.shippingAddr, id);
    return this.getById(id);
  }

  updateStatus(id, status) {
    db.prepare('UPDATE Orders SET status = ? WHERE orderID = ?').run(status, id);
    return this.getById(id);
  }

  cancelAndRestock(orderId) {
    const run = db.transaction((targetOrderId) => {
      const order = db.prepare('SELECT * FROM Orders WHERE orderID = ?').get(targetOrderId);
      if (!order) {
        throw new Error('Order not found');
      }

      const items = db
        .prepare('SELECT productID, size, quantity FROM OrderItems WHERE orderID = ?')
        .all(targetOrderId);

      const incrementStock = db.prepare(
        'UPDATE Inventory SET stockQty = stockQty + ? WHERE productID = ? AND size = ?'
      );

      for (const item of items) {
        incrementStock.run(item.quantity, item.productID, item.size);
      }

      db.prepare("UPDATE Orders SET status = 'cancelled' WHERE orderID = ?").run(targetOrderId);
      return this.getById(targetOrderId);
    });

    return run(orderId);
  }

  checkout({ userID, shippingAddr }) {
    const runCheckout = db.transaction(({ userID: checkoutUserID, shippingAddr: checkoutShippingAddr }) => {
      const cart = db.prepare('SELECT * FROM Cart WHERE userID = ?').get(checkoutUserID);
      if (!cart) {
        throw new Error('Cart not found');
      }

      const cartItems = db
        .prepare(
          `SELECT ci.*, p.price, p.name as productName, i.stockQty
           FROM CartItems ci
           JOIN Products p ON ci.productID = p.productID
           JOIN Inventory i ON i.productID = ci.productID AND i.size = ci.size
           WHERE ci.cartID = ?`
        )
        .all(cart.cartID);

      if (!cartItems.length) {
        throw new Error('Cart is empty');
      }

      for (const item of cartItems) {
        if (item.stockQty - item.quantity < 0) {
          throw new Error(`Insufficient stock for ${item.productName} (${item.size})`);
        }
      }

      const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

      const orderResult = db
        .prepare(
          'INSERT INTO Orders (userID, orderDate, totalAmount, status, shippingAddr) VALUES (?, ?, ?, ?, ?)'
        )
        .run(checkoutUserID, new Date().toISOString(), totalAmount, 'pending', checkoutShippingAddr);

      const orderID = orderResult.lastInsertRowid;

      const insertOrderItem = db.prepare(
        'INSERT INTO OrderItems (orderID, productID, quantity, unitPrice, size) VALUES (?, ?, ?, ?, ?)'
      );
      const decrementStock = db.prepare(
        'UPDATE Inventory SET stockQty = stockQty - ? WHERE productID = ? AND size = ?'
      );

      for (const item of cartItems) {
        insertOrderItem.run(orderID, item.productID, item.quantity, item.price, item.size);
        decrementStock.run(item.quantity, item.productID, item.size);
      }

      db.prepare('DELETE FROM CartItems WHERE cartID = ?').run(cart.cartID);
      return this.getDetailById(orderID);
    });

    return runCheckout({ userID, shippingAddr });
  }

  delete(id) {
    db.prepare('DELETE FROM Orders WHERE orderID = ?').run(id);
    return true;
  }
}

import db from '../db/connection.js';
import IDataPersist from './IDataPersist.js';

export default class InventoryRepository extends IDataPersist {
  create(payload) {
    const result = db
      .prepare('INSERT INTO Inventory (productID, size, stockQty, safetyStock) VALUES (?, ?, ?, ?)')
      .run(payload.productID, payload.size, payload.stockQty, payload.safetyStock);
    return this.getById(result.lastInsertRowid);
  }

  getById(id) {
    return db.prepare('SELECT * FROM Inventory WHERE inventoryID = ?').get(id);
  }

  getByProductId(productId) {
    return db
      .prepare('SELECT * FROM Inventory WHERE productID = ? ORDER BY size')
      .all(productId);
  }

  getAll() {
    return db
      .prepare(
        `SELECT i.*, p.name as productName
         FROM Inventory i
         JOIN Products p ON i.productID = p.productID
         ORDER BY p.name, i.size`
      )
      .all();
  }

  getAllWithAlerts() {
    return db
      .prepare(
        `SELECT i.*, p.name as productName,
         CASE WHEN i.stockQty <= i.safetyStock THEN 1 ELSE 0 END as isLowStock
         FROM Inventory i
         JOIN Products p ON i.productID = p.productID
         ORDER BY isLowStock DESC, p.name, i.size`
      )
      .all();
  }

  getLowStockAlerts() {
    return db
      .prepare(
        `SELECT i.inventoryID, i.productID, p.name as productName, i.size, i.stockQty, i.safetyStock
         FROM Inventory i
         JOIN Products p ON i.productID = p.productID
         WHERE i.stockQty <= i.safetyStock
         ORDER BY p.name, i.size`
      )
      .all();
  }

  update(id, payload) {
    const existing = this.getById(id);
    const stockQty = payload.stockQty ?? existing.stockQty;
    const safetyStock = payload.safetyStock ?? existing.safetyStock;
    db
      .prepare('UPDATE Inventory SET stockQty = ?, safetyStock = ? WHERE inventoryID = ?')
      .run(stockQty, safetyStock, id);
    return this.getById(id);
  }

  decrementStock(productID, size, quantity) {
    db
      .prepare('UPDATE Inventory SET stockQty = stockQty - ? WHERE productID = ? AND size = ?')
      .run(quantity, productID, size);
  }

  delete(id) {
    db.prepare('DELETE FROM Inventory WHERE inventoryID = ?').run(id);
    return true;
  }
}

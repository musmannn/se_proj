import { query } from '../db/connection.js';
import IDataPersist from './IDataPersist.js';

export default class InventoryRepository extends IDataPersist {
  async create(payload) {
    const result = await query(
      'INSERT INTO Inventory (productID, size, stockQty, safetyStock) VALUES ($1, $2, $3, $4) RETURNING inventoryID AS "inventoryID", productID AS "productID", size, stockQty AS "stockQty", safetyStock AS "safetyStock"',
      [payload.productID, payload.size, payload.stockQty, payload.safetyStock]
    );
    return result.rows[0];
  }

  async getById(id) {
    const result = await query(
      'SELECT inventoryID AS "inventoryID", productID AS "productID", size, stockQty AS "stockQty", safetyStock AS "safetyStock" FROM Inventory WHERE inventoryID = $1',
      [id]
    );
    return result.rows[0] || null;
  }

  async getByProductId(productId) {
    const result = await query(
      'SELECT inventoryID AS "inventoryID", productID AS "productID", size, stockQty AS "stockQty", safetyStock AS "safetyStock" FROM Inventory WHERE productID = $1 ORDER BY size',
      [productId]
    );
    return result.rows;
  }

  async getAll() {
    const result = await query(
      `SELECT i.inventoryID AS "inventoryID", i.productID AS "productID", i.size,
         i.stockQty AS "stockQty", i.safetyStock AS "safetyStock",
         p.name AS "productName"
       FROM Inventory i
       JOIN Products p ON i.productID = p.productID
       ORDER BY p.name, i.size`
    );
    return result.rows;
  }

  async getAllWithAlerts() {
    const result = await query(
      `SELECT i.inventoryID AS "inventoryID", i.productID AS "productID", i.size,
         i.stockQty AS "stockQty", i.safetyStock AS "safetyStock",
         p.name AS "productName",
         CASE WHEN i.stockQty <= i.safetyStock THEN 1 ELSE 0 END AS "isLowStock"
       FROM Inventory i
       JOIN Products p ON i.productID = p.productID
       ORDER BY "isLowStock" DESC, p.name, i.size`
    );
    return result.rows;
  }

  async getLowStockAlerts() {
    const result = await query(
      `SELECT i.inventoryID AS "inventoryID", i.productID AS "productID", p.name AS "productName",
         i.size, i.stockQty AS "stockQty", i.safetyStock AS "safetyStock"
       FROM Inventory i
       JOIN Products p ON i.productID = p.productID
       WHERE i.stockQty <= i.safetyStock
       ORDER BY p.name, i.size`
    );
    return result.rows;
  }

  async update(id, payload) {
    const existing = await this.getById(id);
    const stockQty = payload.stockQty ?? existing.stockQty;
    const safetyStock = payload.safetyStock ?? existing.safetyStock;
    await query('UPDATE Inventory SET stockQty = $1, safetyStock = $2 WHERE inventoryID = $3', [
      stockQty,
      safetyStock,
      id
    ]);
    return this.getById(id);
  }

  async decrementStock(productID, size, quantity) {
    await query('UPDATE Inventory SET stockQty = stockQty - $1 WHERE productID = $2 AND size = $3', [
      quantity,
      productID,
      size
    ]);
  }

  async delete(id) {
    await query('DELETE FROM Inventory WHERE inventoryID = $1', [id]);
    return true;
  }
}

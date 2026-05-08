import { query } from '../db/connection.js';
import IDataPersist from './IDataPersist.js';

export default class CartItemRepository extends IDataPersist {
  async create(payload) {
    const existingResult = await query(
      'SELECT cartItemID AS "cartItemID", cartID AS "cartID", productID AS "productID", quantity, size FROM CartItems WHERE cartID = $1 AND productID = $2 AND size = $3',
      [payload.cartID, payload.productID, payload.size]
    );
    const existing = existingResult.rows[0];

    if (existing) {
      await query('UPDATE CartItems SET quantity = quantity + $1 WHERE cartItemID = $2', [
        payload.quantity,
        existing.cartItemID
      ]);
      return this.getById(existing.cartItemID);
    }

    const result = await query(
      'INSERT INTO CartItems (cartID, productID, quantity, size) VALUES ($1, $2, $3, $4) RETURNING cartItemID AS "cartItemID", cartID AS "cartID", productID AS "productID", quantity, size',
      [payload.cartID, payload.productID, payload.quantity, payload.size]
    );
    return result.rows[0];
  }

  async getById(id) {
    const result = await query(
      'SELECT cartItemID AS "cartItemID", cartID AS "cartID", productID AS "productID", quantity, size FROM CartItems WHERE cartItemID = $1',
      [id]
    );
    return result.rows[0] || null;
  }

  async getByCartId(cartID) {
    const result = await query(
      'SELECT cartItemID AS "cartItemID", cartID AS "cartID", productID AS "productID", quantity, size FROM CartItems WHERE cartID = $1',
      [cartID]
    );
    return result.rows;
  }

  async getAll() {
    const result = await query(
      'SELECT cartItemID AS "cartItemID", cartID AS "cartID", productID AS "productID", quantity, size FROM CartItems'
    );
    return result.rows;
  }

  async update(id, payload) {
    await query('UPDATE CartItems SET quantity = $1 WHERE cartItemID = $2', [payload.quantity, id]);
    return this.getById(id);
  }

  async delete(id) {
    await query('DELETE FROM CartItems WHERE cartItemID = $1', [id]);
    return true;
  }
}

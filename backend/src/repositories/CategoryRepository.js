import { query } from '../db/connection.js';
import IDataPersist from './IDataPersist.js';

export default class CategoryRepository extends IDataPersist {
  async create(category) {
    const result = await query(
      'INSERT INTO Categories (name, description) VALUES ($1, $2) RETURNING categoryID AS "categoryID", name, description',
      [category.name, category.description || null]
    );
    return result.rows[0];
  }

  async getById(id) {
    const result = await query(
      'SELECT categoryID AS "categoryID", name, description FROM Categories WHERE categoryID = $1',
      [id]
    );
    return result.rows[0] || null;
  }

  async getAll() {
    const result = await query('SELECT categoryID AS "categoryID", name, description FROM Categories ORDER BY name');
    return result.rows;
  }

  async update(id, payload) {
    await query('UPDATE Categories SET name = $1, description = $2 WHERE categoryID = $3', [
      payload.name,
      payload.description || null,
      id
    ]);
    return this.getById(id);
  }

  async delete(id) {
    await query('DELETE FROM Categories WHERE categoryID = $1', [id]);
    return true;
  }
}

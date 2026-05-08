import db from '../db/connection.js';
import IDataPersist from './IDataPersist.js';

export default class CategoryRepository extends IDataPersist {
  create(category) {
    const result = db
      .prepare('INSERT INTO Categories (name, description) VALUES (?, ?)')
      .run(category.name, category.description || null);
    return this.getById(result.lastInsertRowid);
  }

  getById(id) {
    return db.prepare('SELECT * FROM Categories WHERE categoryID = ?').get(id);
  }

  getAll() {
    return db.prepare('SELECT * FROM Categories ORDER BY name').all();
  }

  update(id, payload) {
    db
      .prepare('UPDATE Categories SET name = ?, description = ? WHERE categoryID = ?')
      .run(payload.name, payload.description || null, id);
    return this.getById(id);
  }

  delete(id) {
    db.prepare('DELETE FROM Categories WHERE categoryID = ?').run(id);
    return true;
  }
}

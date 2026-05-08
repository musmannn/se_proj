import db from '../db/connection.js';
import IDataPersist from './IDataPersist.js';

export default class UserRepository extends IDataPersist {
  create(user) {
    const stmt = db.prepare('INSERT INTO Users (name, email, passwordHash, role) VALUES (?, ?, ?, ?)');
    const result = stmt.run(user.name, user.email, user.passwordHash, user.role);
    return this.getById(result.lastInsertRowid);
  }

  getById(id) {
    return db
      .prepare('SELECT userID, name, email, role FROM Users WHERE userID = ?')
      .get(id);
  }

  getByEmail(email) {
    return db.prepare('SELECT * FROM Users WHERE email = ?').get(email);
  }

  getAll() {
    return db.prepare('SELECT userID, name, email, role FROM Users').all();
  }

  update(id, payload) {
    db.prepare('UPDATE Users SET name = ?, email = ? WHERE userID = ?').run(payload.name, payload.email, id);
    return this.getById(id);
  }

  updatePassword(id, passwordHash) {
    db.prepare('UPDATE Users SET passwordHash = ? WHERE userID = ?').run(passwordHash, id);
    return this.getById(id);
  }

  delete(id) {
    db.prepare('DELETE FROM Users WHERE userID = ?').run(id);
    return true;
  }
}

import { query } from '../db/connection.js';
import IDataPersist from './IDataPersist.js';

export default class UserRepository extends IDataPersist {
  async create(user) {
    const result = await query(
      'INSERT INTO Users (name, email, passwordHash, role) VALUES ($1, $2, $3, $4) RETURNING userID AS "userID", name, email, role',
      [user.name, user.email, user.passwordHash, user.role]
    );
    return result.rows[0];
  }

  async getById(id) {
    const result = await query(
      'SELECT userID AS "userID", name, email, role FROM Users WHERE userID = $1',
      [id]
    );
    return result.rows[0] || null;
  }

  async getByEmail(email) {
    const result = await query(
      'SELECT userID AS "userID", name, email, passwordHash AS "passwordHash", role FROM Users WHERE email = $1',
      [email]
    );
    return result.rows[0] || null;
  }

  async getAll() {
    const result = await query('SELECT userID AS "userID", name, email, role FROM Users');
    return result.rows;
  }

  async update(id, payload) {
    await query('UPDATE Users SET name = $1, email = $2 WHERE userID = $3', [payload.name, payload.email, id]);
    return this.getById(id);
  }

  async updatePassword(id, passwordHash) {
    await query('UPDATE Users SET passwordHash = $1 WHERE userID = $2', [passwordHash, id]);
    return this.getById(id);
  }

  async delete(id) {
    await query('DELETE FROM Users WHERE userID = $1', [id]);
    return true;
  }
}

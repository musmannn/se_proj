import db from '../db/connection.js';
import IDataPersist from './IDataPersist.js';

export default class ReviewRepository extends IDataPersist {
  create(payload) {
    const result = db
      .prepare(
        'INSERT INTO Reviews (userID, productID, rating, comment, reviewDate) VALUES (?, ?, ?, ?, ?)'
      )
      .run(payload.userID, payload.productID, payload.rating, payload.comment, new Date().toISOString());
    return this.getById(result.lastInsertRowid);
  }

  getById(id) {
    return db.prepare('SELECT * FROM Reviews WHERE reviewID = ?').get(id);
  }

  getAll() {
    return db
      .prepare(
        `SELECT r.*, u.name as userName, p.name as productName
         FROM Reviews r
         JOIN Users u ON r.userID = u.userID
         JOIN Products p ON r.productID = p.productID
         ORDER BY r.reviewDate DESC`
      )
      .all();
  }

  getByProductId(productID) {
    return db
      .prepare(
        `SELECT r.reviewID, r.productID, r.rating, r.comment, r.reviewDate,
         u.userID, u.name as userName
         FROM Reviews r
         JOIN Users u ON r.userID = u.userID
         WHERE r.productID = ?
         ORDER BY r.reviewDate DESC`
      )
      .all(productID);
  }

  getInsights() {
    return db
      .prepare(
        `SELECT p.productID, p.name,
         COALESCE(ROUND(AVG(r.rating), 2), 0) as avgRating,
         COUNT(r.reviewID) as reviewCount
         FROM Products p
         LEFT JOIN Reviews r ON p.productID = r.productID
         GROUP BY p.productID
         ORDER BY avgRating DESC, reviewCount DESC, p.name`
      )
      .all();
  }

  getOverallAverageRating() {
    const row = db
      .prepare('SELECT COALESCE(ROUND(AVG(rating), 2), 0) as avgRating FROM Reviews')
      .get();
    return row.avgRating;
  }

  update(id, payload) {
    db
      .prepare('UPDATE Reviews SET rating = ?, comment = ? WHERE reviewID = ?')
      .run(payload.rating, payload.comment, id);
    return this.getById(id);
  }

  delete(id) {
    db.prepare('DELETE FROM Reviews WHERE reviewID = ?').run(id);
    return true;
  }
}

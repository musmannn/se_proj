import { query } from '../db/connection.js';
import IDataPersist from './IDataPersist.js';

export default class ReviewRepository extends IDataPersist {
  async create(payload) {
    const result = await query(
      'INSERT INTO Reviews (userID, productID, rating, comment, reviewDate) VALUES ($1, $2, $3, $4, $5) RETURNING reviewID AS "reviewID", userID AS "userID", productID AS "productID", rating, comment, reviewDate AS "reviewDate"',
      [payload.userID, payload.productID, payload.rating, payload.comment, new Date().toISOString()]
    );
    return result.rows[0];
  }

  async getById(id) {
    const result = await query(
      'SELECT reviewID AS "reviewID", userID AS "userID", productID AS "productID", rating, comment, reviewDate AS "reviewDate" FROM Reviews WHERE reviewID = $1',
      [id]
    );
    return result.rows[0] || null;
  }

  async getAll() {
    const result = await query(
      `SELECT r.reviewID AS "reviewID", r.userID AS "userID", r.productID AS "productID",
         r.rating, r.comment, r.reviewDate AS "reviewDate",
         u.name AS "userName", p.name AS "productName"
       FROM Reviews r
       JOIN Users u ON r.userID = u.userID
       JOIN Products p ON r.productID = p.productID
       ORDER BY r.reviewDate DESC`
    );
    return result.rows;
  }

  async getByProductId(productID) {
    const result = await query(
      `SELECT r.reviewID AS "reviewID", r.productID AS "productID", r.rating, r.comment,
         r.reviewDate AS "reviewDate", u.userID AS "userID", u.name AS "userName"
       FROM Reviews r
       JOIN Users u ON r.userID = u.userID
       WHERE r.productID = $1
       ORDER BY r.reviewDate DESC`,
      [productID]
    );
    return result.rows;
  }

  async getInsights() {
    const result = await query(
      `SELECT p.productID AS "productID", p.name,
         COALESCE(r.avgRating, 0) AS "avgRating",
         COALESCE(r.reviewCount, 0) AS "reviewCount"
       FROM Products p
       LEFT JOIN (
        SELECT productID, ROUND(AVG(rating)::numeric, 2)::double precision AS avgRating, COUNT(reviewID) AS reviewCount
         FROM Reviews
         GROUP BY productID
       ) r ON p.productID = r.productID
       ORDER BY "avgRating" DESC, "reviewCount" DESC, p.name`
    );
    return result.rows;
  }

  async getOverallAverageRating() {
    const result = await query(
      'SELECT COALESCE(ROUND(AVG(rating)::numeric, 2)::double precision, 0) AS "avgRating" FROM Reviews'
    );
    return result.rows[0]?.avgRating ?? 0;
  }

  async update(id, payload) {
    await query('UPDATE Reviews SET rating = $1, comment = $2 WHERE reviewID = $3', [
      payload.rating,
      payload.comment,
      id
    ]);
    return this.getById(id);
  }

  async delete(id) {
    await query('DELETE FROM Reviews WHERE reviewID = $1', [id]);
    return true;
  }
}

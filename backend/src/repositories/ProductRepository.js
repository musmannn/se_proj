import { query } from '../db/connection.js';
import IDataPersist from './IDataPersist.js';

export default class ProductRepository extends IDataPersist {
  async create(product) {
    const result = await query(
      'INSERT INTO Products (name, imageUrl, price, fabric, cut, season, gsm, status, categoryID) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING productID AS "productID", name, imageUrl AS "imageUrl", price, fabric, cut, season, gsm, status, categoryID AS "categoryID"',
      [
        product.name,
        product.imageUrl || null,
        product.price,
        product.fabric,
        product.cut,
        product.season,
        product.gsm,
        product.status,
        product.categoryID
      ]
    );
    return result.rows[0];
  }

  async getById(id) {
    const result = await query(
      `SELECT p.productID AS "productID", p.name, p.imageUrl AS "imageUrl", p.price, p.fabric,
         p.cut, p.season, p.gsm, p.status, p.categoryID AS "categoryID",
         c.name AS "categoryName", c.description AS "categoryDescription"
       FROM Products p
       JOIN Categories c ON p.categoryID = c.categoryID
       WHERE p.productID = $1`,
      [id]
    );
    return result.rows[0] || null;
  }

  async getAll(filters = {}) {
    const conditions = [];
    const params = [];

    if (filters.category) {
      params.push(filters.category);
      conditions.push(`c.name = $${params.length}`);
    }
    if (filters.fabric) {
      params.push(filters.fabric);
      conditions.push(`p.fabric = $${params.length}`);
    }
    if (filters.cut) {
      params.push(filters.cut);
      conditions.push(`p.cut = $${params.length}`);
    }
    if (filters.season) {
      params.push(filters.season);
      conditions.push(`p.season = $${params.length}`);
    }
    if (filters.gsm_min) {
      params.push(Number(filters.gsm_min));
      conditions.push(`p.gsm >= $${params.length}`);
    }
    if (filters.gsm_max) {
      params.push(Number(filters.gsm_max));
      conditions.push(`p.gsm <= $${params.length}`);
    }
    if (filters.status) {
      params.push(filters.status);
      conditions.push(`p.status = $${params.length}`);
    } else if (filters.include_discontinued !== 'true') {
      conditions.push("p.status != 'discontinued'");
    }
    if (filters.search) {
      const search = `%${filters.search}%`;
      params.push(search, search, search);
      const start = params.length - 2;
      conditions.push(`(p.name ILIKE $${start} OR p.fabric ILIKE $${start + 1} OR c.name ILIKE $${start + 2})`);
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const sql = `
      SELECT p.productID AS "productID", p.name, p.imageUrl AS "imageUrl", p.price, p.fabric, p.cut,
        p.season, p.gsm, p.status, p.categoryID AS "categoryID",
        c.name AS "categoryName", COALESCE(r.avgRating, 0) AS "avgRating"
      FROM Products p
      JOIN Categories c ON p.categoryID = c.categoryID
      LEFT JOIN (
        SELECT productID, ROUND(AVG(rating)::numeric, 2)::double precision AS avgRating
        FROM Reviews
        GROUP BY productID
      ) r ON p.productID = r.productID
      ${where}
      ORDER BY p.productID DESC
    `;

    const result = await query(sql, params);
    return result.rows;
  }

  async getProductDetails(id) {
    const productResult = await query(
      `SELECT p.productID AS "productID", p.name, p.imageUrl AS "imageUrl", p.price, p.fabric, p.cut,
         p.season, p.gsm, p.status, p.categoryID AS "categoryID",
         c.name AS "categoryName", COALESCE(r.avgRating, 0) AS "avgRating"
       FROM Products p
       JOIN Categories c ON p.categoryID = c.categoryID
       LEFT JOIN (
        SELECT productID, ROUND(AVG(rating)::numeric, 2)::double precision AS avgRating
         FROM Reviews
         GROUP BY productID
       ) r ON p.productID = r.productID
       WHERE p.productID = $1`,
      [id]
    );
    const product = productResult.rows[0];

    if (!product) {
      return null;
    }

    const inventoryResult = await query(
      'SELECT inventoryID AS "inventoryID", productID AS "productID", size, stockQty AS "stockQty", safetyStock AS "safetyStock" FROM Inventory WHERE productID = $1 ORDER BY size',
      [id]
    );

    return { ...product, inventory: inventoryResult.rows };
  }

  async update(id, payload) {
    await query(
      `UPDATE Products
       SET name = $1, imageUrl = $2, price = $3, fabric = $4, cut = $5, season = $6, gsm = $7, status = $8, categoryID = $9
       WHERE productID = $10`,
      [
        payload.name,
        payload.imageUrl || null,
        payload.price,
        payload.fabric,
        payload.cut,
        payload.season,
        payload.gsm,
        payload.status,
        payload.categoryID,
        id
      ]
    );
    return this.getById(id);
  }

  async softDelete(id) {
    await query("UPDATE Products SET status = 'discontinued' WHERE productID = $1", [id]);
    return this.getById(id);
  }

  delete(id) {
    return this.softDelete(id);
  }
}

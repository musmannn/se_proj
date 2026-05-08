import db from '../db/connection.js';
import IDataPersist from './IDataPersist.js';

export default class ProductRepository extends IDataPersist {
  create(product) {
    const result = db
      .prepare(
        'INSERT INTO Products (name, imageUrl, price, fabric, cut, season, gsm, status, categoryID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
      )
      .run(
        product.name,
        product.imageUrl || null,
        product.price,
        product.fabric,
        product.cut,
        product.season,
        product.gsm,
        product.status,
        product.categoryID
      );
    return this.getById(result.lastInsertRowid);
  }

  getById(id) {
    return db
      .prepare(
        `SELECT p.*, c.name as categoryName, c.description as categoryDescription
         FROM Products p
         JOIN Categories c ON p.categoryID = c.categoryID
         WHERE p.productID = ?`
      )
      .get(id);
  }

  getAll(filters = {}) {
    const conditions = [];
    const params = [];

    if (filters.category) {
      conditions.push('c.name = ?');
      params.push(filters.category);
    }
    if (filters.fabric) {
      conditions.push('p.fabric = ?');
      params.push(filters.fabric);
    }
    if (filters.cut) {
      conditions.push('p.cut = ?');
      params.push(filters.cut);
    }
    if (filters.season) {
      conditions.push('p.season = ?');
      params.push(filters.season);
    }
    if (filters.gsm_min) {
      conditions.push('p.gsm >= ?');
      params.push(Number(filters.gsm_min));
    }
    if (filters.gsm_max) {
      conditions.push('p.gsm <= ?');
      params.push(Number(filters.gsm_max));
    }
    if (filters.status) {
      conditions.push('p.status = ?');
      params.push(filters.status);
    } else if (filters.include_discontinued !== 'true') {
      conditions.push("p.status != 'discontinued'");
    }
    if (filters.search) {
      conditions.push('(p.name LIKE ? OR p.fabric LIKE ? OR c.name LIKE ?)');
      params.push(`%${filters.search}%`, `%${filters.search}%`, `%${filters.search}%`);
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const query = `
      SELECT p.*, c.name as categoryName,
      COALESCE(ROUND(AVG(r.rating), 2), 0) as avgRating
      FROM Products p
      JOIN Categories c ON p.categoryID = c.categoryID
      LEFT JOIN Reviews r ON p.productID = r.productID
      ${where}
      GROUP BY p.productID
      ORDER BY p.productID DESC
    `;

    return db.prepare(query).all(...params);
  }

  getProductDetails(id) {
    const product = db
      .prepare(
        `SELECT p.*, c.name as categoryName,
         COALESCE(ROUND(AVG(r.rating), 2), 0) as avgRating
         FROM Products p
         JOIN Categories c ON p.categoryID = c.categoryID
         LEFT JOIN Reviews r ON p.productID = r.productID
         WHERE p.productID = ?
         GROUP BY p.productID`
      )
      .get(id);

    if (!product) {
      return null;
    }

    const inventory = db
      .prepare('SELECT * FROM Inventory WHERE productID = ? ORDER BY size')
      .all(id);

    return { ...product, inventory };
  }

  update(id, payload) {
    db
      .prepare(
        `UPDATE Products
         SET name = ?, imageUrl = ?, price = ?, fabric = ?, cut = ?, season = ?, gsm = ?, status = ?, categoryID = ?
         WHERE productID = ?`
      )
      .run(
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
      );
    return this.getById(id);
  }

  softDelete(id) {
    db.prepare("UPDATE Products SET status = 'discontinued' WHERE productID = ?").run(id);
    return this.getById(id);
  }

  delete(id) {
    return this.softDelete(id);
  }
}

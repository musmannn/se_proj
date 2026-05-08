import fs from 'fs';
import path from 'path';
import bcrypt from 'bcrypt';
import { fileURLToPath } from 'url';
import db from './connection.js';
import UserRepository from '../repositories/UserRepository.js';
import CategoryRepository from '../repositories/CategoryRepository.js';
import ProductRepository from '../repositories/ProductRepository.js';
import InventoryRepository from '../repositories/InventoryRepository.js';
import CartRepository from '../repositories/CartRepository.js';
import ReviewRepository from '../repositories/ReviewRepository.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SALT_ROUNDS = 10;

const categoriesSeed = [
  { name: 'Shirts', description: 'Premium shirts for formal and casual wear' },
  { name: 'Trousers', description: 'Tailored trousers with modern cuts' },
  { name: 'Jackets', description: 'Season-ready jackets and blazers' },
  { name: 'Accessories', description: 'Essential accessories for men' }
];

const productsSeed = [
  { name: 'Oxford White Shirt', imageUrl: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1000&q=80', price: 79.99, fabric: 'Cotton', cut: 'slim', season: 'All Season', gsm: 140, status: 'new_arrival', category: 'Shirts' },
  { name: 'Linen Sky Shirt', imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1000&q=80', price: 69.5, fabric: 'Linen', cut: 'regular', season: 'Summer', gsm: 120, status: 'active', category: 'Shirts' },
  { name: 'Stretch Navy Trouser', imageUrl: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=1000&q=80', price: 99.99, fabric: 'Cotton Blend', cut: 'athletic', season: 'All Season', gsm: 210, status: 'active', category: 'Trousers' },
  { name: 'Classic Charcoal Trouser', imageUrl: 'https://images.unsplash.com/photo-1506629905607-d405b7a26db4?auto=format&fit=crop&w=1000&q=80', price: 109.99, fabric: 'Wool Blend', cut: 'regular', season: 'Winter', gsm: 260, status: 'active', category: 'Trousers' },
  { name: 'Tech Bomber Jacket', imageUrl: 'https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?auto=format&fit=crop&w=1000&q=80', price: 179.0, fabric: 'Poly Blend', cut: 'slim', season: 'Fall', gsm: 300, status: 'new_arrival', category: 'Jackets' },
  { name: 'Wool Blend Blazer', imageUrl: 'https://images.unsplash.com/photo-1593032465171-8bdc6f4a2f7e?auto=format&fit=crop&w=1000&q=80', price: 249.0, fabric: 'Wool', cut: 'athletic', season: 'Winter', gsm: 320, status: 'active', category: 'Jackets' },
  { name: 'Leather Belt Brown', imageUrl: 'https://images.unsplash.com/photo-1618886487325-f665032b6352?auto=format&fit=crop&w=1000&q=80', price: 49.99, fabric: 'Leather', cut: 'regular', season: 'All Season', gsm: 180, status: 'active', category: 'Accessories' },
  { name: 'Silk Pocket Square', imageUrl: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=1000&q=80', price: 29.5, fabric: 'Silk', cut: 'regular', season: 'Spring', gsm: 90, status: 'active', category: 'Accessories' },
  { name: 'Denim Utility Shirt', imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1000&q=80', price: 89.0, fabric: 'Denim', cut: 'athletic', season: 'Fall', gsm: 230, status: 'active', category: 'Shirts' },
  { name: 'Corduroy Overshirt', imageUrl: 'https://images.unsplash.com/photo-1551232864-3f0890e580d9?auto=format&fit=crop&w=1000&q=80', price: 119.0, fabric: 'Corduroy', cut: 'regular', season: 'Winter', gsm: 280, status: 'discontinued', category: 'Shirts' },
  { name: 'Poplin Formal Shirt', imageUrl: 'https://images.unsplash.com/photo-1621072156002-e2fccdc0b176?auto=format&fit=crop&w=1000&q=80', price: 74.0, fabric: 'Cotton', cut: 'regular', season: 'All Season', gsm: 135, status: 'active', category: 'Shirts' },
  { name: 'Merino Tailored Trouser', imageUrl: 'https://images.unsplash.com/photo-1584865288642-42078afe6942?auto=format&fit=crop&w=1000&q=80', price: 129.0, fabric: 'Wool', cut: 'slim', season: 'Winter', gsm: 275, status: 'active', category: 'Trousers' },
  { name: 'Suede Harrington Jacket', imageUrl: 'https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?auto=format&fit=crop&w=1000&q=80', price: 219.0, fabric: 'Leather', cut: 'regular', season: 'Fall', gsm: 310, status: 'new_arrival', category: 'Jackets' },
  { name: 'Linen Blend Summer Blazer', imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80', price: 199.0, fabric: 'Linen', cut: 'athletic', season: 'Summer', gsm: 220, status: 'active', category: 'Jackets' },
  { name: 'Textured Knit Polo', imageUrl: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=1000&q=80', price: 84.0, fabric: 'Cotton Blend', cut: 'athletic', season: 'Spring', gsm: 170, status: 'active', category: 'Shirts' },
  { name: 'Wool Scarf Graphite', imageUrl: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=1000&q=80', price: 59.0, fabric: 'Wool Blend', cut: 'regular', season: 'Winter', gsm: 200, status: 'active', category: 'Accessories' }
];

const reviewSeed = [
  { email: 'ali@mtr.com', product: 'Oxford White Shirt', rating: 5, comment: 'Excellent fit and fabric quality' },
  { email: 'omar@mtr.com', product: 'Stretch Navy Trouser', rating: 4, comment: 'Comfortable and great movement' },
  { email: 'ali@mtr.com', product: 'Wool Blend Blazer', rating: 5, comment: 'Looks premium and sharp' },
  { email: 'omar@mtr.com', product: 'Tech Bomber Jacket', rating: 4, comment: 'Stylish and warm for evenings' },
  { email: 'ali@mtr.com', product: 'Leather Belt Brown', rating: 5, comment: 'Solid leather and elegant finish' }
];

export function initializeDatabase() {
  const schemaPath = path.join(__dirname, 'schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf-8');
  db.exec(schema);

  const productColumns = db.prepare('PRAGMA table_info(Products)').all();
  const hasImageUrl = productColumns.some((column) => column.name === 'imageUrl');
  if (!hasImageUrl) {
    db.exec('ALTER TABLE Products ADD COLUMN imageUrl TEXT');
  }
}

export function seedDatabaseIfEmpty() {
  const userRepository = new UserRepository();
  const categoryRepository = new CategoryRepository();
  const productRepository = new ProductRepository();
  const inventoryRepository = new InventoryRepository();
  const cartRepository = new CartRepository();
  const reviewRepository = new ReviewRepository();

  const adminHash = bcrypt.hashSync('admin123', SALT_ROUNDS);
  const customerHash1 = bcrypt.hashSync('customer123', SALT_ROUNDS);
  const customerHash2 = bcrypt.hashSync('customer456', SALT_ROUNDS);

  const currentUsers = userRepository.getAll();
  const usersByEmail = currentUsers.reduce((acc, user) => ({ ...acc, [user.email]: user }), {});

  if (!usersByEmail['admin@mtr.com']) {
    userRepository.create({ name: 'MTR Admin', email: 'admin@mtr.com', passwordHash: adminHash, role: 'admin' });
  }
  if (!usersByEmail['ali@mtr.com']) {
    userRepository.create({ name: 'Ali Khan', email: 'ali@mtr.com', passwordHash: customerHash1, role: 'customer' });
  }
  if (!usersByEmail['omar@mtr.com']) {
    userRepository.create({ name: 'Omar Siddiqui', email: 'omar@mtr.com', passwordHash: customerHash2, role: 'customer' });
  }

  const existingCategories = categoryRepository.getAll().reduce((acc, category) => ({ ...acc, [category.name]: true }), {});
  categoriesSeed.forEach((category) => {
    if (!existingCategories[category.name]) {
      categoryRepository.create(category);
    }
  });

  const categoriesByName = categoryRepository
    .getAll()
    .reduce((acc, category) => ({ ...acc, [category.name]: category.categoryID }), {});

  const existingProductsByName = productRepository
    .getAll({ include_discontinued: 'true' })
    .reduce((acc, product) => ({ ...acc, [product.name]: product }), {});

  productsSeed.forEach((product) => {
    if (!existingProductsByName[product.name]) {
      productRepository.create({
        name: product.name,
        imageUrl: product.imageUrl,
        price: product.price,
        fabric: product.fabric,
        cut: product.cut,
        season: product.season,
        gsm: product.gsm,
        status: product.status,
        categoryID: categoriesByName[product.category]
      });
    }
  });

  const productRows = productRepository
    .getAll({ include_discontinued: 'true' })
    .filter((product) => productsSeed.some((seeded) => seeded.name === product.name));

  productRows.forEach((product, productIndex) => {
    const existingInventory = inventoryRepository.getByProductId(product.productID);
    const sizeSet = existingInventory.reduce((acc, item) => ({ ...acc, [item.size]: true }), {});
    ['S', 'M', 'L', 'XL'].forEach((size, sizeIndex) => {
      if (!sizeSet[size]) {
        const stockQty = 8 + ((productIndex + 1) * 3 + sizeIndex * 2) % 22;
        const safetyStock = 6 + (sizeIndex % 2);
        inventoryRepository.create({ productID: product.productID, size, stockQty, safetyStock });
      }
    });
  });

  const allUsers = userRepository.getAll();
  const usersByEmailLatest = allUsers.reduce((acc, user) => ({ ...acc, [user.email]: user }), {});
  const productsByName = productRows.reduce((acc, product) => ({ ...acc, [product.name]: product }), {});

  allUsers
    .filter((user) => user.role === 'customer')
    .forEach((user) => cartRepository.getByUserId(user.userID));

  const reviewKeys = reviewRepository
    .getAll()
    .reduce((acc, review) => ({ ...acc, [`${review.userName}|${review.productName}|${review.comment}`]: true }), {});

  reviewSeed.forEach((review) => {
    const user = usersByEmailLatest[review.email];
    const product = productsByName[review.product];
    const key = `${user?.name}|${review.product}|${review.comment}`;
    if (user && product && !reviewKeys[key]) {
      reviewRepository.create({
        userID: user.userID,
        productID: product.productID,
        rating: review.rating,
        comment: review.comment
      });
    }
  });
}

if (import.meta.url === `file://${process.argv[1]}`) {
  initializeDatabase();
  seedDatabaseIfEmpty();
  console.log('Database initialized and seeded successfully');
}

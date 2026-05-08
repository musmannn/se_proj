PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS Users (
  userID INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  passwordHash TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('customer', 'admin'))
);

CREATE TABLE IF NOT EXISTS Categories (
  categoryID INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  description TEXT
);

CREATE TABLE IF NOT EXISTS Products (
  productID INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  imageUrl TEXT,
  price REAL NOT NULL,
  fabric TEXT NOT NULL,
  cut TEXT NOT NULL CHECK(cut IN ('slim', 'athletic', 'regular')),
  season TEXT NOT NULL,
  gsm INTEGER NOT NULL,
  status TEXT NOT NULL CHECK(status IN ('new_arrival', 'active', 'discontinued')),
  categoryID INTEGER NOT NULL,
  FOREIGN KEY (categoryID) REFERENCES Categories(categoryID)
);

CREATE TABLE IF NOT EXISTS Inventory (
  inventoryID INTEGER PRIMARY KEY AUTOINCREMENT,
  productID INTEGER NOT NULL,
  size TEXT NOT NULL CHECK(size IN ('S', 'M', 'L', 'XL')),
  stockQty INTEGER NOT NULL DEFAULT 0,
  safetyStock INTEGER NOT NULL DEFAULT 0,
  UNIQUE(productID, size),
  FOREIGN KEY (productID) REFERENCES Products(productID)
);

CREATE TABLE IF NOT EXISTS Orders (
  orderID INTEGER PRIMARY KEY AUTOINCREMENT,
  userID INTEGER NOT NULL,
  orderDate TEXT NOT NULL,
  totalAmount REAL NOT NULL,
  status TEXT NOT NULL CHECK(status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  shippingAddr TEXT NOT NULL,
  FOREIGN KEY (userID) REFERENCES Users(userID)
);

CREATE TABLE IF NOT EXISTS OrderItems (
  orderItemID INTEGER PRIMARY KEY AUTOINCREMENT,
  orderID INTEGER NOT NULL,
  productID INTEGER NOT NULL,
  quantity INTEGER NOT NULL,
  unitPrice REAL NOT NULL,
  size TEXT NOT NULL CHECK(size IN ('S', 'M', 'L', 'XL')),
  FOREIGN KEY (orderID) REFERENCES Orders(orderID) ON DELETE CASCADE,
  FOREIGN KEY (productID) REFERENCES Products(productID)
);

CREATE TABLE IF NOT EXISTS Cart (
  cartID INTEGER PRIMARY KEY AUTOINCREMENT,
  userID INTEGER NOT NULL UNIQUE,
  createdAt TEXT NOT NULL,
  FOREIGN KEY (userID) REFERENCES Users(userID)
);

CREATE TABLE IF NOT EXISTS CartItems (
  cartItemID INTEGER PRIMARY KEY AUTOINCREMENT,
  cartID INTEGER NOT NULL,
  productID INTEGER NOT NULL,
  quantity INTEGER NOT NULL,
  size TEXT NOT NULL CHECK(size IN ('S', 'M', 'L', 'XL')),
  UNIQUE(cartID, productID, size),
  FOREIGN KEY (cartID) REFERENCES Cart(cartID) ON DELETE CASCADE,
  FOREIGN KEY (productID) REFERENCES Products(productID)
);

CREATE TABLE IF NOT EXISTS Reviews (
  reviewID INTEGER PRIMARY KEY AUTOINCREMENT,
  userID INTEGER NOT NULL,
  productID INTEGER NOT NULL,
  rating INTEGER NOT NULL CHECK(rating BETWEEN 1 AND 5),
  comment TEXT NOT NULL,
  reviewDate TEXT NOT NULL,
  FOREIGN KEY (userID) REFERENCES Users(userID),
  FOREIGN KEY (productID) REFERENCES Products(productID)
);

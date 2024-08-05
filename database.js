const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db'); // or use a file path like './database.db'

db.serialize(() => {
  // Create supplier table
  db.run(`
    CREATE TABLE IF NOT EXISTS supplier (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      adresse TEXT NOT NULL
    )
  `);

  // Create product table
  db.run(`
    CREATE TABLE IF NOT EXISTS product (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      bare_code TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      min_quantity INTEGER NOT NULL
    )
  `);

  // Create supply table
  db.run(`
    CREATE TABLE IF NOT EXISTS supply (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      amount REAL NOT NULL,
      description TEXT,
      supplier_id INTEGER,
      FOREIGN KEY (supplier_id) REFERENCES supplier(id)
    )
  `);

  // Create expenses table
  db.run(`
    CREATE TABLE IF NOT EXISTS expenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      description TEXT NOT NULL,
      amount REAL NOT NULL
    )
  `);

  // Create sale table
  db.run(`
    CREATE TABLE IF NOT EXISTS sale (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      amount REAL NOT NULL
    )
  `);

  // Create supply_product table for many-to-many relationship between supply and product
  db.run(`
    CREATE TABLE IF NOT EXISTS supply_product (
      supply_id INTEGER,
      product_id INTEGER,
      FOREIGN KEY (supply_id) REFERENCES supply(id),
      FOREIGN KEY (product_id) REFERENCES product(id),
      PRIMARY KEY (supply_id, product_id)
    )
  `);

  // Create sale_product table for many-to-many relationship between sale and product
  db.run(`
    CREATE TABLE IF NOT EXISTS sale_product (
      sale_id INTEGER,
      product_id INTEGER,
      FOREIGN KEY (sale_id) REFERENCES sale(id),
      FOREIGN KEY (product_id) REFERENCES product(id),
      PRIMARY KEY (sale_id, product_id)
    )
  `);
});

module.exports = db;

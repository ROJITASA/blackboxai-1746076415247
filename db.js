const Database = require('better-sqlite3');
const path = require('path');
const dbPath = path.join(__dirname, 'pos.db');

const db = new Database(dbPath);

// Initialize database schema
function init() {
  // Users table
  db.prepare(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL
    )
  `).run();

  // Products table
  db.prepare(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      barcode TEXT UNIQUE,
      stock INTEGER NOT NULL DEFAULT 0
    )
  `).run();

  // Clients table
  db.prepare(`
    CREATE TABLE IF NOT EXISTS clients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      address TEXT
    )
  `).run();

  // Sales table
  db.prepare(`
    CREATE TABLE IF NOT EXISTS sales (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      client_id INTEGER,
      user_id INTEGER,
      total REAL NOT NULL,
      date TEXT NOT NULL,
      status TEXT NOT NULL,
      is_quotation INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY(client_id) REFERENCES clients(id),
      FOREIGN KEY(user_id) REFERENCES users(id)
    )
  `).run();

  // Sale items table
  db.prepare(`
    CREATE TABLE IF NOT EXISTS sale_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sale_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      price REAL NOT NULL,
      FOREIGN KEY(sale_id) REFERENCES sales(id),
      FOREIGN KEY(product_id) REFERENCES products(id)
    )
  `).run();

  // Sales order structure table
  db.prepare(`
    CREATE TABLE IF NOT EXISTS order_structure (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      field_name TEXT NOT NULL,
      field_label TEXT NOT NULL,
      field_type TEXT NOT NULL,
      is_required INTEGER NOT NULL DEFAULT 1,
      position INTEGER NOT NULL
    )
  `).run();

  // Cash closing reports table
  db.prepare(`
    CREATE TABLE IF NOT EXISTS cash_closings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      date TEXT NOT NULL,
      total REAL NOT NULL,
      report_sent INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )
  `).run();
}

module.exports = {
  db,
  init,
};

const { db } = require('./db');

// Get all products
function getAllProducts() {
  const stmt = db.prepare('SELECT * FROM products ORDER BY name');
  return stmt.all();
}

// Get product by ID
function getProductById(id) {
  const stmt = db.prepare('SELECT * FROM products WHERE id = ?');
  return stmt.get(id);
}

// Add new product
function addProduct({ name, description, price, barcode, stock }) {
  const stmt = db.prepare('INSERT INTO products (name, description, price, barcode, stock) VALUES (?, ?, ?, ?, ?)');
  const info = stmt.run(name, description, price, barcode, stock);
  return info.lastInsertRowid;
}

// Update product
function updateProduct(id, { name, description, price, barcode, stock }) {
  const stmt = db.prepare('UPDATE products SET name = ?, description = ?, price = ?, barcode = ?, stock = ? WHERE id = ?');
  const info = stmt.run(name, description, price, barcode, stock, id);
  return info.changes;
}

// Delete product
function deleteProduct(id) {
  const stmt = db.prepare('DELETE FROM products WHERE id = ?');
  const info = stmt.run(id);
  return info.changes;
}

module.exports = {
  getAllProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
};

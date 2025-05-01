const bcrypt = require('bcrypt');
const { db } = require('./db');

const saltRounds = 10;

// Create a new user with hashed password
function createUser(username, password, role = 'user') {
  const hashedPassword = bcrypt.hashSync(password, saltRounds);
  const stmt = db.prepare('INSERT INTO users (username, password, role) VALUES (?, ?, ?)');
  try {
    const info = stmt.run(username, hashedPassword, role);
    return { success: true, userId: info.lastInsertRowid };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// Authenticate user by username and password
function authenticateUser(username, password) {
  const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
  const user = stmt.get(username);
  if (!user) {
    return { success: false, error: 'Usuario no encontrado' };
  }
  const match = bcrypt.compareSync(password, user.password);
  if (match) {
    return { success: true, user };
  } else {
    return { success: false, error: 'Contraseña incorrecta' };
  }
}

module.exports = {
  createUser,
  authenticateUser,
};

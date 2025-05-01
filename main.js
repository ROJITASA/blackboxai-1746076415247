const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.loadFile('index.html');
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

const { ipcMain } = require('electron');
const { ipcMain } = require('electron');
const { authenticateUser, createUser } = require('./auth');

const productModule = require('./products');
const { db } = require('./db');

// IPC handlers can be added here for communication between renderer and main process

ipcMain.handle('login', (event, { username, password }) => {
  const result = authenticateUser(username, password);
  return result;
});

// Product management IPC handlers
ipcMain.handle('get-products', () => {
  return productModule.getAllProducts();
});

ipcMain.handle('add-product', (event, product) => {
  return productModule.addProduct(product);
});

ipcMain.handle('update-product', (event, id, product) => {
  return productModule.updateProduct(id, product);
});

ipcMain.handle('delete-product', (event, id) => {
  return productModule.deleteProduct(id);
});

// For testing: create a default admin user if none exists
const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
if (userCount === 0) {
  createUser('admin', 'admin123', 'admin');
  console.log('Default admin user created: admin / admin123');
}

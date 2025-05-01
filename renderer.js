// Renderer process script for UI interaction and IPC communication

const { ipcRenderer } = require('electron');

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const loginSection = document.getElementById('login-section');
  const appSection = document.getElementById('app-section');

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = loginForm.username.value.trim();
    const password = loginForm.password.value.trim();

    if (!username || !password) {
      alert('Por favor, ingrese usuario y contraseña.');
      return;
    }

    try {
      const result = await ipcRenderer.invoke('login', { username, password });
      if (result.success) {
        loginSection.classList.add('hidden');
        appSection.classList.remove('hidden');
        loadMainApp(username);
      } else {
        alert(result.error || 'Error de autenticación');
      }
    } catch (err) {
      alert('Error al comunicarse con el sistema');
    }
  });

  function loadMainApp(username) {
    appSection.innerHTML = `
      <h2 class="text-2xl font-bold mb-4">Bienvenido, ${username}</h2>
      <p>Esta es la aplicación principal del sistema de punto de venta.</p>
      <!-- TODO: Load actual app modules here -->
    `;
  }
});

const API_URL = '/api';

const paginasPorRol = {
  candidato: 'perfil.html',
  empresa: 'empresa.html',
  admin: 'admin.html'
};

function obtenerSesion() {
  const sesion = localStorage.getItem('sesion');
  return sesion ? JSON.parse(sesion) : null;
}

function guardarSesion(sesion) {
  localStorage.setItem('sesion', JSON.stringify(sesion));
}

function cerrarSesion() {
  localStorage.removeItem('sesion');
  window.location.href = 'index.html';
}

function protegerPagina(rol) {
  const sesion = obtenerSesion();

  if (!sesion || sesion.usuario.rol !== rol) {
    window.location.href = 'login.html';
  }
}

async function peticion(ruta, opciones = {}) {
  const sesion = obtenerSesion();

  const headers = { 'Content-Type': 'application/json' };

  if (sesion) {
    headers.Authorization = `Bearer ${sesion.token}`;
  }

  const respuesta = await fetch(API_URL + ruta, { ...opciones, headers });

  const datos = await respuesta.json();

  if (respuesta.status === 401 && sesion) {
    cerrarSesion();
  }

  if (!respuesta.ok) {
    throw new Error(datos.errors ? datos.errors[0].msg : datos.message);
  }

  return datos;
}

function mostrarMensaje(contenedor, mensaje, tipo = 'danger') {
  contenedor.className = `mensaje alert alert-${tipo}`;
  contenedor.textContent = mensaje;
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.cerrar-sesion').forEach((enlace) => {
    enlace.addEventListener('click', (e) => {
      e.preventDefault();
      cerrarSesion();
    });
  });
});

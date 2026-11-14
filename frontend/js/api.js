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

function escaparHtml(texto) {
  const div = document.createElement('div');
  div.textContent = texto ?? '';
  return div.innerHTML;
}

function formatoFecha(fecha) {
  return new Date(fecha).toLocaleDateString('es-SV');
}

function mostrarMensaje(contenedor, mensaje, tipo = 'danger') {
  contenedor.className = `mensaje alert alert-${tipo}`;
  contenedor.textContent = mensaje;
}

function mostrarUsuarioEnMenu() {
  const sesion = obtenerSesion();

  const zonaBotones = document.querySelector('.navbar .collapse > .d-flex');

  if (!sesion || !zonaBotones) return;

  const { nombre, rol } = sesion.usuario;

  const panel = paginasPorRol[rol];

  const textoPanel = {
    candidato: 'Mi perfil',
    empresa: 'Mi empresa',
    admin: 'Panel administrativo'
  };

  document.querySelectorAll('.navbar .nav-link').forEach((enlace) => {
    if (enlace.textContent.trim() === 'Mi perfil') {
      enlace.href = panel;
      enlace.textContent = textoPanel[rol];
    }

    if (enlace.textContent.trim() === 'Publicar empleos' && rol === 'empresa') {
      enlace.href = panel;
    }
  });

  zonaBotones.innerHTML = `
    <div class="dropdown">
      <button class="btn btn-outline-light dropdown-toggle" type="button" data-bs-toggle="dropdown">
        <i class="bi bi-person-circle"></i> ${escaparHtml(nombre)}
      </button>
      <ul class="dropdown-menu dropdown-menu-end">
        <li><a class="dropdown-item" href="${panel}">${textoPanel[rol]}</a></li>
        <li><hr class="dropdown-divider"></li>
        <li><a class="dropdown-item text-danger cerrar-sesion" href="index.html">Cerrar sesión</a></li>
      </ul>
    </div>`;
}

document.addEventListener('DOMContentLoaded', () => {
  mostrarUsuarioEnMenu();

  document.querySelectorAll('.cerrar-sesion').forEach((enlace) => {
    enlace.addEventListener('click', (e) => {
      e.preventDefault();
      cerrarSesion();
    });
  });
});

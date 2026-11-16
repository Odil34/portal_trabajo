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
  if (!fecha) return 'No especificada';

  const valor = String(fecha);
  const fechaLocal = /^\d{4}-\d{2}-\d{2}$/.test(valor)
    ? new Date(`${valor}T00:00:00`)
    : new Date(valor);

  return Number.isNaN(fechaLocal.getTime())
    ? 'No especificada'
    : fechaLocal.toLocaleDateString('es-SV');
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


function crearSelectorBuscable(contenedorId, opciones = [], configuracion = {}) {
  const contenedor = document.getElementById(contenedorId);
  if (!contenedor) return null;

  const entrada = contenedor.querySelector('.catalogo-entrada');
  const valorOculto = contenedor.querySelector('input[type="hidden"]');
  const lista = contenedor.querySelector('.catalogo-opciones');
  const textoVacio = configuracion.textoVacio || 'No se encontraron opciones';
  let elementos = ordenarOpciones(opciones);

  function normalizar(texto) {
    return String(texto || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLocaleLowerCase('es')
      .trim();
  }

  function cerrar() {
    lista.classList.remove('mostrar');
    entrada.setAttribute('aria-expanded', 'false');
  }

  function seleccionar(opcion) {
    entrada.value = opcion.label;
    valorOculto.value = opcion.value;
    cerrar();
    if (typeof configuracion.alSeleccionar === 'function') {
      configuracion.alSeleccionar(opcion);
    }
  }

  function mostrar() {
    const busqueda = normalizar(entrada.value);
    const filtradas = elementos.filter(opcion => normalizar(opcion.label).includes(busqueda));
    lista.innerHTML = '';

    if (!filtradas.length) {
      const vacio = document.createElement('div');
      vacio.className = 'catalogo-sin-resultados';
      vacio.textContent = textoVacio;
      lista.appendChild(vacio);
    } else {
      filtradas.forEach(opcion => {
        const boton = document.createElement('button');
        boton.type = 'button';
        boton.className = 'catalogo-opcion';
        boton.setAttribute('role', 'option');
        boton.textContent = opcion.label;
        boton.addEventListener('click', () => seleccionar(opcion));
        lista.appendChild(boton);
      });
    }

    lista.classList.add('mostrar');
    entrada.setAttribute('aria-expanded', 'true');
  }

  entrada.addEventListener('focus', mostrar);
  entrada.addEventListener('input', () => {
    valorOculto.value = '';
    mostrar();
  });
  entrada.addEventListener('keydown', evento => {
    if (evento.key === 'Escape') cerrar();
    if (evento.key === 'Enter' && lista.classList.contains('mostrar')) {
      const primeraOpcion = lista.querySelector('.catalogo-opcion');
      if (primeraOpcion) {
        evento.preventDefault();
        primeraOpcion.click();
      }
    }
  });

  document.addEventListener('click', evento => {
    if (!contenedor.contains(evento.target)) cerrar();
  });

  const selector = {
    actualizar(nuevasOpciones, valor = '') {
      elementos = ordenarOpciones(nuevasOpciones);
      entrada.disabled = false;
      entrada.placeholder = 'Escribe para buscar...';
      selector.limpiar();
      if (valor) {
        const encontrado = elementos.find(opcion => normalizar(opcion.value) === normalizar(valor));
        if (encontrado) seleccionar(encontrado);
      }
    },
    seleccionarValor(valor) {
      const encontrado = elementos.find(opcion => normalizar(opcion.value) === normalizar(valor));
      if (encontrado) seleccionar(encontrado);
    },
    limpiar() {
      entrada.value = '';
      valorOculto.value = '';
      cerrar();
    },
    deshabilitar(mensaje = 'Primero selecciona una opción anterior') {
      selector.limpiar();
      entrada.disabled = true;
      entrada.placeholder = mensaje;
    },
    habilitar() {
      entrada.disabled = false;
      entrada.placeholder = 'Escribe para buscar...';
    }
  };

  if (configuracion.deshabilitado) selector.deshabilitar();
  return selector;
}

function ordenarOpciones(opciones) {
  return [...opciones].sort((a, b) => {
    if (a.value === '') return -1;
    if (b.value === '') return 1;
    return a.label.localeCompare(b.label, 'es', { sensitivity: 'base' });
  });
}

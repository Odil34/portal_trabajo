const mensajeAdmin = document.querySelector('#mensajeAdmin');

const estados = {
  activo: ['Activo', 'bg-success'],
  suspendido: ['Suspendido', 'bg-danger'],
  pendiente: ['Pendiente', 'bg-warning text-dark'],
  verificada: ['Verificada', 'bg-success'],
  rechazada: ['Rechazada', 'bg-secondary'],
  suspendida: ['Suspendida', 'bg-danger'],
  en_revision: ['En revisión', 'bg-warning text-dark'],
  activa: ['Activa', 'bg-success'],
  inactiva: ['Inactiva', 'bg-secondary'],
  cancelada: ['Cancelada', 'bg-dark']
};

const roles = {
  admin: 'Administrador',
  candidato: 'Candidato',
  empresa: 'Empresa'
};

function etiqueta(estado) {
  const [texto, clase] = estados[estado];
  return `<span class="badge ${clase}">${texto}</span>`;
}

function boton(texto, clase, accion, id, estado, confirmar = '') {
  return `<button class="btn btn-sm ${clase}" data-accion="${accion}" data-id="${id}" data-estado="${estado}" data-confirmar="${escaparHtml(confirmar).replace(/"/g, '&quot;')}">${texto}</button>`;
}

async function cargarResumen() {
  const { totales, actividad, porSector, mes } = await peticion('/admin/resumen');

  document.querySelector('#totalUsuarios').textContent = totales.usuarios;
  document.querySelector('#totalEmpresas').textContent = totales.empresas;
  document.querySelector('#totalOfertas').textContent = totales.ofertasActivas;
  document.querySelector('#totalModerar').textContent = totales.valoracionesPendientes;

  document.querySelector('#pendEmpresas').textContent = totales.empresasPendientes;
  document.querySelector('#pendOfertas').textContent = totales.ofertasPendientes;
  document.querySelector('#pendValoraciones').textContent = totales.valoracionesPendientes;

  document.querySelector('#listaActividad').innerHTML = actividad.map((item) => `
    <li class="list-group-item d-flex justify-content-between gap-2">
      <span>${escaparHtml(item.descripcion)}</span>
      <span class="text-muted text-nowrap">${formatoFecha(item.fecha)}</span>
    </li>`).join('') || '<li class="list-group-item text-muted">Sin actividad</li>';

  const maximo = Math.max(1, ...porSector.map((s) => s.total));

  document.querySelector('#graficaSectores').innerHTML = porSector.map((s) => `
    <p class="small mb-1">${escaparHtml(s.sector)} (${s.total})</p>
    <div class="progress mb-2"><div class="progress-bar" style="width: ${(s.total / maximo) * 100}%"></div></div>`).join('') || '<p class="text-muted small">No hay vacantes activas</p>';

  document.querySelector('#mesCandidatos').textContent = mes.candidatos;
  document.querySelector('#mesEmpresas').textContent = mes.empresas;
  document.querySelector('#mesPostulaciones').textContent = mes.postulaciones;
  document.querySelector('#mesContrataciones').textContent = mes.contrataciones;
}

async function cargarUsuarios(buscar = '') {
  const usuarios = await peticion(`/admin/usuarios?buscar=${encodeURIComponent(buscar)}`);

  const miId = obtenerSesion().usuario.usuarioId;

  document.querySelector('#tablaUsuarios').innerHTML = usuarios.map((u) => {
    let acciones = '';

    if (u.usuarioId !== miId) {
      acciones = u.estado === 'activo'
        ? boton('Suspender', 'btn-outline-danger', 'usuario', u.usuarioId, 'suspendido', `¿Suspender a ${u.nombre}? Ya no podrá iniciar sesión.`)
        : boton('Reactivar', 'btn-outline-success', 'usuario', u.usuarioId, 'activo');
    }

    return `<tr>
      <td>${escaparHtml(u.nombre)}</td>
      <td>${escaparHtml(u.correo)}</td>
      <td>${roles[u.rol]}</td>
      <td>${formatoFecha(u.fechaRegistro)}</td>
      <td>${etiqueta(u.estado)}</td>
      <td>${acciones}</td>
    </tr>`;
  }).join('') || '<tr><td colspan="6" class="text-muted">No se encontraron usuarios</td></tr>';
}

async function cargarEmpresas() {
  const empresas = await peticion('/admin/empresas');

  document.querySelector('#tablaEmpresas').innerHTML = empresas.map((e) => {
    let acciones = '';

    if (e.estado === 'pendiente') {
      acciones = boton('Aprobar', 'btn-success', 'empresa', e.empresaId, 'verificada') + ' '
        + boton('Rechazar', 'btn-outline-danger', 'empresa', e.empresaId, 'rechazada', `¿Rechazar a ${e.nombre}?`);
    } else if (e.estado === 'verificada') {
      acciones = boton('Suspender', 'btn-outline-danger', 'empresa', e.empresaId, 'suspendida', `¿Suspender a ${e.nombre}?`);
    } else {
      acciones = boton('Verificar', 'btn-outline-success', 'empresa', e.empresaId, 'verificada');
    }

    return `<tr>
      <td>${escaparHtml(e.nombre)}</td>
      <td>${escaparHtml(e.nit)}</td>
      <td>${escaparHtml(e.sector)}</td>
      <td>${escaparHtml(e.personaContacto)}<br><small class="text-muted">${escaparHtml(e.correoContacto)}</small></td>
      <td>${e.ofertas}</td>
      <td>${etiqueta(e.estado)}</td>
      <td class="text-nowrap">${acciones}</td>
    </tr>`;
  }).join('');
}

async function cargarOfertas() {
  const ofertas = await peticion('/admin/ofertas');

  document.querySelector('#tablaOfertas').innerHTML = ofertas.map((o) => {
    let acciones = `<a href="oferta-detalle.html?id=${o.ofertaId}" class="btn btn-sm btn-outline-primary">Ver</a> `;

    if (o.estado === 'en_revision') {
      acciones += boton('Aprobar', 'btn-success', 'oferta', o.ofertaId, 'activa') + ' '
        + boton('Rechazar', 'btn-outline-danger', 'oferta', o.ofertaId, 'rechazada', `¿Rechazar la oferta ${o.titulo}?`) + ' ';
    }

    acciones += boton('<i class="bi bi-trash"></i>', 'btn-danger', 'eliminar-oferta', o.ofertaId, '', `¿Eliminar la oferta ${o.titulo}? También se borrarán sus postulaciones.`);

    return `<tr>
      <td>${escaparHtml(o.titulo)}</td>
      <td>${escaparHtml(o.empresa)}</td>
      <td>${formatoFecha(o.fechaPublicacion)}</td>
      <td>${o.postulaciones}</td>
      <td>${etiqueta(o.estado)}</td>
      <td class="text-nowrap">${acciones}</td>
    </tr>`;
  }).join('');
}

async function cargarValoraciones() {
  const valoraciones = await peticion('/admin/valoraciones');

  document.querySelector('#listaValoraciones').innerHTML = valoraciones.map((v) => {
    const esNueva = v.estado === 'pendiente';

    const motivo = esNueva
      ? '<span class="badge bg-warning text-dark">Nueva</span>'
      : `<span class="badge bg-danger">Reportada ${v.reportes} ${v.reportes === 1 ? 'vez' : 'veces'}</span>`;

    const acciones = esNueva
      ? boton('Rechazar', 'btn-outline-danger', 'valoracion', v.valoracionId, 'oculta') + ' ' + boton('Aprobar', 'btn-success', 'valoracion', v.valoracionId, 'publicada')
      : boton('Ignorar reporte', 'btn-outline-secondary', 'valoracion', v.valoracionId, 'publicada') + ' ' + boton('Ocultar', 'btn-danger', 'valoracion', v.valoracionId, 'oculta');

    return `<div class="card p-3 mb-3">
      <div class="d-flex justify-content-between">
        <strong>Valoración sobre ${escaparHtml(v.empresa)}</strong>
        ${motivo}
      </div>
      <small class="text-muted">Autor: ${escaparHtml(v.autor)}${v.anonimo ? ' (publica como anónimo)' : ''} · ${formatoFecha(v.fecha)}</small>
      <p class="my-2"><span class="estrellas">${'★'.repeat(v.calificacion)}${'☆'.repeat(5 - v.calificacion)}</span> "${escaparHtml(v.comentario)}"</p>
      <div>${acciones}</div>
    </div>`;
  }).join('') || '<p class="text-muted">No hay contenido pendiente de moderar.</p>';
}

async function cargarTodo() {
  try {
    const buscar = document.querySelector('#formBuscarUsuario').buscar.value;
    await Promise.all([cargarResumen(), cargarUsuarios(buscar), cargarEmpresas(), cargarOfertas(), cargarValoraciones()]);
  } catch (error) {
    mostrarMensaje(mensajeAdmin, error.message);
  }
}

const rutasAcciones = {
  usuario: (id, estado) => peticion(`/admin/usuarios/${id}/estado`, { method: 'PATCH', body: JSON.stringify({ estado }) }),
  empresa: (id, estado) => peticion(`/admin/empresas/${id}/estado`, { method: 'PATCH', body: JSON.stringify({ estado }) }),
  oferta: (id, estado) => peticion(`/admin/ofertas/${id}/estado`, { method: 'PATCH', body: JSON.stringify({ estado }) }),
  'eliminar-oferta': (id) => peticion(`/admin/ofertas/${id}`, { method: 'DELETE' }),
  valoracion: (id, estado) => peticion(`/admin/valoraciones/${id}/estado`, { method: 'PATCH', body: JSON.stringify({ estado }) })
};

document.addEventListener('click', async (e) => {
  const boton = e.target.closest('[data-accion]');

  if (!boton) return;

  const { accion, id, estado, confirmar } = boton.dataset;

  if (confirmar && !confirm(confirmar)) return;

  try {
    boton.disabled = true;
    await rutasAcciones[accion](id, estado);
    mostrarMensaje(mensajeAdmin, 'Cambio guardado correctamente', 'success');
    await cargarTodo();
  } catch (error) {
    mostrarMensaje(mensajeAdmin, error.message);
    boton.disabled = false;
  }
});

document.querySelector('#formBuscarUsuario').addEventListener('submit', async (e) => {
  e.preventDefault();

  try {
    await cargarUsuarios(e.target.buscar.value);
  } catch (error) {
    mostrarMensaje(mensajeAdmin, error.message);
  }
});

document.querySelector('#formNuevoAdmin').addEventListener('submit', async (e) => {
  e.preventDefault();

  const form = e.target;

  const datos = Object.fromEntries(new FormData(form));

  try {
    await peticion('/admin/usuarios', { method: 'POST', body: JSON.stringify(datos) });

    form.reset();
    form.querySelector('.mensaje').className = 'mensaje d-none';
    bootstrap.Modal.getInstance(document.querySelector('#modalAdmin')).hide();

    mostrarMensaje(mensajeAdmin, 'Administrador creado correctamente', 'success');
    await cargarTodo();
  } catch (error) {
    mostrarMensaje(form.querySelector('.mensaje'), error.message);
  }
});

const sesion = obtenerSesion();

if (sesion) {
  document.querySelector('#nombreAdmin').textContent = sesion.usuario.nombre;
  cargarTodo();
}

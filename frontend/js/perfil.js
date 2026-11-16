const badgesEstado = {
  enviada: '<span class="badge bg-info text-dark">Enviada</span>',
  en_revision: '<span class="badge bg-warning text-dark">En revisión</span>',
  aceptada: '<span class="badge bg-success">Aceptada</span>',
  rechazada: '<span class="badge bg-danger">Rechazada</span>'
};

function actualizarEncabezadoPerfil(perfil) {
  const nombreCompleto = `${perfil.nombres} ${perfil.apellidos}`.trim();
  const iniciales = `${perfil.nombres?.[0] || ''}${perfil.apellidos?.[0] || ''}`.toUpperCase();

  document.getElementById('navNombreUsuario').innerHTML = `<i class="bi bi-person-circle"></i> ${nombreCompleto}`;
  document.getElementById('avatarIniciales').textContent = iniciales || 'US';
  document.getElementById('sidebarNombre').textContent = nombreCompleto;
  document.getElementById('sidebarTitulo').textContent = perfil.titulo || perfil.areaInteres || 'Candidato';
  document.getElementById('saludoUsuario').textContent = `Hola, ${perfil.nombres}`;
}

async function cargarPerfil() {
  const perfil = await peticion('/candidato/perfil');

  actualizarEncabezadoPerfil(perfil);

  document.getElementById('nombres').value = perfil.nombres || '';
  document.getElementById('apellidos').value = perfil.apellidos || '';
  document.getElementById('correo').value = perfil.correo || '';
  document.getElementById('telefono').value = perfil.telefono || '';
  document.getElementById('titulo').value = perfil.titulo || '';
  document.getElementById('resumen').value = perfil.resumen || '';

  const selectArea = document.getElementById('areaInteres');
  if (perfil.areaInteres) {
    const existeArea = Array.from(selectArea.options).some((opt) => opt.value === perfil.areaInteres);
    if (!existeArea) {
      selectArea.add(new Option(perfil.areaInteres, perfil.areaInteres));
    }
    selectArea.value = perfil.areaInteres;
  }

  if (perfil.experiencia) {
    document.getElementById('experiencia').value = perfil.experiencia;
  }

  const cvTexto = document.getElementById('cvActualTexto');
  if (perfil.cv) {
    cvTexto.innerHTML = `<i class="bi bi-file-earmark-pdf text-danger"></i> ${perfil.cv}`;
  } else {
    cvTexto.textContent = 'Sin archivo cargado';
  }
}

async function cargarDashboard() {
  const indicadores = await peticion('/candidato/dashboard');

  document.getElementById('statVisitas').textContent = indicadores.visitas.toLocaleString('es-SV');
  document.getElementById('statSolicitudes').textContent = indicadores.solicitudes;
  document.getElementById('statAceptadas').textContent = indicadores.aceptadas;
}

async function cargarMisSolicitudes() {
  const tbody = document.getElementById('tablaSolicitudes');
  const postulaciones = await peticion('/postulaciones/mias');

  if (postulaciones.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="4" class="text-center text-muted py-3">Aún no has enviado postulaciones.</td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = postulaciones
    .map((item) => {
      const fecha = new Date(item.fechaPostulacion).toLocaleDateString('es-SV');
      const badge = badgesEstado[item.estado] || `<span class="badge bg-secondary">${item.estado}</span>`;

      return `
        <tr>
          <td><a href="oferta-detalle.html?id=${item.ofertaId}">${item.titulo}</a></td>
          <td>${item.empresa}</td>
          <td>${fecha}</td>
          <td>${badge}</td>
        </tr>
      `;
    })
    .join('');
}

document.addEventListener('DOMContentLoaded', async () => {
  const mensajeDiv = document.getElementById('mensajePerfil');

  try {
    await Promise.all([cargarPerfil(), cargarDashboard(), cargarMisSolicitudes()]);
  } catch (error) {
    mostrarMensaje(mensajeDiv, error.message, 'danger');
  }

  document.getElementById('formPerfil').addEventListener('submit', async (e) => {
    e.preventDefault();

    const archivoCv = document.getElementById('cvArchivo').files[0];

    const datos = {
      nombres: document.getElementById('nombres').value.trim(),
      apellidos: document.getElementById('apellidos').value.trim(),
      telefono: document.getElementById('telefono').value.trim(),
      titulo: document.getElementById('titulo').value.trim(),
      areaInteres: document.getElementById('areaInteres').value,
      experiencia: document.getElementById('experiencia').value,
      resumen: document.getElementById('resumen').value.trim(),
      cv: archivoCv ? archivoCv.name : null
    };

    try {
      const perfilActualizado = await peticion('/candidato/perfil', {
        method: 'PUT',
        body: JSON.stringify(datos)
      });

      actualizarEncabezadoPerfil(perfilActualizado);

      if (perfilActualizado.cv) {
        document.getElementById('cvActualTexto').innerHTML =
          `<i class="bi bi-file-earmark-pdf text-danger"></i> ${perfilActualizado.cv}`;
      }

      const sesion = obtenerSesion();
      if (sesion) {
        sesion.usuario.nombre = `${perfilActualizado.nombres} ${perfilActualizado.apellidos}`.trim();
        guardarSesion(sesion);
      }

      mostrarMensaje(mensajeDiv, 'Perfil actualizado correctamente', 'success');
    } catch (error) {
      mostrarMensaje(mensajeDiv, error.message, 'danger');
    }
  });
});
const estadosValoracion = {
  pendiente: '<span class="badge bg-warning text-dark">En revisión</span>',
  publicada: '<span class="badge bg-success">Publicada</span>',
  oculta: '<span class="badge bg-secondary">No publicada</span>'
};

async function cargarEmpresasValorar() {
  const empresas = await peticion('/valoraciones');
  const select = document.getElementById('empresaValoracion');

  select.innerHTML = '<option value="">Selecciona...</option>' + empresas
    .map((e) => `<option value="${e.empresaId}">${escaparHtml(e.nombre)}</option>`)
    .join('');
}

async function cargarMisValoraciones() {
  const valoraciones = await peticion('/valoraciones/mias');
  const lista = document.getElementById('listaMisValoraciones');

  if (valoraciones.length === 0) {
    lista.innerHTML = '<p class="text-muted mb-0">Aún no has valorado ninguna empresa.</p>';
    return;
  }

  lista.innerHTML = valoraciones.map((v) => `
    <div class="border-bottom py-2">
      <strong>${escaparHtml(v.empresa)}</strong>
      <span class="estrellas">${'★'.repeat(v.calificacion)}${'☆'.repeat(5 - v.calificacion)}</span>
      ${estadosValoracion[v.estado]}
      <p class="small text-muted mb-0">${escaparHtml(v.comentario)}${v.anonimo ? ' (anónimo)' : ''}</p>
    </div>`).join('');
}

document.addEventListener('DOMContentLoaded', async () => {
  const mensaje = document.getElementById('mensajeValoracion');

  if (window.location.hash === '#valoraciones') {
    bootstrap.Tab.getOrCreateInstance(document.querySelector('[data-bs-target="#valoraciones"]')).show();
  }

  try {
    await Promise.all([cargarEmpresasValorar(), cargarMisValoraciones()]);
  } catch (error) {
    mostrarMensaje(mensaje, error.message);
  }

  document.getElementById('formValoracion').addEventListener('submit', async (e) => {
    e.preventDefault();

    const datos = {
      empresaId: Number(document.getElementById('empresaValoracion').value),
      calificacion: Number(document.getElementById('calificacionValoracion').value),
      comentario: document.getElementById('comentarioValoracion').value.trim(),
      anonimo: document.getElementById('anonimo').checked
    };

    try {
      await peticion('/valoraciones', { method: 'POST', body: JSON.stringify(datos) });
      e.target.reset();
      mostrarMensaje(mensaje, 'Valoración enviada. Se publicará cuando el administrador la apruebe.', 'success');
      await cargarMisValoraciones();
    } catch (error) {
      mostrarMensaje(mensaje, error.message);
    }
  });
});

function enlaceBusquedaAlerta(alerta) {
  const parametros = new URLSearchParams({ buscar: alerta.palabraClave });

  if (alerta.ubicacion === 'Remoto') parametros.set('modalidad', 'Remoto');
  else if (alerta.ubicacion !== 'Todo el país') parametros.set('departamento', alerta.ubicacion);

  return `busqueda.html?${parametros.toString()}`;
}

async function cargarUbicacionesAlerta() {
  const catalogos = await peticion('/ofertas/catalogos');
  const select = document.getElementById('alertaUbicacion');

  select.innerHTML = '<option>Todo el país</option><option>Remoto</option>' + catalogos.departamentos
    .map((d) => `<option>${escaparHtml(d.nombre)}</option>`)
    .join('');
}

async function cargarAlertas() {
  const alertas = await peticion('/candidato/alertas');
  const lista = document.getElementById('listaAlertas');

  if (alertas.length === 0) {
    lista.innerHTML = '<p class="text-muted mb-0">Aún no tienes alertas.</p>';
    return;
  }

  lista.innerHTML = alertas.map((a) => {
    const medios = [a.porCorreo ? 'Correo' : '', a.porSms ? 'SMS' : ''].filter(Boolean).join(' y ');

    return `<div class="d-flex justify-content-between align-items-start border-bottom py-2 gap-2">
      <div>
        <strong>${escaparHtml(a.palabraClave)}</strong>
        <small class="d-block text-muted">${escaparHtml(a.ubicacion)} · ${a.frecuencia} · ${medios}</small>
        <a href="${enlaceBusquedaAlerta(a)}" class="small">${a.coincidencias} ${a.coincidencias === 1 ? 'oferta coincide' : 'ofertas coinciden'}</a>
      </div>
      <div class="d-flex align-items-center gap-2">
        <div class="form-check form-switch mb-0">
          <input class="form-check-input" type="checkbox" data-alerta="${a.alertaId}" ${a.activa ? 'checked' : ''} title="Activar o pausar">
        </div>
        <button class="btn btn-sm btn-outline-danger" data-eliminar-alerta="${a.alertaId}" title="Eliminar"><i class="bi bi-trash"></i></button>
      </div>
    </div>`;
  }).join('');
}

document.addEventListener('DOMContentLoaded', async () => {
  const mensajeLista = document.getElementById('mensajeAlertas');
  const mensajeForm = document.getElementById('mensajeAlerta');

  try {
    await Promise.all([cargarUbicacionesAlerta(), cargarAlertas()]);
  } catch (error) {
    mostrarMensaje(mensajeLista, error.message);
  }

  document.getElementById('formAlerta').addEventListener('submit', async (e) => {
    e.preventDefault();

    const datos = {
      palabraClave: document.getElementById('alertaPalabra').value.trim(),
      ubicacion: document.getElementById('alertaUbicacion').value,
      frecuencia: document.getElementById('alertaFrecuencia').value,
      porCorreo: document.getElementById('porCorreo').checked,
      porSms: document.getElementById('porSms').checked
    };

    try {
      await peticion('/candidato/alertas', { method: 'POST', body: JSON.stringify(datos) });
      e.target.reset();
      mostrarMensaje(mensajeForm, 'Alerta creada correctamente', 'success');
      await cargarAlertas();
    } catch (error) {
      mostrarMensaje(mensajeForm, error.message);
    }
  });

  document.getElementById('listaAlertas').addEventListener('change', async (e) => {
    const id = e.target.dataset.alerta;
    if (!id) return;

    try {
      await peticion(`/candidato/alertas/${id}`, { method: 'PATCH', body: JSON.stringify({ activa: e.target.checked }) });
      mostrarMensaje(mensajeLista, e.target.checked ? 'Alerta activada' : 'Alerta pausada', 'success');
    } catch (error) {
      e.target.checked = !e.target.checked;
      mostrarMensaje(mensajeLista, error.message);
    }
  });

  document.getElementById('listaAlertas').addEventListener('click', async (e) => {
    const boton = e.target.closest('[data-eliminar-alerta]');
    if (!boton) return;

    if (!confirm('¿Eliminar esta alerta?')) return;

    try {
      await peticion(`/candidato/alertas/${boton.dataset.eliminarAlerta}`, { method: 'DELETE' });
      mostrarMensaje(mensajeLista, 'Alerta eliminada correctamente', 'success');
      await cargarAlertas();
    } catch (error) {
      mostrarMensaje(mensajeLista, error.message);
    }
  });
});

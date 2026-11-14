const badgesPostulacion = {
  enviada: '<span class="badge bg-info text-dark">Enviada</span>',
  en_revision: '<span class="badge bg-warning text-dark">En revisión</span>',
  aceptada: '<span class="badge bg-success">Aceptada</span>',
  rechazada: '<span class="badge bg-danger">Rechazada</span>'
};

let postulacionActualId = null;

async function cargarSelectorOfertas() {
  const select = document.getElementById('selectOfertasPostulaciones');
  let ofertas = [];

  try {
    ofertas = await peticion('/empresa/ofertas');
  } catch (error) {
    // Respaldo temporal mientras se une la rama feature/empresa
    const sesion = obtenerSesion();
    if (sesion?.usuario?.empresaId === 2) {
      ofertas = [
        { ofertaId: 5, titulo: 'Desarrollador Backend Java' },
        { ofertaId: 6, titulo: 'Analista de Créditos' }
      ];
    } else {
      ofertas = [
        { ofertaId: 1, titulo: 'Desarrollador Web Full Stack' },
        { ofertaId: 2, titulo: 'Analista de Calidad' },
        { ofertaId: 3, titulo: 'Diseñador Gráfico' },
        { ofertaId: 4, titulo: 'Desarrollador Backend' }
      ];
    }
  }

  if (!ofertas || ofertas.length === 0) {
    select.innerHTML = '<option value="">No tienes ofertas publicadas</option>';
    return null;
  }

  select.innerHTML = ofertas
    .map((o) => `<option value="${o.ofertaId}">${o.titulo}</option>`)
    .join('');

  return select.value;
}

async function cargarAplicantes(ofertaId) {
  const tbody = document.getElementById('tablaAplicantes');

  if (!ofertaId) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" class="text-center text-muted py-3">No hay ofertas disponibles.</td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = `
    <tr>
      <td colspan="5" class="text-center text-muted py-3">Cargando aplicantes...</td>
    </tr>
  `;

  const aplicantes = await peticion(`/postulaciones/oferta/${ofertaId}`);

  if (aplicantes.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" class="text-center text-muted py-3">Aún no hay candidatos postulados a esta oferta.</td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = aplicantes
    .map((item) => {
      const nombreCompleto = `${item.nombres} ${item.apellidos}`.trim();
      const iniciales = `${item.nombres?.[0] || ''}${item.apellidos?.[0] || ''}`.toUpperCase();
      const fecha = new Date(item.fechaPostulacion).toLocaleDateString('es-SV');
      const badge = badgesPostulacion[item.estado] || `<span class="badge bg-secondary">${item.estado}</span>`;

      return `
        <tr>
          <td>
            <div class="d-flex align-items-center gap-2">
              <div class="avatar">${iniciales}</div>
              <div>
                <div>${nombreCompleto}</div>
                <small class="text-muted">${item.titulo || item.areaInteres || ''}</small>
              </div>
            </div>
          </td>
          <td>${item.experiencia || 'No especificada'}</td>
          <td>${fecha}</td>
          <td>${badge}</td>
          <td class="text-end">
            <button type="button" class="btn btn-sm btn-azul btn-ver-perfil" data-id="${item.postulacionId}">
              Ver perfil
            </button>
          </td>
        </tr>
      `;
    })
    .join('');
}

async function abrirDetalleCandidato(postulacionId) {
  const mensajeModal = document.getElementById('mensajeModalCandidato');
  mensajeModal.className = '';
  mensajeModal.textContent = '';

  const detalle = await peticion(`/postulaciones/${postulacionId}`);
  postulacionActualId = postulacionId;

  document.getElementById('detalleNombre').textContent = `${detalle.nombres} ${detalle.apellidos}`.trim();
  document.getElementById('detalleSubtitulo').textContent = `${detalle.titulo || 'Candidato'} · ${detalle.areaInteres}`;
  document.getElementById('detalleEstadoBadge').innerHTML =
    badgesPostulacion[detalle.estado] || `<span class="badge bg-secondary">${detalle.estado}</span>`;
  document.getElementById('detalleCorreo').textContent = detalle.correo || 'No disponible';
  document.getElementById('detalleTelefono').textContent = detalle.telefono || 'No registrado';
  document.getElementById('detalleExperiencia').textContent = detalle.experiencia || 'No especificada';
  document.getElementById('detalleResumen').textContent = detalle.resumen || 'Sin resumen profesional.';
  document.getElementById('detalleCarta').textContent =
    detalle.cartaPresentacion || 'El candidato no incluyó carta de presentación.';

  const cvEl = document.getElementById('detalleCv');
  if (detalle.cv) {
    cvEl.innerHTML = `<i class="bi bi-file-earmark-pdf text-danger"></i> Currículum adjunto: <strong>${detalle.cv}</strong>`;
  } else {
    cvEl.innerHTML = '<span class="text-muted"><i class="bi bi-file-earmark"></i> Sin currículum adjunto</span>';
  }

  const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('modalCandidato'));
  modal.show();
}

async function cambiarEstadoPostulacion(nuevoEstado) {
  if (!postulacionActualId) return;

  const mensajePrincipal = document.getElementById('mensajePostulaciones');
  const mensajeModal = document.getElementById('mensajeModalCandidato');
  const btnAceptar = document.getElementById('btnAceptarPostulacion');
  const btnRechazar = document.getElementById('btnRechazarPostulacion');

  btnAceptar.disabled = true;
  btnRechazar.disabled = true;

  try {
    await peticion(`/postulaciones/${postulacionActualId}/estado`, {
      method: 'PATCH',
      body: JSON.stringify({ estado: nuevoEstado })
    });

    const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('modalCandidato'));
    modal.hide();

    const textoEstado = nuevoEstado === 'aceptada' ? 'aceptada' : 'rechazada';
    mostrarMensaje(mensajePrincipal, `Postulación ${textoEstado} correctamente.`, 'success');

    const ofertaSeleccionada = document.getElementById('selectOfertasPostulaciones').value;
    await cargarAplicantes(ofertaSeleccionada);
  } catch (error) {
    mostrarMensaje(mensajeModal, error.message, 'danger');
  } finally {
    btnAceptar.disabled = false;
    btnRechazar.disabled = false;
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const select = document.getElementById('selectOfertasPostulaciones');
  const tbody = document.getElementById('tablaAplicantes');
  const mensajePrincipal = document.getElementById('mensajePostulaciones');

  if (!select || !tbody) return;

  try {
    const ofertaInicialId = await cargarSelectorOfertas();
    await cargarAplicantes(ofertaInicialId);
  } catch (error) {
    mostrarMensaje(mensajePrincipal, error.message, 'danger');
  }

  select.addEventListener('change', async () => {
    mensajePrincipal.className = '';
    mensajePrincipal.textContent = '';

    try {
      await cargarAplicantes(select.value);
    } catch (error) {
      mostrarMensaje(mensajePrincipal, error.message, 'danger');
    }
  });

  tbody.addEventListener('click', async (e) => {
    const btn = e.target.closest('.btn-ver-perfil');
    if (!btn) return;

    try {
      await abrirDetalleCandidato(btn.dataset.id);
    } catch (error) {
      mostrarMensaje(mensajePrincipal, error.message, 'danger');
    }
  });

  document.getElementById('btnAceptarPostulacion').addEventListener('click', () => {
    cambiarEstadoPostulacion('aceptada');
  });

  document.getElementById('btnRechazarPostulacion').addEventListener('click', () => {
    cambiarEstadoPostulacion('rechazada');
  });
});
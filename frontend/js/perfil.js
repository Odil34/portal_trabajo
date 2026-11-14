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
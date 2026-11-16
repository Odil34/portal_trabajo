const estadosOferta = {
  en_revision: ['En revisión', 'bg-warning text-dark'],
  activa: ['Activa', 'bg-success'],
  inactiva: ['Inactiva', 'bg-secondary'],
  cancelada: ['Cancelada', 'bg-dark'],
  rechazada: ['Rechazada', 'bg-danger']
};

let misOfertas = [];
let catalogos = { departamentos: [], distritos: [] };
let selectorDepartamento = null;
let selectorMunicipio = null;
let selectorDistrito = null;

function etiquetaOferta(estado) {
  const [texto, clase] = estadosOferta[estado];
  return `<span class="badge ${clase}">${texto}</span>`;
}

async function cargarPanel() {
  const datos = await peticion('/empresa/dashboard');

  document.querySelector('#nombreEmpresa').textContent = datos.nombre;
  document.querySelector('#contactoEmpresa').textContent = datos.personaContacto;

  document.querySelector('#totalOfertasActivas').textContent = datos.ofertasActivas;
  document.querySelector('#totalPostulacionesNuevas').textContent = datos.postulacionesNuevas;
  document.querySelector('#totalAceptados').textContent = datos.aceptados;
  document.querySelector('#totalVisitas').textContent = datos.visitas;

  const tabla = document.querySelector('#tablaRecientes');

  if (datos.recientes.length === 0) {
    tabla.innerHTML = '<tr><td colspan="3" class="text-center text-muted py-3">Aún no tienes postulaciones</td></tr>';
    return;
  }

  tabla.innerHTML = datos.recientes.map((p) => `
    <tr>
      <td>${escaparHtml(p.candidato)}</td>
      <td>${escaparHtml(p.oferta)}</td>
      <td>${formatoFecha(p.fechaPostulacion)}</td>
    </tr>`).join('');
}

async function cargarDatosEmpresa() {
  const empresa = await peticion('/empresa/perfil');

  document.querySelector('#empNombre').value = empresa.nombre;
  document.querySelector('#empNit').value = empresa.nit;
  document.querySelector('#empSector').value = empresa.sector;
  document.querySelector('#empSitioWeb').value = empresa.sitioWeb || '';
  document.querySelector('#empDescripcion').value = empresa.descripcion || '';
  document.querySelector('#empPersonaContacto').value = empresa.personaContacto;
  document.querySelector('#empCorreoContacto').value = empresa.correoContacto;
  document.querySelector('#empTelefono').value = empresa.telefono || '';
  document.querySelector('#empDireccion').value = empresa.direccion || '';

  document.querySelector('#ofPersonaContacto').value = empresa.personaContacto;
  document.querySelector('#ofCorreoContacto').value = empresa.correoContacto;
  document.querySelector('#ofTelefonoContacto').value = empresa.telefono || '';
}

document.querySelector('#formDatosEmpresa').addEventListener('submit', async (e) => {
  e.preventDefault();

  const mensaje = document.querySelector('#mensajeDatos');

  const datos = {
    nombre: document.querySelector('#empNombre').value,
    sector: document.querySelector('#empSector').value,
    sitioWeb: document.querySelector('#empSitioWeb').value,
    descripcion: document.querySelector('#empDescripcion').value,
    personaContacto: document.querySelector('#empPersonaContacto').value,
    correoContacto: document.querySelector('#empCorreoContacto').value,
    telefono: document.querySelector('#empTelefono').value,
    direccion: document.querySelector('#empDireccion').value
  };

  try {
    await peticion('/empresa/perfil', { method: 'PUT', body: JSON.stringify(datos) });
    mostrarMensaje(mensaje, 'Datos guardados correctamente', 'success');
    await cargarPanel();
  } catch (error) {
    mostrarMensaje(mensaje, error.message);
  }
});

function municipiosDe(departamento) {
  const nombres = catalogos.distritos
    .filter((d) => d.departamento === departamento)
    .map((d) => d.municipio);

  return [...new Set(nombres)].map((nombre) => ({ value: nombre, label: nombre }));
}

function distritosDe(departamento, municipio) {
  return catalogos.distritos
    .filter((d) => d.departamento === departamento && d.municipio === municipio)
    .map((d) => ({ value: String(d.distritoId), label: d.nombre }));
}

async function cargarCatalogos() {
  catalogos = await peticion('/ofertas/catalogos');

  selectorDistrito = crearSelectorBuscable('catalogoDistritoOferta', [], { deshabilitado: true });

  selectorMunicipio = crearSelectorBuscable('catalogoMunicipioOferta', [], {
    deshabilitado: true,
    alSeleccionar: (opcion) => {
      const departamento = document.querySelector('#departamentoOferta').value;
      selectorDistrito.actualizar(distritosDe(departamento, opcion.value));
    }
  });

  const departamentos = catalogos.departamentos.map((d) => ({ value: d.nombre, label: d.nombre }));

  selectorDepartamento = crearSelectorBuscable('catalogoDepartamentoOferta', departamentos, {
    alSeleccionar: (opcion) => {
      selectorMunicipio.actualizar(municipiosDe(opcion.value));
      selectorDistrito.deshabilitar('Primero selecciona un municipio');
    }
  });
}

function limpiarUbicacion() {
  selectorDepartamento.limpiar();
  selectorMunicipio.deshabilitar('Primero selecciona un departamento');
  selectorDistrito.deshabilitar('Primero selecciona un municipio');
}

function aplicarModalidad() {
  const esRemoto = document.querySelector('#ofModalidad').value === 'Remoto';

  ['#campoDepartamentoOferta', '#campoMunicipioOferta', '#campoDistritoOferta'].forEach((id) => {
    const campo = document.querySelector(id);
    campo.classList.toggle('d-none', esRemoto);
    campo.querySelector('.catalogo-entrada').required = !esRemoto;
  });

  const ayuda = document.querySelector('#ayudaUbicacionOferta');
  ayuda.classList.remove('text-danger');

  if (esRemoto) {
    limpiarUbicacion();
    ayuda.textContent = 'Al ser una oferta remota no es necesario indicar departamento, municipio ni distrito.';
  } else {
    ayuda.textContent = 'Selecciona departamento, municipio y distrito. Las opciones se muestran en orden alfabético.';
  }
}

document.querySelector('#ofModalidad').addEventListener('change', aplicarModalidad);

function leerFormularioOferta() {
  const datos = {
    titulo: document.querySelector('#ofTitulo').value,
    modalidad: document.querySelector('#ofModalidad').value,
    sector: document.querySelector('#ofSector').value,
    tipoTrabajo: document.querySelector('#ofTipoTrabajo').value,
    tipoContrato: document.querySelector('#ofTipoContrato').value,
    experiencia: document.querySelector('#ofExperiencia').value,
    vacantes: document.querySelector('#ofVacantes').value,
    descripcion: document.querySelector('#ofDescripcion').value,
    responsabilidades: document.querySelector('#ofResponsabilidades').value,
    requisitos: document.querySelector('#ofRequisitos').value,
    beneficios: document.querySelector('#ofBeneficios').value,
    personaContacto: document.querySelector('#ofPersonaContacto').value,
    correoContacto: document.querySelector('#ofCorreoContacto').value,
    telefonoContacto: document.querySelector('#ofTelefonoContacto').value,
    fechaCierre: document.querySelector('#ofFechaCierre').value
  };

  const distritoId = document.querySelector('#distritoOferta').value;
  const salarioMinimo = document.querySelector('#ofSalarioMinimo').value;
  const salarioMaximo = document.querySelector('#ofSalarioMaximo').value;

  if (datos.modalidad !== 'Remoto' && distritoId !== '') datos.distritoId = Number(distritoId);
  if (salarioMinimo !== '') datos.salarioMinimo = salarioMinimo;
  if (salarioMaximo !== '') datos.salarioMaximo = salarioMaximo;

  return datos;
}

function llenarFormularioOferta(oferta) {
  document.querySelector('#ofertaIdEditar').value = oferta.ofertaId;
  document.querySelector('#ofTitulo').value = oferta.titulo;
  document.querySelector('#ofModalidad').value = oferta.modalidad;
  document.querySelector('#ofSector').value = oferta.sector;
  document.querySelector('#ofTipoTrabajo').value = oferta.tipoTrabajo;
  document.querySelector('#ofTipoContrato').value = oferta.tipoContrato;
  document.querySelector('#ofExperiencia').value = oferta.experiencia;
  document.querySelector('#ofSalarioMinimo').value = oferta.salarioMinimo ?? '';
  document.querySelector('#ofSalarioMaximo').value = oferta.salarioMaximo ?? '';
  document.querySelector('#ofVacantes').value = oferta.vacantes;
  document.querySelector('#ofDescripcion').value = oferta.descripcion;
  document.querySelector('#ofResponsabilidades').value = oferta.responsabilidades;
  document.querySelector('#ofRequisitos').value = oferta.requisitos;
  document.querySelector('#ofBeneficios').value = oferta.beneficios || '';
  document.querySelector('#ofPersonaContacto').value = oferta.personaContacto;
  document.querySelector('#ofCorreoContacto').value = oferta.correoContacto;
  document.querySelector('#ofTelefonoContacto').value = oferta.telefonoContacto || '';
  document.querySelector('#ofFechaCierre').value = oferta.fechaCierre;

  aplicarModalidad();

  if (oferta.modalidad !== 'Remoto' && oferta.distritoId) {
    selectorDepartamento.seleccionarValor(oferta.departamento);
    selectorMunicipio.seleccionarValor(oferta.municipio);
    selectorDistrito.seleccionarValor(String(oferta.distritoId));
  }

  document.querySelector('#tituloFormOferta').textContent = 'Editar oferta';
  document.querySelector('#btnGuardarOferta').textContent = 'Guardar cambios';
  document.querySelector('#btnCancelarEdicion').classList.remove('d-none');
}

async function limpiarFormularioOferta() {
  document.querySelector('#formOferta').reset();
  document.querySelector('#ofertaIdEditar').value = '';
  aplicarModalidad();
  limpiarUbicacion();

  document.querySelector('#tituloFormOferta').textContent = 'Publicar nueva oferta';
  document.querySelector('#btnGuardarOferta').textContent = 'Publicar oferta';
  document.querySelector('#btnCancelarEdicion').classList.add('d-none');

  await cargarDatosEmpresa();
}

function irAPestana(id) {
  const boton = document.querySelector(`[data-bs-target="${id}"]`);
  bootstrap.Tab.getOrCreateInstance(boton).show();
}

document.querySelector('#formOferta').addEventListener('submit', async (e) => {
  e.preventDefault();

  const mensaje = document.querySelector('#mensajeOferta');
  const ofertaId = document.querySelector('#ofertaIdEditar').value;
  const datos = leerFormularioOferta();

  if (datos.modalidad !== 'Remoto' && !datos.distritoId) {
    mostrarMensaje(mensaje, 'Selecciona de la lista el departamento, municipio y distrito de la oferta');
    return;
  }

  try {
    if (ofertaId) {
      await peticion(`/empresa/ofertas/${ofertaId}`, { method: 'PUT', body: JSON.stringify(datos) });
      mostrarMensaje(document.querySelector('#mensajeOfertas'), 'Oferta actualizada correctamente', 'success');
    } else {
      await peticion('/empresa/ofertas', { method: 'POST', body: JSON.stringify(datos) });
      mostrarMensaje(document.querySelector('#mensajeOfertas'), 'Oferta publicada. Quedó en revisión hasta que el administrador la apruebe.', 'success');
    }

    mensaje.className = '';
    mensaje.textContent = '';

    await limpiarFormularioOferta();
    await cargarMisOfertas();
    await cargarPanel();
    irAPestana('#ofertas');
  } catch (error) {
    mostrarMensaje(mensaje, error.message);
  }
});

document.querySelector('#btnCancelarEdicion').addEventListener('click', async () => {
  await limpiarFormularioOferta();
  irAPestana('#ofertas');
});

function botonesOferta(oferta) {
  const id = oferta.ofertaId;
  let botones = '';

  if (oferta.estado !== 'cancelada') {
    botones += `<button class="btn btn-sm btn-outline-primary" data-accion="editar" data-id="${id}" title="Editar"><i class="bi bi-pencil"></i></button> `;
  }

  if (oferta.estado === 'activa') {
    botones += `<button class="btn btn-sm btn-outline-secondary" data-accion="estado" data-estado="inactiva" data-id="${id}">Inactivar</button> `;
  }

  if (oferta.estado === 'inactiva') {
    botones += `<button class="btn btn-sm btn-outline-success" data-accion="estado" data-estado="activa" data-id="${id}">Activar</button> `;
  }

  if (oferta.estado !== 'cancelada') {
    botones += `<button class="btn btn-sm btn-outline-warning" data-accion="estado" data-estado="cancelada" data-id="${id}">Cancelar</button> `;
  }

  botones += `<button class="btn btn-sm btn-outline-danger" data-accion="eliminar" data-id="${id}" title="Eliminar"><i class="bi bi-trash"></i></button>`;

  return botones;
}

async function cargarMisOfertas() {
  misOfertas = await peticion('/empresa/ofertas');

  const tabla = document.querySelector('#tablaMisOfertas');

  if (misOfertas.length === 0) {
    tabla.innerHTML = '<tr><td colspan="5" class="text-center text-muted py-3">Aún no has publicado ofertas</td></tr>';
    return;
  }

  tabla.innerHTML = misOfertas.map((o) => {
    let titulo = escaparHtml(o.titulo);

    if (o.estado === 'activa') {
      titulo = `<a href="oferta-detalle.html?id=${o.ofertaId}">${titulo}</a>`;
    }

    return `<tr>
      <td>${titulo}</td>
      <td>${etiquetaOferta(o.estado)}</td>
      <td>${o.postulaciones}</td>
      <td>${formatoFecha(o.fechaCierre)}</td>
      <td class="text-nowrap">${botonesOferta(o)}</td>
    </tr>`;
  }).join('');
}

document.querySelector('#tablaMisOfertas').addEventListener('click', async (e) => {
  const boton = e.target.closest('button');
  if (!boton) return;

  const mensaje = document.querySelector('#mensajeOfertas');
  const id = boton.dataset.id;
  const accion = boton.dataset.accion;

  if (accion === 'editar') {
    const oferta = misOfertas.find((o) => o.ofertaId === Number(id));
    llenarFormularioOferta(oferta);
    irAPestana('#publicar');
    return;
  }

  try {
    if (accion === 'estado') {
      const estado = boton.dataset.estado;

      if (estado === 'cancelada' && !confirm('¿Cancelar esta oferta? Ya no se podrá volver a activar.')) return;

      await peticion(`/empresa/ofertas/${id}/estado`, { method: 'PATCH', body: JSON.stringify({ estado }) });
      mostrarMensaje(mensaje, 'Estado de la oferta actualizado', 'success');
    }

    if (accion === 'eliminar') {
      if (!confirm('¿Eliminar esta oferta? También se borrarán sus postulaciones y no se puede deshacer.')) return;

      await peticion(`/empresa/ofertas/${id}`, { method: 'DELETE' });
      mostrarMensaje(mensaje, 'Oferta eliminada correctamente', 'success');
    }

    await cargarMisOfertas();
    await cargarPanel();
  } catch (error) {
    mostrarMensaje(mensaje, error.message);
  }
});

async function iniciarEmpresa() {
  try {
    await cargarCatalogos();
    aplicarModalidad();
    await cargarPanel();
    await cargarDatosEmpresa();
    await cargarMisOfertas();
  } catch (error) {
    mostrarMensaje(document.querySelector('#mensajePanel'), error.message);
  }
}

iniciarEmpresa();

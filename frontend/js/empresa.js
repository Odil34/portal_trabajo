<<<<<<< HEAD
document.addEventListener('DOMContentLoaded', () => {
    cargarCatalogosOferta();
});

async function cargarCatalogosOferta() {
    const formulario = document.getElementById('formPublicarOferta');
    if (!formulario) return;

    const modalidad = document.getElementById('modalidadOferta');
    const campoDepartamento = document.getElementById('campoDepartamentoOferta');
    const campoMunicipio = document.getElementById('campoMunicipioOferta');
    const campoDistrito = document.getElementById('campoDistritoOferta');
    const ayudaUbicacion = document.getElementById('ayudaUbicacionOferta');

    try {
        const catalogos = await peticion('/ofertas/catalogos');

        const selectorDistrito = crearSelectorBuscable('catalogoDistritoOferta', [], {
            deshabilitado: true
        });

        const selectorMunicipio = crearSelectorBuscable('catalogoMunicipioOferta', [], {
            deshabilitado: true,
            alSeleccionar: opcion => {
                const departamentoElegido = document.getElementById('departamentoOferta').value;
                const distritos = catalogos.distritos
                    .filter(item => item.departamento === departamentoElegido && item.municipio === opcion.value)
                    .map(item => ({ value: String(item.distritoId), label: item.nombre }));

                selectorDistrito.actualizar(distritos);
            }
        });

        crearSelectorBuscable(
            'catalogoDepartamentoOferta',
            catalogos.departamentos.map(item => ({
                value: item.nombre,
                label: item.nombre
            })),
            {
                alSeleccionar: opcion => {
                    selectorMunicipio.limpiar();
                    selectorDistrito.limpiar();

                    const municipios = [...new Set(
                        catalogos.distritos
                            .filter(item => item.departamento === opcion.value)
                            .map(item => item.municipio)
                    )].map(nombre => ({ value: nombre, label: nombre }));

                    selectorMunicipio.actualizar(municipios);
                    selectorDistrito.deshabilitar('Primero selecciona un municipio');
                }
            }
        );

        modalidad.addEventListener('change', () => {
            const esRemoto = modalidad.value === 'Remoto';

            [campoDepartamento, campoMunicipio, campoDistrito].forEach(campo => {
                const entrada = campo.querySelector('.catalogo-entrada');
                campo.classList.toggle('d-none', esRemoto);
                entrada.disabled = esRemoto;
                entrada.required = !esRemoto;
            });

            if (esRemoto) {
                document.getElementById('departamentoOferta').value = '';
                document.getElementById('municipioOferta').value = '';
                document.getElementById('distritoOferta').value = '';
                document.getElementById('departamentoOfertaTexto').value = '';
                document.getElementById('municipioOfertaTexto').value = '';
                document.getElementById('distritoOfertaTexto').value = '';
                selectorMunicipio.deshabilitar();
                selectorDistrito.deshabilitar();
                ayudaUbicacion.textContent = 'Al ser una oferta remota, no es necesario indicar departamento, municipio ni distrito.';
            } else {
                document.getElementById('departamentoOfertaTexto').disabled = false;
                ayudaUbicacion.textContent = 'Selecciona departamento, municipio y distrito. Las opciones se muestran en orden alfabético.';
            }
        });

        formulario.addEventListener('submit', evento => {
            if (modalidad.value !== 'Remoto') {
                const departamento = document.getElementById('departamentoOferta').value;
                const municipio = document.getElementById('municipioOferta').value;
                const distrito = document.getElementById('distritoOferta').value;

                if (!departamento || !municipio || !distrito) {
                    evento.preventDefault();
                    ayudaUbicacion.textContent = 'Completa departamento, municipio y distrito para publicar la oferta.';
                    ayudaUbicacion.classList.add('text-danger');
                }
            }
        });
    } catch (error) {
        console.error('Error al cargar catalogos para publicar oferta:', error);
    }
}
=======
const estadosOferta = {
  en_revision: ['En revisión', 'bg-warning text-dark'],
  activa: ['Activa', 'bg-success'],
  inactiva: ['Inactiva', 'bg-secondary'],
  cancelada: ['Cancelada', 'bg-dark'],
  rechazada: ['Rechazada', 'bg-danger']
};

// Aquí se guardan las ofertas para poder llenar el formulario al editar
let misOfertas = [];

function etiquetaOferta(estado) {
  const [texto, clase] = estadosOferta[estado];
  return `<span class="badge ${clase}">${texto}</span>`;
}

// ----- Panel -----

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

// ----- Datos de la empresa -----

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

  // Datos de contacto por defecto al publicar una oferta nueva
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

// ----- Publicar y editar oferta -----

function leerFormularioOferta() {
  const datos = {
    titulo: document.querySelector('#ofTitulo').value,
    ubicacion: document.querySelector('#ofUbicacion').value,
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

  // Los salarios son opcionales: solo se envían si se escribieron
  const salarioMinimo = document.querySelector('#ofSalarioMinimo').value;
  const salarioMaximo = document.querySelector('#ofSalarioMaximo').value;

  if (salarioMinimo !== '') datos.salarioMinimo = salarioMinimo;
  if (salarioMaximo !== '') datos.salarioMaximo = salarioMaximo;

  return datos;
}

function llenarFormularioOferta(oferta) {
  document.querySelector('#ofertaIdEditar').value = oferta.ofertaId;
  document.querySelector('#ofTitulo').value = oferta.titulo;
  document.querySelector('#ofUbicacion').value = oferta.ubicacion;
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

  document.querySelector('#tituloFormOferta').textContent = 'Editar oferta';
  document.querySelector('#btnGuardarOferta').textContent = 'Guardar cambios';
  document.querySelector('#btnCancelarEdicion').classList.remove('d-none');
}

async function limpiarFormularioOferta() {
  document.querySelector('#formOferta').reset();
  document.querySelector('#ofertaIdEditar').value = '';

  document.querySelector('#tituloFormOferta').textContent = 'Publicar nueva oferta';
  document.querySelector('#btnGuardarOferta').textContent = 'Publicar oferta';
  document.querySelector('#btnCancelarEdicion').classList.add('d-none');

  // Vuelve a poner los datos de contacto de la empresa
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

// ----- Mis ofertas -----

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

    // Solo las ofertas activas se pueden ver en el detalle público
    if (o.estado === 'activa') {
      titulo = `<a href="oferta-detalle.html?id=${o.ofertaId}">${titulo}</a>`;
    }

    return `<tr>
      <td>${titulo}</td>
      <td>${etiquetaOferta(o.estado)}</td>
      <td>${o.postulaciones}</td>
      <td>${formatoFecha(o.fechaCierre + 'T00:00:00')}</td>
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

// ----- Inicio de la página -----

async function iniciarEmpresa() {
  try {
    await cargarPanel();
    await cargarDatosEmpresa();
    await cargarMisOfertas();
  } catch (error) {
    mostrarMensaje(document.querySelector('#mensajePanel'), error.message);
  }
}

iniciarEmpresa();
>>>>>>> origin/main

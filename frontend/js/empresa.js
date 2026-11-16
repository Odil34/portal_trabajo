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
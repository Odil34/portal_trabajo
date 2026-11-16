document.addEventListener('DOMContentLoaded', () => {
    cargarEstadisticas();
    cargarOfertasRecientes();
    cargarCatalogosBusqueda();
});

async function cargarCatalogosBusqueda() {
    const departamento = document.getElementById('departamentoInicio');
    const distrito = document.getElementById('distritoInicio');

    if (!departamento || !distrito) return;

    try {
        const catalogos = await peticion('/ofertas/catalogos');
        const selectorDistrito = crearSelectorBuscable('catalogoDistritoInicio', [], {
            deshabilitado: true
        });

        const selectorDepartamento = crearSelectorBuscable(
            'catalogoDepartamentoInicio',
            [
                { value: '', label: 'Todo el país' },
                ...catalogos.departamentos.map(item => ({
                    value: item.nombre,
                    label: item.nombre
                }))
            ],
            {
                alSeleccionar: opcion => {
                    selectorDistrito.limpiar();

                    const seleccionado = catalogos.departamentos.find(
                        item => item.nombre === opcion.value
                    );

                    if (!seleccionado) {
                        selectorDistrito.deshabilitar();
                        return;
                    }

                    const distritos = catalogos.distritos
                        .filter(item => item.departamento === seleccionado.nombre)
                        .map(item => ({ value: item.nombre, label: item.nombre }));

                    selectorDistrito.actualizar([
                        { value: '', label: 'Todos los distritos' },
                        ...distritos
                    ]);
                }
            }
        );

        const parametros = new URLSearchParams(window.location.search);
        const departamentoInicial = parametros.get('departamento') || '';
        const distritoInicial = parametros.get('distrito') || '';

        if (departamentoInicial) {
            selectorDepartamento.seleccionarValor(departamentoInicial);
            if (distritoInicial) selectorDistrito.seleccionarValor(distritoInicial);
        }
    } catch (error) {
        console.error('Error al cargar catalogos de ubicacion:', error);
    }
}

async function cargarEstadisticas() {
    try {
        const datos = await peticion('/ofertas/resumen');

        document.getElementById('totalEmpresas').textContent = datos.empresas.toLocaleString('es-SV');
        document.getElementById('totalUsuarios').textContent = datos.usuarios.toLocaleString('es-SV');
        document.getElementById('totalEmpleos').textContent = datos.empleos.toLocaleString('es-SV');
        document.getElementById('totalPostulaciones').textContent = datos.postulaciones.toLocaleString('es-SV');

    } catch (error) {
        console.error('Error al cargar estadisticas:', error);
    }
}

async function cargarOfertasRecientes() {
    const contenedor = document.getElementById('ofertasRecientes');

    try {
        const ofertas = await peticion('/ofertas/recientes');

        contenedor.innerHTML = '';

        if (ofertas.length === 0) {
            contenedor.textContent = 'No hay ofertas disponibles.';
            return;
        }

        ofertas.forEach(oferta => {
            const tarjeta = `
                <div class="col-md-4">
                    <div class="card card-oferta p-3 h-100">
                        <div class="d-flex gap-3 mb-2">
                            <div class="logo-empresa bg-primary">
                                ${escaparHtml(oferta.empresa.substring(0, 2).toUpperCase())}
                            </div>
                            <div>
                                <h5 class="mb-0">${escaparHtml(oferta.titulo)}</h5>
                                <small class="text-muted">${escaparHtml(oferta.empresa)}</small>
                            </div>
                        </div>

                        <p class="small text-muted mb-2">
                            <i class="bi bi-geo-alt"></i>
                            ${escaparHtml(oferta.ubicacion)} -
                            ${escaparHtml(oferta.tipoTrabajo)}
                        </p>

                        <p class="fw-semibold text-success mb-3">
                            ${formatoSalario(oferta)}
                        </p>

                        <a href="oferta-detalle.html?id=${oferta.ofertaId}"
                           class="btn btn-azul btn-sm mt-auto">
                            Ver oferta
                        </a>
                    </div>
                </div>
            `;

            contenedor.innerHTML += tarjeta;
        });

    } catch (error) {
        contenedor.textContent = 'No se pudieron cargar las ofertas.';
        console.error(error);
    }
}


function formatoSalario(oferta) {
    const minimo = oferta.salarioMinimo;
    const maximo = oferta.salarioMaximo;

    if (minimo == null && maximo == null) {
        return 'Salario a convenir';
    }

    if (minimo == null) {
        return `Hasta $${maximo}`;
    }

    if (maximo == null) {
        return `Desde $${minimo}`;
    }

    return `$${minimo} - $${maximo}`;
}

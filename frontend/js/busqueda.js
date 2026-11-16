document.addEventListener('DOMContentLoaded', () => {
    iniciarBusqueda();
});

async function iniciarBusqueda() {
    const parametros = new URLSearchParams(window.location.search);
    const formulario = document.getElementById('formFiltrosBusqueda');

    try {
        const catalogos = await peticion('/ofertas/catalogos');
        cargarSectores(catalogos.sectores || []);

        const selectorDistrito = crearSelectorBuscable('catalogoDistrito', [], {
            deshabilitado: true
        });

        const selectorDepartamento = crearSelectorBuscable(
            'catalogoDepartamento',
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

        cargarValoresFormulario(formulario, parametros);

        const departamentoInicial = parametros.get('departamento') || '';
        const distritoInicial = parametros.get('distrito') || '';

        if (departamentoInicial) {
            selectorDepartamento.seleccionarValor(departamentoInicial);
            if (distritoInicial) selectorDistrito.seleccionarValor(distritoInicial);
        }

        await cargarResultados(parametros);
    } catch (error) {
        document.getElementById('tituloResultados').textContent = 'No se pudieron cargar los empleos';
        document.getElementById('resultadosOfertas').innerHTML =
            '<div class="alert alert-danger">Ocurrio un error al consultar las ofertas. Intenta nuevamente.</div>';
        console.error('Error al iniciar la busqueda:', error);
    }
}

function cargarValoresFormulario(formulario, parametros) {
    for (const [nombre, valor] of parametros.entries()) {
        const campo = formulario.elements.namedItem(nombre);
        if (campo && !['departamento', 'distrito'].includes(nombre)) {
            campo.value = valor;
        }
    }
}

function cargarSectores(sectores) {
    const selector = document.getElementById('sector');
    if (!selector) return;

    const seleccionado = new URLSearchParams(window.location.search).get('sector') || '';
    selector.innerHTML = '<option value="">Todos los sectores</option>' +
        sectores.map(sector => `<option value="${escaparHtml(sector)}">${escaparHtml(sector)}</option>`).join('');
    selector.value = seleccionado;
}

async function cargarResultados(parametros) {
    const contenedor = document.getElementById('resultadosOfertas');
    const titulo = document.getElementById('tituloResultados');
    const pagina = Number(parametros.get('pagina') || 1);

    try {
        const query = new URLSearchParams(parametros);
        const datos = await peticion(`/ofertas?${query.toString()}`);

        titulo.textContent = `${datos.total} ${datos.total === 1 ? 'empleo encontrado' : 'empleos encontrados'}`;
        contenedor.innerHTML = '';

        if (datos.ofertas.length === 0) {
            contenedor.innerHTML = '<div class="alert alert-light">No se encontraron ofertas con los filtros seleccionados.</div>';
            document.getElementById('paginacionOfertas').innerHTML = '';
            return;
        }

        datos.ofertas.forEach(oferta => {
            const ubicacion = oferta.modalidad === 'Remoto'
                ? 'Remoto'
                : [oferta.distrito, oferta.departamento || oferta.departamentoCatalogo || oferta.ubicacion]
                    .filter(Boolean)
                    .filter((valor, indice, lista) => lista.indexOf(valor) === indice)
                    .join(', ');

            const tarjeta = `
                <div class="card card-oferta p-3 mb-3">
                    <div class="d-flex gap-3">
                        <div class="logo-empresa bg-primary">
                            ${escaparHtml((oferta.empresa || 'PL').substring(0, 2).toUpperCase())}
                        </div>
                        <div class="flex-grow-1">
                            <h5 class="mb-1">${escaparHtml(oferta.titulo)}</h5>
                            <p class="text-muted mb-2">${escaparHtml(oferta.empresa)}</p>
                            <span class="badge bg-light text-dark">
                                <i class="bi bi-geo-alt"></i> ${escaparHtml(ubicacion || oferta.ubicacion)}
                            </span>
                            <span class="badge bg-light text-dark">${escaparHtml(oferta.modalidad || '')}</span>
                            <span class="badge bg-light text-dark">${escaparHtml(oferta.tipoTrabajo)}</span>
                            <span class="badge bg-light text-dark">${escaparHtml(oferta.experiencia)}</span>
                            <p class="fw-semibold text-success mt-2 mb-0">${formatoSalarioBusqueda(oferta)}</p>
                        </div>
                        <div class="text-end">
                            <a href="oferta-detalle.html?id=${encodeURIComponent(oferta.ofertaId)}"
                               class="btn btn-azul btn-sm">Ver detalle</a>
                        </div>
                    </div>
                </div>
            `;

            contenedor.innerHTML += tarjeta;
        });

        cargarPaginacion(datos.pagina, datos.totalPaginas, parametros);
    } catch (error) {
        titulo.textContent = 'No se pudieron cargar los empleos';
        contenedor.innerHTML = '<div class="alert alert-danger">Ocurrio un error al consultar las ofertas. Intenta nuevamente.</div>';
        console.error('Error al buscar ofertas:', error);
    }
}

function formatoSalarioBusqueda(oferta) {
    const minimo = oferta.salarioMinimo;
    const maximo = oferta.salarioMaximo;

    if (minimo == null && maximo == null) return 'Salario a convenir';
    if (minimo == null) return `Hasta $${maximo}`;
    if (maximo == null) return `Desde $${minimo}`;
    return `$${minimo} - $${maximo}`;
}

function cargarPaginacion(paginaActual, totalPaginas, parametros) {
    const contenedor = document.getElementById('paginacionOfertas');
    contenedor.innerHTML = '';

    if (totalPaginas <= 1) return;

    const agregarPagina = (texto, pagina, deshabilitado = false, activa = false) => {
        const elemento = document.createElement('li');
        elemento.className = `page-item${deshabilitado ? ' disabled' : ''}${activa ? ' active' : ''}`;

        const enlace = document.createElement('a');
        enlace.className = 'page-link';
        enlace.href = '#';
        enlace.textContent = texto;

        enlace.addEventListener('click', event => {
            event.preventDefault();
            if (deshabilitado || activa) return;

            const nuevosParametros = new URLSearchParams(parametros);
            nuevosParametros.set('pagina', pagina);
            window.location.search = nuevosParametros.toString();
        });

        elemento.appendChild(enlace);
        contenedor.appendChild(elemento);
    };

    agregarPagina('Anterior', paginaActual - 1, paginaActual === 1);

    for (let numero = 1; numero <= totalPaginas; numero++) {
        agregarPagina(numero, numero, false, numero === paginaActual);
    }

    agregarPagina('Siguiente', paginaActual + 1, paginaActual === totalPaginas);
}

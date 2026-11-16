document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.getElementById('formBuscarValoraciones');

    formulario.addEventListener('submit', event => {
        event.preventDefault();
        cargarEmpresasValoradas();
    });

    cargarEmpresasValoradas();
});

async function cargarEmpresasValoradas() {
    const contenedor = document.getElementById('listaEmpresasValoradas');
    const recientes = document.getElementById('comentariosRecientes');
    const parametros = new URLSearchParams();
    const buscar = document.getElementById('buscarEmpresa').value.trim();
    const sector = document.getElementById('sectorEmpresa').value;

    if (buscar) parametros.set('buscar', buscar);
    if (sector) parametros.set('sector', sector);

    contenedor.textContent = 'Cargando empresas...';

    try {
        const empresas = await peticion(`/valoraciones?${parametros.toString()}`);
        contenedor.innerHTML = '';
        recientes.innerHTML = '';

        if (empresas.length === 0) {
            contenedor.textContent = 'No hay empresas verificadas que coincidan con la búsqueda.';
            recientes.textContent = 'No hay comentarios publicados.';
            return;
        }

        const sectores = [...new Set(empresas.map(empresa => empresa.sector).filter(Boolean))].sort();
        const selector = document.getElementById('sectorEmpresa');
        const sectorActual = selector.value;
        selector.innerHTML = '<option value="">Todos los sectores</option>' +
            sectores.map(item => `<option value="${escaparHtml(item)}">${escaparHtml(item)}</option>`).join('');
        selector.value = sectorActual;

        empresas.forEach(empresa => {
            const tarjeta = document.createElement('div');
            tarjeta.className = 'card p-3 mb-3';

            const fila = document.createElement('div');
            fila.className = 'd-flex gap-3 align-items-center flex-wrap';

            const logo = document.createElement('div');
            logo.className = 'logo-empresa bg-primary';
            logo.textContent = (empresa.nombre || 'PL').substring(0, 2).toUpperCase();

            const datos = document.createElement('div');
            datos.className = 'flex-grow-1';

            const nombre = document.createElement('h5');
            nombre.className = 'mb-0';
            nombre.textContent = empresa.nombre;

            const sectorTexto = document.createElement('small');
            sectorTexto.className = 'text-muted';
            sectorTexto.textContent = [empresa.sector, empresa.direccion].filter(Boolean).join(' · ');

            datos.append(nombre, sectorTexto);

            const puntuacion = document.createElement('div');
            puntuacion.className = 'text-end';
            const calificacion = empresa.calificacion == null ? '—' : Number(empresa.calificacion).toFixed(1);
            puntuacion.innerHTML = `<span class="estrellas">${empresa.calificacion == null ? '☆☆☆☆☆' : estrellasValoracion(empresa.calificacion)}</span> <strong>${calificacion}</strong>`;
            const total = document.createElement('small');
            total.className = 'd-block text-muted';
            total.textContent = `${empresa.totalValoraciones} opiniones`;
            puntuacion.appendChild(total);

            fila.append(logo, datos, puntuacion);

            const acciones = document.createElement('div');
            acciones.className = 'mt-3 d-flex gap-2';

            const ver = document.createElement('button');
            ver.type = 'button';
            ver.className = 'btn btn-azul btn-sm';
            ver.textContent = 'Ver opiniones';
            ver.addEventListener('click', () => abrirOpinionesEmpresa(empresa.empresaId));

            const ofertas = document.createElement('a');
            ofertas.className = 'btn btn-outline-secondary btn-sm';
            ofertas.href = `busqueda.html?buscar=${encodeURIComponent(empresa.nombre)}`;
            ofertas.textContent = 'Ver ofertas';

            acciones.append(ver, ofertas);
            tarjeta.append(fila, acciones);
            contenedor.appendChild(tarjeta);
        });

        const empresasConOpiniones = empresas.filter(empresa => Number(empresa.totalValoraciones) > 0);
        if (empresasConOpiniones.length === 0) {
            recientes.textContent = 'No hay comentarios publicados.';
        } else {
            for (const empresa of empresasConOpiniones.slice(0, 3)) {
                const datos = await peticion(`/valoraciones/${empresa.empresaId}`);
                const opinion = datos.opiniones?.[0];
                if (!opinion) continue;

                const bloque = document.createElement('p');
                bloque.className = 'small mb-2';
                const nombre = document.createElement('strong');
                nombre.textContent = empresa.nombre;
                const texto = document.createElement('span');
                texto.textContent = ` ${estrellasValoracion(opinion.calificacion)}\n"${opinion.comentario}"`;
                bloque.append(nombre, document.createElement('br'), texto);
                recientes.appendChild(bloque);
            }
        }
    } catch (error) {
        contenedor.textContent = 'No se pudieron cargar las valoraciones.';
        recientes.textContent = 'No se pudieron cargar los comentarios.';
        console.error('Error al cargar valoraciones:', error);
    }
}

async function abrirOpinionesEmpresa(empresaId) {
    const titulo = document.getElementById('tituloModalOpiniones');
    const contenido = document.getElementById('contenidoModalOpiniones');
    titulo.textContent = 'Opiniones de la empresa';
    contenido.textContent = 'Cargando opiniones...';

    const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('modalOpiniones'));
    modal.show();

    try {
        const empresa = await peticion(`/valoraciones/${empresaId}`);
        titulo.textContent = `Opiniones de ${empresa.nombre}`;
        contenido.innerHTML = '';

        const resumen = document.createElement('p');
        resumen.className = 'mb-3';
        resumen.textContent = `${empresa.calificacion == null ? 'Sin calificaciones' : `${Number(empresa.calificacion).toFixed(1)} de 5 estrellas`} · ${empresa.totalValoraciones} opiniones`;
        contenido.appendChild(resumen);

        if (!empresa.opiniones || empresa.opiniones.length === 0) {
            const vacio = document.createElement('p');
            vacio.className = 'text-muted';
            vacio.textContent = 'Esta empresa todavía no tiene opiniones publicadas.';
            contenido.appendChild(vacio);
            return;
        }

        empresa.opiniones.forEach(opinion => {
            const tarjeta = document.createElement('div');
            tarjeta.className = 'border rounded p-3 mb-2';

            const encabezado = document.createElement('div');
            encabezado.className = 'd-flex justify-content-between gap-2';
            const autor = document.createElement('strong');
            autor.textContent = opinion.nombreCandidato || 'Anónimo';
            const estrellas = document.createElement('span');
            estrellas.className = 'estrellas';
            estrellas.textContent = estrellasValoracion(opinion.calificacion);
            encabezado.append(autor, estrellas);

            const comentario = document.createElement('p');
            comentario.className = 'small text-muted mb-0 mt-2';
            comentario.textContent = opinion.comentario;

            tarjeta.append(encabezado, comentario);
            contenido.appendChild(tarjeta);
        });
    } catch (error) {
        contenido.textContent = error.message || 'No se pudieron cargar las opiniones.';
    }
}

function estrellasValoracion(calificacion) {
    const valor = Math.max(0, Math.min(5, Math.round(Number(calificacion) || 0)));
    return '★'.repeat(valor) + '☆'.repeat(5 - valor);
}

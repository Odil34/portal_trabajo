document.addEventListener('DOMContentLoaded', cargarDetalleOferta);

async function cargarDetalleOferta() {
    const estado = document.getElementById('estadoDetalle');
    const contenido = document.getElementById('contenidoDetalle');
    const parametros = new URLSearchParams(window.location.search);
    const ofertaId = Number(parametros.get('id'));

    if (!Number.isSafeInteger(ofertaId) || ofertaId <= 0) {
        estado.className = 'alert alert-danger';
        estado.textContent = 'No se indicó una oferta válida.';
        return;
    }

    try {
        const oferta = await peticion(`/ofertas/${ofertaId}`);
        mostrarDetalleOferta(oferta);
        estado.hidden = true;
        contenido.hidden = false;
    } catch (error) {
        estado.className = 'alert alert-danger';
        estado.textContent = error.message || 'No se pudo cargar la información del empleo.';
    }
}

function mostrarDetalleOferta(oferta) {
    const ponerTexto = (id, valor, alternativo = 'No especificado') => {
        document.getElementById(id).textContent = valor ?? alternativo;
    };

    ponerTexto('logoEmpresa', (oferta.empresa || 'PL').substring(0, 2).toUpperCase());
    ponerTexto('tituloOferta', oferta.titulo);
    ponerTexto('nombreEmpresa', oferta.empresa);
    ponerTexto('ubicacionOferta', [oferta.distrito, oferta.departamento, oferta.ubicacion]
        .filter(Boolean)
        .filter((valor, indice, lista) => lista.indexOf(valor) === indice)
        .join(', ') || 'Ubicación no especificada');
    ponerTexto('tipoTrabajoOferta', oferta.tipoTrabajo);
    ponerTexto('tipoContratoOferta', `Contrato ${oferta.tipoContrato || 'no especificado'}`);
    ponerTexto('fechaPublicacionOferta', `Publicado el ${formatoFecha(oferta.fechaPublicacion)}`);
    ponerTexto('salarioOferta', formatoSalarioDetalle(oferta));
    ponerTexto('descripcionOferta', oferta.descripcion);
    ponerTexto('experienciaOferta', oferta.experiencia);
    ponerTexto('sectorOferta', oferta.sector);
    ponerTexto('vacantesOferta', oferta.vacantes);
    ponerTexto('fechaCierreOferta', formatoFecha(oferta.fechaCierre));
    ponerTexto('personaContacto', oferta.personaContacto);
    ponerTexto('telefonoContacto', oferta.telefonoContacto);

    const correo = document.getElementById('correoContacto');
    correo.textContent = oferta.correoContacto || 'No especificado';
    if (oferta.correoContacto) correo.href = `mailto:${oferta.correoContacto}`;
    else correo.removeAttribute('href');

    document.getElementById('telefonoContactoFila').hidden = !oferta.telefonoContacto;

    const direccion = document.querySelector('#direccionEmpresa span');
    direccion.textContent = oferta.direccion || oferta.ubicacion || 'No especificada';

    const sitioWeb = document.getElementById('sitioWebEmpresa');
    if (oferta.sitioWeb) {
        try {
            const url = new URL(oferta.sitioWeb);
            if (url.protocol === 'http:' || url.protocol === 'https:') {
                sitioWeb.href = url.href;
                sitioWeb.hidden = false;
            } else {
                sitioWeb.hidden = true;
            }
        } catch {
            sitioWeb.hidden = true;
        }
    } else {
        sitioWeb.hidden = true;
    }

    llenarLista('responsabilidadesOferta', oferta.responsabilidades);
    llenarLista('requisitosOferta', oferta.requisitos);
    llenarLista('beneficiosOferta', oferta.beneficios);

    const promedio = oferta.calificacion == null ? '—' : Number(oferta.calificacion).toFixed(1);
    ponerTexto('promedioValoraciones', promedio);
    ponerTexto('totalValoraciones', `${oferta.totalValoraciones || 0} opiniones`);
    ponerTexto('calificacionEmpresa', oferta.calificacion == null ? '' : `★ ${promedio}`);
    ponerTexto('estrellasValoraciones', pintarEstrellas(oferta.calificacion));

    const lista = document.getElementById('listaValoraciones');
    lista.innerHTML = '';
    const valoraciones = Array.isArray(oferta.valoraciones) ? oferta.valoraciones : [];

    if (valoraciones.length === 0) {
        lista.textContent = 'Esta empresa todavía no tiene valoraciones publicadas.';
        return;
    }

    valoraciones.forEach(valoracion => {
        const tarjeta = document.createElement('div');
        tarjeta.className = 'border rounded p-3 mb-2';

        const encabezado = document.createElement('div');
        encabezado.className = 'd-flex justify-content-between gap-2';

        const autor = document.createElement('strong');
        autor.textContent = valoracion.nombreCandidato || 'Anónimo';

        const estrellas = document.createElement('span');
        estrellas.className = 'estrellas small';
        estrellas.textContent = pintarEstrellas(valoracion.calificacion);

        const comentario = document.createElement('p');
        comentario.className = 'mb-0 small text-muted';
        comentario.textContent = valoracion.comentario;

        encabezado.append(autor, estrellas);
        tarjeta.append(encabezado, comentario);
        lista.appendChild(tarjeta);
    });
}

function llenarLista(id, texto) {
    const lista = document.getElementById(id);
    lista.innerHTML = '';

    const elementos = (texto || '').split(/\r?\n/).map(item => item.trim()).filter(Boolean);

    if (elementos.length === 0) {
        const elemento = document.createElement('li');
        elemento.textContent = 'No especificado';
        lista.appendChild(elemento);
        return;
    }

    elementos.forEach(textoElemento => {
        const elemento = document.createElement('li');
        elemento.textContent = textoElemento;
        lista.appendChild(elemento);
    });
}

function pintarEstrellas(calificacion) {
    if (calificacion == null) return 'Sin calificaciones';
    const valor = Math.max(0, Math.min(5, Math.round(Number(calificacion))));
    return '★'.repeat(valor) + '☆'.repeat(5 - valor);
}

function formatoSalarioDetalle(oferta) {
    const minimo = oferta.salarioMinimo;
    const maximo = oferta.salarioMaximo;

    if (minimo == null && maximo == null) return 'Salario a convenir';
    if (minimo == null) return `Hasta $${maximo}`;
    if (maximo == null) return `Desde $${minimo}`;
    return `$${minimo.toLocaleString('en-US')} - $${maximo.toLocaleString('en-US')}`;
}

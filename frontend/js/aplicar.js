document.addEventListener('DOMContentLoaded', () => {
  const modalEl = document.getElementById('modalAplicar');
  const formAplicar = document.getElementById('formAplicar');
  const mensajeDiv = document.getElementById('mensajeAplicar');
  const btnEnviar = document.getElementById('btnEnviarPostulacion');

  if (!modalEl || !formAplicar) return;

  const params = new URLSearchParams(window.location.search);
  const ofertaId = Number(params.get('id')) || 1;

  modalEl.addEventListener('show.bs.modal', (e) => {
    const sesion = obtenerSesion();

    if (!sesion || sesion.usuario.rol !== 'candidato') {
      e.preventDefault();
      window.location.href = 'login.html';
      return;
    }

    const tituloOferta = document.querySelector('main h2')?.textContent?.trim();
    if (tituloOferta) {
      document.getElementById('modalAplicarTitulo').textContent = `Aplicar a ${tituloOferta}`;
    }

    mensajeDiv.className = '';
    mensajeDiv.textContent = '';
    btnEnviar.disabled = false;
  });

  formAplicar.addEventListener('submit', async (e) => {
    e.preventDefault();

    const cartaPresentacion = document.getElementById('cartaPresentacion').value.trim();

    btnEnviar.disabled = true;

    try {
      await peticion('/postulaciones', {
        method: 'POST',
        body: JSON.stringify({
          ofertaId,
          cartaPresentacion
        })
      });

      mostrarMensaje(mensajeDiv, '¡Postulación enviada con éxito! Puedes ver su estado en Mi perfil.', 'success');
      formAplicar.reset();
    } catch (error) {
      mostrarMensaje(mensajeDiv, error.message, 'danger');
      btnEnviar.disabled = false;
    }
  });
});
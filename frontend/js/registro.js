document.querySelectorAll('form[data-registro]').forEach((form) => {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const datos = Object.fromEntries(new FormData(form));

    const mensaje = form.querySelector('.mensaje');

    if (datos.clave !== datos.confirmarClave) {
      mostrarMensaje(mensaje, 'Las contraseñas no coinciden');
      return;
    }

    delete datos.confirmarClave;

    try {
      const sesion = await peticion(`/auth/registro/${form.dataset.registro}`, {
        method: 'POST',
        body: JSON.stringify(datos)
      });

      guardarSesion(sesion);

      window.location.href = paginasPorRol[sesion.usuario.rol];
    } catch (error) {
      mostrarMensaje(mensaje, error.message);
    }
  });
});

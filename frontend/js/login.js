document.querySelectorAll('form[data-rol]').forEach((form) => {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const datos = Object.fromEntries(new FormData(form));

    const mensaje = form.querySelector('.mensaje');

    try {
      const sesion = await peticion('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ correo: datos.correo, clave: datos.clave, rol: form.dataset.rol })
      });

      guardarSesion(sesion);

      window.location.href = paginasPorRol[sesion.usuario.rol];
    } catch (error) {
      mostrarMensaje(mensaje, error.message);
    }
  });
});

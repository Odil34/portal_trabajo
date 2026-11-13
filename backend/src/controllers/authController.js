import * as authService from '../services/authServices.js';

export const postRegistrarCandidato = async (req, res, next) => {
  try {
    const { nombres, apellidos, correo, telefono, areaInteres, clave } = req.body;

    const sesion = await authService.registrarCandidato(nombres, apellidos, correo, telefono, areaInteres, clave);

    res.status(201).json(sesion);
  } catch (err) {
    return next(err);
  }
};

export const postRegistrarEmpresa = async (req, res, next) => {
  try {
    const { nombre, nit, sector, sitioWeb, personaContacto, correo, clave } = req.body;

    const sesion = await authService.registrarEmpresa(nombre, nit, sector, sitioWeb, personaContacto, correo, clave);

    res.status(201).json(sesion);
  } catch (err) {
    return next(err);
  }
};

export const postLogin = async (req, res, next) => {
  try {
    const { correo, clave, rol } = req.body;

    const sesion = await authService.login(correo, clave, rol);

    res.json(sesion);
  } catch (err) {
    return next(err);
  }
};

export const getPerfil = async (req, res, next) => {
  try {
    const usuario = await authService.getUsuarioById(req.usuario.usuarioId);

    res.json(usuario);
  } catch (err) {
    return next(err);
  }
};

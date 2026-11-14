import * as adminService from '../services/adminServices.js';

export const getResumen = async (req, res, next) => {
  try {
    const result = await adminService.getResumen();

    res.json(result);
  } catch (err) {
    return next(err);
  }
};

export const getUsuarios = async (req, res, next) => {
  try {
    const { buscar } = req.query;

    const result = await adminService.getUsuarios(buscar);

    res.json(result);
  } catch (err) {
    return next(err);
  }
};

export const postCrearAdmin = async (req, res, next) => {
  try {
    const { correo, clave } = req.body;

    const result = await adminService.crearAdmin(correo, clave);

    res.status(201).json(result);
  } catch (err) {
    return next(err);
  }
};

export const patchEstadoUsuario = async (req, res, next) => {
  try {
    const { usuarioId } = req.params;

    const { estado } = req.body;

    const result = await adminService.cambiarEstadoUsuario(usuarioId, estado, req.usuario.usuarioId);

    res.json(result);
  } catch (err) {
    return next(err);
  }
};

export const getEmpresas = async (req, res, next) => {
  try {
    const result = await adminService.getEmpresas();

    res.json(result);
  } catch (err) {
    return next(err);
  }
};

export const patchEstadoEmpresa = async (req, res, next) => {
  try {
    const { empresaId } = req.params;

    const { estado } = req.body;

    const result = await adminService.cambiarEstadoEmpresa(empresaId, estado);

    res.json(result);
  } catch (err) {
    return next(err);
  }
};

export const getOfertas = async (req, res, next) => {
  try {
    const result = await adminService.getOfertas();

    res.json(result);
  } catch (err) {
    return next(err);
  }
};

export const patchEstadoOferta = async (req, res, next) => {
  try {
    const { ofertaId } = req.params;

    const { estado } = req.body;

    const result = await adminService.cambiarEstadoOferta(ofertaId, estado);

    res.json(result);
  } catch (err) {
    return next(err);
  }
};

export const deleteOferta = async (req, res, next) => {
  try {
    const { ofertaId } = req.params;

    const result = await adminService.eliminarOferta(ofertaId);

    res.json(result);
  } catch (err) {
    return next(err);
  }
};

export const getValoraciones = async (req, res, next) => {
  try {
    const result = await adminService.getValoraciones();

    res.json(result);
  } catch (err) {
    return next(err);
  }
};

export const patchEstadoValoracion = async (req, res, next) => {
  try {
    const { valoracionId } = req.params;

    const { estado } = req.body;

    const result = await adminService.cambiarEstadoValoracion(valoracionId, estado);

    res.json(result);
  } catch (err) {
    return next(err);
  }
};

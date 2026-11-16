import * as valoracionesService from '../services/valoracionesServices.js';

export const getValoraciones = async (req, res, next) => {
  try {
    const datos = await valoracionesService.obtenerValoraciones(req.query);
    res.json(datos);
  } catch (err) {
    return next(err);
  }
};

export const getOpinionesEmpresa = async (req, res, next) => {
  try {
    const datos = await valoracionesService.obtenerOpinionesEmpresa(req.params.empresaId);
    res.json(datos);
  } catch (err) {
    return next(err);
  }
};

export const getMisValoraciones = async (req, res, next) => {
  try {
    const datos = await valoracionesService.obtenerMisValoraciones(req.usuario.candidatoId);
    res.json(datos);
  } catch (err) {
    return next(err);
  }
};

export const postCrearValoracion = async (req, res, next) => {
  try {
    const { empresaId, calificacion, comentario, anonimo } = req.body;

    const nueva = await valoracionesService.crearValoracion(req.usuario.candidatoId, empresaId, calificacion, comentario, anonimo);

    res.status(201).json(nueva);
  } catch (err) {
    return next(err);
  }
};

export const postReportarValoracion = async (req, res, next) => {
  try {
    const datos = await valoracionesService.reportarValoracion(req.params.valoracionId, req.usuario.usuarioId);
    res.json(datos);
  } catch (err) {
    return next(err);
  }
};

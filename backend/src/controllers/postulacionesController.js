import * as postulacionesService from '../services/postulacionesServices.js';

export const postCrearPostulacion = async (req, res, next) => {
  try {
    const { ofertaId, cartaPresentacion } = req.body;
    const nueva = await postulacionesService.crearPostulacion(
      req.usuario.candidatoId,
      ofertaId,
      cartaPresentacion
    );
    res.status(201).json(nueva);
  } catch (err) {
    return next(err);
  }
};

export const getMisPostulaciones = async (req, res, next) => {
  try {
    const lista = await postulacionesService.getMisPostulaciones(req.usuario.candidatoId);
    res.json(lista);
  } catch (err) {
    return next(err);
  }
};

export const getAplicantesOferta = async (req, res, next) => {
  try {
    const aplicantes = await postulacionesService.getAplicantesPorOferta(
      req.params.ofertaId,
      req.usuario.empresaId
    );
    res.json(aplicantes);
  } catch (err) {
    return next(err);
  }
};

export const getPostulacionById = async (req, res, next) => {
  try {
    const detalle = await postulacionesService.getDetallePostulacion(
      req.params.id,
      req.usuario.empresaId
    );
    res.json(detalle);
  } catch (err) {
    return next(err);
  }
};

export const patchEstadoPostulacion = async (req, res, next) => {
  try {
    const actualizada = await postulacionesService.actualizarEstadoPostulacion(
      req.params.id,
      req.usuario.empresaId,
      req.body.estado
    );
    res.json(actualizada);
  } catch (err) {
    return next(err);
  }
};
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

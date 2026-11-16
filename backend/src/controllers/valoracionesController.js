import * as valoracionesService from '../services/valoracionesServices.js';

export const getValoraciones = async (req, res, next) => {
  try {
    const datos = await valoracionesService.obtenerValoraciones(req.query);
    res.json(datos);
  } catch (err) {
    next(err);
  }
};

export const getOpinionesEmpresa = async (req, res, next) => {
  try {
    const empresaId = Number(req.params.empresaId);

    if (!Number.isSafeInteger(empresaId) || empresaId <= 0) {
      return res.status(400).json({ message: 'ID de empresa no valido' });
    }

    const datos = await valoracionesService.obtenerOpinionesEmpresa(empresaId);

    if (!datos) {
      return res.status(404).json({ message: 'Empresa no encontrada' });
    }

    res.json(datos);
  } catch (err) {
    next(err);
  }
};

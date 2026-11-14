import * as candidatoService from '../services/candidatoServices.js';

export const getPerfil = async (req, res, next) => {
  try {
    const perfil = await candidatoService.getPerfilCandidato(req.usuario.candidatoId);
    res.json(perfil);
  } catch (err) {
    return next(err);
  }
};

export const putPerfil = async (req, res, next) => {
  try {
    const perfilActualizado = await candidatoService.actualizarPerfilCandidato(
      req.usuario.candidatoId,
      req.body
    );
    res.json(perfilActualizado);
  } catch (err) {
    return next(err);
  }
};

export const getDashboard = async (req, res, next) => {
  try {
    const indicadores = await candidatoService.getDashboardCandidato(req.usuario.candidatoId);
    res.json(indicadores);
  } catch (err) {
    return next(err);
  }
};
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

export const getAlertas = async (req, res, next) => {
  try {
    const alertas = await candidatoService.getAlertas(req.usuario.candidatoId);
    res.json(alertas);
  } catch (err) {
    return next(err);
  }
};

export const postCrearAlerta = async (req, res, next) => {
  try {
    const nueva = await candidatoService.crearAlerta(req.usuario.candidatoId, req.body);
    res.status(201).json(nueva);
  } catch (err) {
    return next(err);
  }
};

export const patchEstadoAlerta = async (req, res, next) => {
  try {
    const alerta = await candidatoService.cambiarEstadoAlerta(
      req.params.alertaId,
      req.usuario.candidatoId,
      req.body.activa
    );
    res.json(alerta);
  } catch (err) {
    return next(err);
  }
};

export const deleteAlerta = async (req, res, next) => {
  try {
    const resultado = await candidatoService.eliminarAlerta(req.params.alertaId, req.usuario.candidatoId);
    res.json(resultado);
  } catch (err) {
    return next(err);
  }
};
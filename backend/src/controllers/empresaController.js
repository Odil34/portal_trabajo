import * as empresaService from '../services/empresaServices.js';

export const getPerfil = async (req, res, next) => {
  try {
    const perfil = await empresaService.getPerfilEmpresa(req.usuario.empresaId);
    res.json(perfil);
  } catch (err) {
    return next(err);
  }
};

export const putPerfil = async (req, res, next) => {
  try {
    const actualizado = await empresaService.actualizarPerfilEmpresa(req.usuario.empresaId, req.body);
    res.json(actualizado);
  } catch (err) {
    return next(err);
  }
};

export const getDashboard = async (req, res, next) => {
  try {
    const dashboard = await empresaService.getDashboardEmpresa(req.usuario.empresaId);
    res.json(dashboard);
  } catch (err) {
    return next(err);
  }
};

export const getOfertas = async (req, res, next) => {
  try {
    const ofertas = await empresaService.getMisOfertas(req.usuario.empresaId);
    res.json(ofertas);
  } catch (err) {
    return next(err);
  }
};

export const postCrearOferta = async (req, res, next) => {
  try {
    const nueva = await empresaService.crearOferta(req.usuario.empresaId, req.body);
    res.status(201).json(nueva);
  } catch (err) {
    return next(err);
  }
};

export const putOferta = async (req, res, next) => {
  try {
    const editada = await empresaService.editarOferta(
      req.params.ofertaId,
      req.usuario.empresaId,
      req.body
    );
    res.json(editada);
  } catch (err) {
    return next(err);
  }
};

export const patchEstadoOferta = async (req, res, next) => {
  try {
    const actualizada = await empresaService.cambiarEstadoOferta(
      req.params.ofertaId,
      req.usuario.empresaId,
      req.body.estado
    );
    res.json(actualizada);
  } catch (err) {
    return next(err);
  }
};

export const deleteOferta = async (req, res, next) => {
  try {
    const resultado = await empresaService.eliminarOferta(req.params.ofertaId, req.usuario.empresaId);
    res.json(resultado);
  } catch (err) {
    return next(err);
  }
};

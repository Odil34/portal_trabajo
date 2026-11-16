import * as ofertasService from '../services/ofertasServices.js';

export const getCatalogos = async (req, res, next) => {
  try {
    const datos = await ofertasService.obtenerCatalogos();
    res.json(datos);
  } catch (err) {
    next(err);
  }
};

export const getOfertas = async (req, res, next) => {
  try {
    const datos = await ofertasService.buscarOfertas(req.query);
    res.json(datos);
  } catch (err) {
    next(err);
  }
};

export const getRecientes = async (req, res, next) => {
  try {
    const datos = await ofertasService.obtenerRecientes();
    res.json(datos);
  } catch (err) {
    next(err);
  }
};

export const getResumen = async (req, res, next) => {
  try {
    const datos = await ofertasService.obtenerResumen();
    res.json(datos);
  } catch (err) {
    next(err);
  }
};

export const getDetalle = async (req, res, next) => {
  try {
    const datos = await ofertasService.obtenerDetalle(req.params.id);
    res.json(datos);
  } catch (err) {
    next(err);
  }
};
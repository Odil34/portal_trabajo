import * as ofertasService from '../services/ofertasServices.js';
import { httpError } from '../utils/httpError.js';


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
    const id = Number(req.params.id);

    if (!Number.isSafeInteger(id) || id <= 0) {
      throw httpError('ID de oferta no valido', 400);
    }

    const datos = await ofertasService.obtenerDetalle(id);
    res.json(datos);
  } catch (err) {
    next(err);
  }
};
import { Router } from 'express';

import * as adminController from '../controllers/adminController.js';

import { verificarToken, verificarRol } from '../middlewares/auth.js';

import {
  runValidations,
  crearAdminValidators,
  estadoUsuarioValidators,
  estadoEmpresaValidators,
  estadoOfertaValidators,
  estadoValoracionValidators,
  idParamValidator
} from '../middlewares/validators.js';

const router = Router();

router.use(verificarToken, verificarRol('admin'));

router.get('/resumen', adminController.getResumen);

router.get('/usuarios', adminController.getUsuarios);

router.post('/usuarios', runValidations(crearAdminValidators), adminController.postCrearAdmin);

router.patch('/usuarios/:usuarioId/estado', runValidations(estadoUsuarioValidators), adminController.patchEstadoUsuario);

router.get('/empresas', adminController.getEmpresas);

router.patch('/empresas/:empresaId/estado', runValidations(estadoEmpresaValidators), adminController.patchEstadoEmpresa);

router.get('/ofertas', adminController.getOfertas);

router.patch('/ofertas/:ofertaId/estado', runValidations(estadoOfertaValidators), adminController.patchEstadoOferta);

router.delete('/ofertas/:ofertaId', runValidations([idParamValidator('ofertaId')]), adminController.deleteOferta);

router.get('/valoraciones', adminController.getValoraciones);

router.patch('/valoraciones/:valoracionId/estado', runValidations(estadoValoracionValidators), adminController.patchEstadoValoracion);

export default router;

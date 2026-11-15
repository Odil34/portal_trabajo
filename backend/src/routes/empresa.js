import { Router } from 'express';

import * as empresaController from '../controllers/empresaController.js';

import { verificarToken, verificarRol } from '../middlewares/auth.js';

import {
  runValidations,
  idParamValidator,
  perfilEmpresaValidators,
  ofertaEmpresaValidators,
  estadoOfertaEmpresaValidators
} from '../middlewares/validators.js';

const router = Router();

router.use(verificarToken, verificarRol('empresa'));

router.get('/perfil', empresaController.getPerfil);

router.put('/perfil', runValidations(perfilEmpresaValidators), empresaController.putPerfil);

router.get('/dashboard', empresaController.getDashboard);

router.get('/ofertas', empresaController.getOfertas);

router.post('/ofertas', runValidations(ofertaEmpresaValidators), empresaController.postCrearOferta);

router.put('/ofertas/:ofertaId', runValidations([idParamValidator('ofertaId')]), runValidations(ofertaEmpresaValidators), empresaController.putOferta);

router.patch('/ofertas/:ofertaId/estado', runValidations(estadoOfertaEmpresaValidators), empresaController.patchEstadoOferta);

router.delete('/ofertas/:ofertaId', runValidations([idParamValidator('ofertaId')]), empresaController.deleteOferta);

export default router;

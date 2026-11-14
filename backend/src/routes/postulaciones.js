import { Router } from 'express';
import * as postulacionesController from '../controllers/postulacionesController.js';
import { verificarToken, verificarRol } from '../middlewares/auth.js';
import {
  runValidations,
  idParamValidator,
  crearPostulacionValidators,
  estadoPostulacionValidators
} from '../middlewares/validators.js';

const router = Router();

router.post(
  '/',
  verificarToken,
  verificarRol('candidato'),
  runValidations(crearPostulacionValidators),
  postulacionesController.postCrearPostulacion
);

router.get(
  '/mias',
  verificarToken,
  verificarRol('candidato'),
  postulacionesController.getMisPostulaciones
);

router.get(
  '/oferta/:ofertaId',
  verificarToken,
  verificarRol('empresa'),
  runValidations([idParamValidator('ofertaId')]),
  postulacionesController.getAplicantesOferta
);

router.get(
  '/:id',
  verificarToken,
  verificarRol('empresa'),
  runValidations([idParamValidator('id')]),
  postulacionesController.getPostulacionById
);

router.patch(
  '/:id/estado',
  verificarToken,
  verificarRol('empresa'),
  runValidations(estadoPostulacionValidators),
  postulacionesController.patchEstadoPostulacion
);

export default router;
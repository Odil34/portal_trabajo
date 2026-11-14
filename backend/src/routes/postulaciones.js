import { Router } from 'express';
import { body, param } from 'express-validator';
import * as postulacionesController from '../controllers/postulacionesController.js';
import { verificarToken, verificarRol } from '../middlewares/auth.js';
import { runValidations } from '../middlewares/validators.js';

const router = Router();

const crearPostulacionValidators = [
  body('ofertaId').isInt({ min: 1 }).withMessage('El ID de la oferta es obligatorio y debe ser numérico'),
  body('cartaPresentacion').optional().isString()
];

const estadoPostulacionValidators = [
  param('id').isInt({ min: 1 }).withMessage('ID de postulación inválido'),
  body('estado')
    .isIn(['en_revision', 'aceptada', 'rechazada'])
    .withMessage('El estado debe ser en_revision, aceptada o rechazada')
];

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
  runValidations([param('ofertaId').isInt({ min: 1 }).withMessage('ID de oferta inválido')]),
  postulacionesController.getAplicantesOferta
);

router.get(
  '/:id',
  verificarToken,
  verificarRol('empresa'),
  runValidations([param('id').isInt({ min: 1 }).withMessage('ID de postulación inválido')]),
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
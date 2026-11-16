import { Router } from 'express';
import * as valoracionesController from '../controllers/valoracionesController.js';
import { verificarToken, verificarRol } from '../middlewares/auth.js';
import { runValidations, idParamValidator, crearValoracionValidators } from '../middlewares/validators.js';

const router = Router();

router.get('/', valoracionesController.getValoraciones);
router.get('/mias', verificarToken, verificarRol('candidato'), valoracionesController.getMisValoraciones);
router.post('/', verificarToken, verificarRol('candidato'), runValidations(crearValoracionValidators), valoracionesController.postCrearValoracion);
router.post('/:valoracionId/reportar', verificarToken, runValidations([idParamValidator('valoracionId')]), valoracionesController.postReportarValoracion);
router.get('/:empresaId', runValidations([idParamValidator('empresaId')]), valoracionesController.getOpinionesEmpresa);

export default router;

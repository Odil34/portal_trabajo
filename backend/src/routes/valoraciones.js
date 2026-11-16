import { Router } from 'express';
import * as valoracionesController from '../controllers/valoracionesController.js';
import { runValidations, idParamValidator } from '../middlewares/validators.js';

const router = Router();

router.get('/', valoracionesController.getValoraciones);
router.get('/:empresaId', runValidations([idParamValidator('empresaId')]), valoracionesController.getOpinionesEmpresa);

export default router;

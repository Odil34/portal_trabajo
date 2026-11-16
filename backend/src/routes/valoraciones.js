import { Router } from 'express';
import * as valoracionesController from '../controllers/valoracionesController.js';

const router = Router();

router.get('/', valoracionesController.getValoraciones);
router.get('/:empresaId', valoracionesController.getOpinionesEmpresa);

export default router;

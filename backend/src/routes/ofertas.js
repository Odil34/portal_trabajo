import { Router } from 'express';
import * as ofertasController from '../controllers/ofertasController.js';

const router = Router();

router.get('/catalogos', ofertasController.getCatalogos);
router.get('/', ofertasController.getOfertas);
router.get('/recientes', ofertasController.getRecientes);
router.get('/resumen', ofertasController.getResumen);
router.get('/:id', ofertasController.getDetalle);

export default router;

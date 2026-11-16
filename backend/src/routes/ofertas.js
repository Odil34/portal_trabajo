import { Router } from 'express';
import * as ofertasController from '../controllers/ofertasController.js';
import { runValidations, idParamValidator, buscarOfertasValidators } from '../middlewares/validators.js';

const router = Router();

router.get('/catalogos', ofertasController.getCatalogos);
router.get('/', runValidations(buscarOfertasValidators), ofertasController.getOfertas);
router.get('/recientes', ofertasController.getRecientes);
router.get('/resumen', ofertasController.getResumen);
router.get('/:id', runValidations([idParamValidator('id')]), ofertasController.getDetalle);

export default router;

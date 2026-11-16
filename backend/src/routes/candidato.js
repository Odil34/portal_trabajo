import { Router } from 'express';
import * as candidatoController from '../controllers/candidatoController.js';
import { verificarToken, verificarRol } from '../middlewares/auth.js';
import {
  runValidations,
  idParamValidator,
  actualizarPerfilValidators,
  crearAlertaValidators,
  estadoAlertaValidators
} from '../middlewares/validators.js';

const router = Router();

router.get('/perfil', verificarToken, verificarRol('candidato'), candidatoController.getPerfil);

router.put(
  '/perfil',
  verificarToken,
  verificarRol('candidato'),
  runValidations(actualizarPerfilValidators),
  candidatoController.putPerfil
);

router.get('/dashboard', verificarToken, verificarRol('candidato'), candidatoController.getDashboard);

router.get('/alertas', verificarToken, verificarRol('candidato'), candidatoController.getAlertas);

router.post(
  '/alertas',
  verificarToken,
  verificarRol('candidato'),
  runValidations(crearAlertaValidators),
  candidatoController.postCrearAlerta
);

router.patch(
  '/alertas/:alertaId',
  verificarToken,
  verificarRol('candidato'),
  runValidations(estadoAlertaValidators),
  candidatoController.patchEstadoAlerta
);

router.delete(
  '/alertas/:alertaId',
  verificarToken,
  verificarRol('candidato'),
  runValidations([idParamValidator('alertaId')]),
  candidatoController.deleteAlerta
);

export default router;

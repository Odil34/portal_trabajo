import { Router } from 'express';
import * as candidatoController from '../controllers/candidatoController.js';
import { verificarToken, verificarRol } from '../middlewares/auth.js';
import { runValidations, actualizarPerfilValidators } from '../middlewares/validators.js';

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

export default router;
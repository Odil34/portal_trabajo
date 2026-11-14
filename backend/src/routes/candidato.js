import { Router } from 'express';
import { body } from 'express-validator';
import * as candidatoController from '../controllers/candidatoController.js';
import { verificarToken, verificarRol } from '../middlewares/auth.js';
import { runValidations } from '../middlewares/validators.js';

const router = Router();

const actualizarPerfilValidators = [
  body('nombres').trim().notEmpty().withMessage('Los nombres son obligatorios'),
  body('apellidos').trim().notEmpty().withMessage('Los apellidos son obligatorios'),
  body('areaInteres').trim().notEmpty().withMessage('El área de interés es obligatoria')
];

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
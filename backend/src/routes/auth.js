import { Router } from 'express';

import * as authController from '../controllers/authController.js';

import { verificarToken } from '../middlewares/auth.js';

import {
  runValidations,
  registroCandidatoValidators,
  registroEmpresaValidators,
  loginValidators
} from '../middlewares/validators.js';

const router = Router();

router.post('/registro/candidato', runValidations(registroCandidatoValidators), authController.postRegistrarCandidato);

router.post('/registro/empresa', runValidations(registroEmpresaValidators), authController.postRegistrarEmpresa);

router.post('/login', runValidations(loginValidators), authController.postLogin);

router.get('/perfil', verificarToken, authController.getPerfil);

export default router;

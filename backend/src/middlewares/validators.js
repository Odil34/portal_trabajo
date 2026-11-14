import { body, param, validationResult } from 'express-validator';

export const runValidations = (validations) => {
  return async (req, res, next) => {
    for (const validation of validations) {
      await validation.run(req);
    }

    const errors = validationResult(req);

    if (errors.isEmpty()) {
      return next();
    }

    return res.status(400).json({
      status: 'error',
      errors: errors.array()
    });
  };
};

export const idParamValidator = (campo) =>
  param(campo)
    .isInt({ min: 1 })
    .withMessage(`El parámetro ${campo} debe ser un número entero positivo`);

const correoValidator = body('correo')
  .trim()
  .isEmail()
  .withMessage('El correo no tiene un formato válido');

const claveValidator = body('clave')
  .isLength({ min: 8 })
  .withMessage('La contraseña debe tener al menos 8 caracteres');

export const registroCandidatoValidators = [
  body('nombres')
    .trim()
    .notEmpty()
    .withMessage('Los nombres son obligatorios'),

  body('apellidos')
    .trim()
    .notEmpty()
    .withMessage('Los apellidos son obligatorios'),

  body('areaInteres')
    .trim()
    .notEmpty()
    .withMessage('El área de interés es obligatoria'),

  correoValidator,
  claveValidator
];

export const registroEmpresaValidators = [
  body('nombre')
    .trim()
    .notEmpty()
    .withMessage('El nombre de la empresa es obligatorio'),

  body('nit')
    .trim()
    .notEmpty()
    .withMessage('El NIT es obligatorio'),

  body('sector')
    .trim()
    .notEmpty()
    .withMessage('El sector es obligatorio'),

  body('personaContacto')
    .trim()
    .notEmpty()
    .withMessage('La persona de contacto es obligatoria'),

  correoValidator,
  claveValidator
];

const estadoValidator = (estados) =>
  body('estado')
    .isIn(estados)
    .withMessage(`El estado debe ser: ${estados.join(', ')}`);

export const crearAdminValidators = [
  correoValidator,
  claveValidator
];

export const estadoUsuarioValidators = [
  idParamValidator('usuarioId'),
  estadoValidator(['activo', 'suspendido'])
];

export const estadoEmpresaValidators = [
  idParamValidator('empresaId'),
  estadoValidator(['verificada', 'rechazada', 'suspendida'])
];

export const estadoOfertaValidators = [
  idParamValidator('ofertaId'),
  estadoValidator(['activa', 'rechazada'])
];

export const estadoValoracionValidators = [
  idParamValidator('valoracionId'),
  estadoValidator(['publicada', 'oculta'])
];

export const loginValidators = [
  correoValidator,

  body('clave')
    .notEmpty()
    .withMessage('La contraseña es obligatoria'),

  body('rol')
    .isIn(['candidato', 'empresa', 'admin'])
    .withMessage('El rol debe ser candidato, empresa o admin')
];

export const crearPostulacionValidators = [
  body('ofertaId')
    .isInt({ min: 1 })
    .withMessage('El ID de la oferta es obligatorio y debe ser numérico'),

  body('cartaPresentacion')
    .optional()
    .isString()
    .withMessage('La carta de presentación debe ser texto')
];

export const estadoPostulacionValidators = [
  idParamValidator('id'),
  estadoValidator(['en_revision', 'aceptada', 'rechazada'])
];

export const actualizarPerfilValidators = [
  body('nombres')
    .trim()
    .notEmpty()
    .withMessage('Los nombres son obligatorios'),

  body('apellidos')
    .trim()
    .notEmpty()
    .withMessage('Los apellidos son obligatorios'),

  body('areaInteres')
    .trim()
    .notEmpty()
    .withMessage('El área de interés es obligatoria')
];

import jwt from 'jsonwebtoken';

import { httpError } from '../utils/httpError.js';

export const verificarToken = (req, res, next) => {
  const header = req.headers.authorization || '';

  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) return next(httpError('Debes iniciar sesión', 401));

  try {
    req.usuario = jwt.verify(token, process.env.JWT_SECRET);
    return next();
  } catch (err) {
    return next(httpError('La sesión expiró, inicia sesión de nuevo', 401));
  }
};

export const verificarRol = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.usuario.rol)) {
      return next(httpError('No tienes permiso para realizar esta acción', 403));
    }

    return next();
  };
};

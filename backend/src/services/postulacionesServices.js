import { pool } from '../db.js';
import { httpError } from '../utils/httpError.js';

export const crearPostulacion = async (candidatoId, ofertaId, cartaPresentacion) => {
  const ofertaRes = await pool.query(
    'SELECT ofertaid, estado FROM ofertas WHERE ofertaid = $1',
    [ofertaId]
  );

  if (ofertaRes.rowCount === 0) {
    throw httpError('La oferta laboral no existe', 404);
  }

  if (ofertaRes.rows[0].estado !== 'activa') {
    throw httpError('Esta oferta no está activa para recibir postulaciones', 400);
  }

  const yaAplicoRes = await pool.query(
    'SELECT postulacionid FROM postulaciones WHERE ofertaid = $1 AND candidatoid = $2',
    [ofertaId, candidatoId]
  );

  if (yaAplicoRes.rowCount > 0) {
    throw httpError('Ya te has postulado anteriormente a esta oferta', 400);
  }

  const candidatoRes = await pool.query(
    'SELECT cv FROM candidatos WHERE candidatoid = $1',
    [candidatoId]
  );
  const cvActual = candidatoRes.rows[0]?.cv || null;

  const insertQuery = `
    INSERT INTO postulaciones (ofertaid, candidatoid, cartapresentacion, cv)
    VALUES ($1, $2, $3, $4)
    RETURNING postulacionid AS "postulacionId",
              ofertaid AS "ofertaId",
              candidatoid AS "candidatoId",
              cartapresentacion AS "cartaPresentacion",
              cv,
              estado,
              fechapostulacion AS "fechaPostulacion"
  `;

  const result = await pool.query(insertQuery, [
    ofertaId,
    candidatoId,
    cartaPresentacion || null,
    cvActual
  ]);

  return result.rows[0];
};

export const getMisPostulaciones = async (candidatoId) => {
  const query = `
    SELECT p.postulacionid AS "postulacionId",
           p.ofertaid AS "ofertaId",
           o.titulo,
           e.nombre AS empresa,
           o.ubicacion,
           o.tipotrabajo AS "tipoTrabajo",
           o.salariominimo AS "salarioMinimo",
           o.salariomaximo AS "salarioMaximo",
           p.cartapresentacion AS "cartaPresentacion",
           p.estado,
           p.fechapostulacion AS "fechaPostulacion"
    FROM postulaciones p
    JOIN ofertas o ON o.ofertaid = p.ofertaid
    JOIN empresas e ON e.empresaid = o.empresaid
    WHERE p.candidatoid = $1
    ORDER BY p.fechapostulacion DESC
  `;

  const result = await pool.query(query, [candidatoId]);
  return result.rows;
};

export const getAplicantesPorOferta = async (ofertaId, empresaId) => {
  const ofertaRes = await pool.query(
    'SELECT ofertaid, empresaid FROM ofertas WHERE ofertaid = $1',
    [ofertaId]
  );

  if (ofertaRes.rowCount === 0) {
    throw httpError('Oferta no encontrada', 404);
  }

  if (ofertaRes.rows[0].empresaid !== empresaId) {
    throw httpError('No tienes permiso para ver los aplicantes de esta oferta', 403);
  }

  const query = `
    SELECT p.postulacionid AS "postulacionId",
           p.ofertaid AS "ofertaId",
           c.candidatoid AS "candidatoId",
           c.nombres,
           c.apellidos,
           u.correo,
           c.telefono,
           c.titulo,
           c.areainteres AS "areaInteres",
           c.experiencia,
           p.cartapresentacion AS "cartaPresentacion",
           COALESCE(p.cv, c.cv) AS cv,
           p.estado,
           p.fechapostulacion AS "fechaPostulacion"
    FROM postulaciones p
    JOIN candidatos c ON c.candidatoid = p.candidatoid
    JOIN usuarios u ON u.usuarioid = c.usuarioid
    WHERE p.ofertaid = $1
    ORDER BY p.fechapostulacion DESC
  `;

  const result = await pool.query(query, [ofertaId]);
  return result.rows;
};

export const getDetallePostulacion = async (postulacionId, empresaId) => {
  const query = `
    SELECT p.postulacionid AS "postulacionId",
           p.ofertaid AS "ofertaId",
           o.empresaid AS "empresaId",
           o.titulo AS "ofertaTitulo",
           c.candidatoid AS "candidatoId",
           c.nombres,
           c.apellidos,
           u.correo,
           c.telefono,
           c.areainteres AS "areaInteres",
           c.titulo,
           c.resumen,
           c.experiencia,
           COALESCE(p.cv, c.cv) AS cv,
           p.cartapresentacion AS "cartaPresentacion",
           p.estado,
           p.fechapostulacion AS "fechaPostulacion"
    FROM postulaciones p
    JOIN ofertas o ON o.ofertaid = p.ofertaid
    JOIN candidatos c ON c.candidatoid = p.candidatoid
    JOIN usuarios u ON u.usuarioid = c.usuarioid
    WHERE p.postulacionid = $1
  `;

  const result = await pool.query(query, [postulacionId]);

  if (result.rowCount === 0) {
    throw httpError('Postulación no encontrada', 404);
  }

  if (result.rows[0].empresaId !== empresaId) {
    throw httpError('No tienes permiso para ver esta postulación', 403);
  }

  return result.rows[0];
};

export const actualizarEstadoPostulacion = async (postulacionId, empresaId, estado) => {
  const validacionRes = await pool.query(
    `SELECT p.postulacionid, o.empresaid
     FROM postulaciones p
     JOIN ofertas o ON o.ofertaid = p.ofertaid
     WHERE p.postulacionid = $1`,
    [postulacionId]
  );

  if (validacionRes.rowCount === 0) {
    throw httpError('Postulación no encontrada', 404);
  }

  if (validacionRes.rows[0].empresaid !== empresaId) {
    throw httpError('No tienes permiso para modificar esta postulación', 403);
  }

  const updateRes = await pool.query(
    `UPDATE postulaciones
     SET estado = $1
     WHERE postulacionid = $2
     RETURNING postulacionid AS "postulacionId",
               ofertaid AS "ofertaId",
               candidatoid AS "candidatoId",
               estado,
               fechapostulacion AS "fechaPostulacion"`,
    [estado, postulacionId]
  );

  return updateRes.rows[0];
};
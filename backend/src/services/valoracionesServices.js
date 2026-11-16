import { pool } from '../db.js';
import { httpError } from '../utils/httpError.js';

export const obtenerValoraciones = async (filtros = {}) => {
  const valores = [];
  const condiciones = ["e.estado = 'verificada'"];

  if (filtros.buscar?.trim()) {
    valores.push(`%${filtros.buscar.trim()}%`);
    condiciones.push(`e.nombre ILIKE $${valores.length}`);
  }

  if (filtros.sector?.trim()) {
    valores.push(filtros.sector.trim());
    condiciones.push(`e.sector = $${valores.length}`);
  }

  const resultado = await pool.query(`
    SELECT e.empresaid AS "empresaId", e.nombre, e.sector, e.direccion,
      e.descripcion,
      ROUND(AVG(v.calificacion)::numeric, 1) AS calificacion,
      COUNT(v.valoracionid)::int AS "totalValoraciones"
    FROM empresas e
    LEFT JOIN valoraciones v
      ON v.empresaid = e.empresaid AND v.estado = 'publicada'
    WHERE ${condiciones.join(' AND ')}
    GROUP BY e.empresaid, e.nombre, e.sector, e.direccion, e.descripcion
    ORDER BY COUNT(v.valoracionid) DESC, e.nombre
  `, valores);

  return resultado.rows;
};

export const obtenerOpinionesEmpresa = async (empresaId) => {
  const resultado = await pool.query(`
    SELECT e.empresaid AS "empresaId", e.nombre, e.sector, e.descripcion,
      ROUND(AVG(v.calificacion)::numeric, 1) AS calificacion,
      COUNT(v.valoracionid)::int AS "totalValoraciones",
      COALESCE(json_agg(json_build_object(
        'valoracionId', v.valoracionid,
        'calificacion', v.calificacion,
        'comentario', v.comentario,
        'anonimo', v.anonimo,
        'nombreCandidato', CASE
          WHEN v.anonimo THEN 'Anónimo'
          ELSE CONCAT(c.nombres, ' ', LEFT(c.apellidos, 1), '.')
        END,
        'fecha', v.fecha
      ) ORDER BY v.fecha DESC) FILTER (WHERE v.valoracionid IS NOT NULL), '[]'::json) AS opiniones
    FROM empresas e
    LEFT JOIN valoraciones v
      ON v.empresaid = e.empresaid AND v.estado = 'publicada'
    LEFT JOIN candidatos c ON c.candidatoid = v.candidatoid
    WHERE e.empresaid = $1 AND e.estado = 'verificada'
    GROUP BY e.empresaid, e.nombre, e.sector, e.descripcion
  `, [empresaId]);

  if (resultado.rowCount === 0) {
    throw httpError('Empresa no encontrada', 404);
  }

  return resultado.rows[0];
};

export const obtenerMisValoraciones = async (candidatoId) => {
  const resultado = await pool.query(`
    SELECT v.valoracionid AS "valoracionId", e.nombre AS empresa, v.calificacion,
      v.comentario, v.anonimo, v.estado, v.fecha
    FROM valoraciones v
    INNER JOIN empresas e ON e.empresaid = v.empresaid
    WHERE v.candidatoid = $1
    ORDER BY v.fecha DESC
  `, [candidatoId]);

  return resultado.rows;
};

export const crearValoracion = async (candidatoId, empresaId, calificacion, comentario, anonimo) => {
  const empresa = await pool.query(
    "SELECT empresaid FROM empresas WHERE empresaid = $1 AND estado = 'verificada'",
    [empresaId]
  );

  if (empresa.rowCount === 0) {
    throw httpError('Empresa no encontrada', 404);
  }

  const previa = await pool.query(
    "SELECT valoracionid FROM valoraciones WHERE empresaid = $1 AND candidatoid = $2 AND estado IN ('pendiente', 'publicada')",
    [empresaId, candidatoId]
  );

  if (previa.rowCount > 0) {
    throw httpError('Ya valoraste esta empresa', 400);
  }

  const resultado = await pool.query(`
    INSERT INTO valoraciones (empresaid, candidatoid, calificacion, comentario, anonimo)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING valoracionid AS "valoracionId", calificacion, comentario, anonimo, estado, fecha
  `, [empresaId, candidatoId, calificacion, comentario, anonimo === true]);

  return resultado.rows[0];
};

export const reportarValoracion = async (valoracionId, usuarioId) => {
  const valoracion = await pool.query(`
    SELECT v.estado, c.usuarioid AS autor
    FROM valoraciones v
    INNER JOIN candidatos c ON c.candidatoid = v.candidatoid
    WHERE v.valoracionid = $1
  `, [valoracionId]);

  if (valoracion.rowCount === 0 || valoracion.rows[0].estado !== 'publicada') {
    throw httpError('Opinión no encontrada', 404);
  }

  if (valoracion.rows[0].autor === usuarioId) {
    throw httpError('No puedes reportar tu propia opinión', 400);
  }

  const previo = await pool.query(
    'SELECT reporteid FROM reportes WHERE valoracionid = $1 AND usuarioid = $2',
    [valoracionId, usuarioId]
  );

  if (previo.rowCount > 0) {
    throw httpError('Ya reportaste esta opinión', 400);
  }

  await pool.query('INSERT INTO reportes (valoracionid, usuarioid) VALUES ($1, $2)', [valoracionId, usuarioId]);

  await pool.query('UPDATE valoraciones SET reportes = reportes + 1 WHERE valoracionid = $1', [valoracionId]);

  return { message: 'Gracias, el administrador revisará esta opinión' };
};

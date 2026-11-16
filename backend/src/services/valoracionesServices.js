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

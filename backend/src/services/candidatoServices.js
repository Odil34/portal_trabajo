import { pool } from '../db.js';
import { httpError } from '../utils/httpError.js';

export const getPerfilCandidato = async (candidatoId) => {
  const query = `
    SELECT c.candidatoid AS "candidatoId",
           c.usuarioid AS "usuarioId",
           u.correo,
           c.nombres,
           c.apellidos,
           c.telefono,
           c.areainteres AS "areaInteres",
           c.titulo,
           c.resumen,
           c.experiencia,
           c.cv,
           c.visitas
    FROM candidatos c
    JOIN usuarios u ON u.usuarioid = c.usuarioid
    WHERE c.candidatoid = $1
  `;

  const result = await pool.query(query, [candidatoId]);

  if (result.rowCount === 0) {
    throw httpError('Perfil de candidato no encontrado', 404);
  }

  return result.rows[0];
};

export const actualizarPerfilCandidato = async (candidatoId, datos) => {
  const { nombres, apellidos, telefono, areaInteres, titulo, resumen, experiencia, cv } = datos;

  const query = `
    UPDATE candidatos
    SET nombres = $1,
        apellidos = $2,
        telefono = $3,
        areainteres = $4,
        titulo = $5,
        resumen = $6,
        experiencia = $7,
        cv = COALESCE($8, cv)
    WHERE candidatoid = $9
    RETURNING candidatoid AS "candidatoId",
              usuarioid AS "usuarioId",
              nombres,
              apellidos,
              telefono,
              areainteres AS "areaInteres",
              titulo,
              resumen,
              experiencia,
              cv,
              visitas
  `;

  const values = [
    nombres,
    apellidos,
    telefono || null,
    areaInteres,
    titulo || null,
    resumen || null,
    experiencia || null,
    cv || null,
    candidatoId
  ];

  const result = await pool.query(query, values);

  if (result.rowCount === 0) {
    throw httpError('Perfil de candidato no encontrado', 404);
  }

  return result.rows[0];
};

export const getDashboardCandidato = async (candidatoId) => {
  const candidatoRes = await pool.query(
    'SELECT visitas FROM candidatos WHERE candidatoid = $1',
    [candidatoId]
  );

  if (candidatoRes.rowCount === 0) {
    throw httpError('Candidato no encontrado', 404);
  }

  const statsRes = await pool.query(
    `SELECT COUNT(*)::int AS solicitudes,
            COUNT(*) FILTER (WHERE estado = 'aceptada')::int AS aceptadas
     FROM postulaciones
     WHERE candidatoid = $1`,
    [candidatoId]
  );

  return {
    visitas: candidatoRes.rows[0].visitas,
    solicitudes: statsRes.rows[0].solicitudes,
    aceptadas: statsRes.rows[0].aceptadas
  };
};
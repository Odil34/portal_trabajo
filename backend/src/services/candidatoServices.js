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

export const getAlertas = async (candidatoId) => {
  const query = `
    SELECT a.alertaid AS "alertaId",
           a.palabraclave AS "palabraClave",
           a.ubicacion,
           a.frecuencia,
           a.porcorreo AS "porCorreo",
           a.porsms AS "porSms",
           a.activa,
           (SELECT COUNT(*)::int
            FROM ofertas o
            JOIN empresas e ON e.empresaid = o.empresaid
            WHERE o.estado = 'activa'
              AND e.estado = 'verificada'
              AND (o.titulo ILIKE '%' || a.palabraclave || '%'
                   OR o.descripcion ILIKE '%' || a.palabraclave || '%'
                   OR o.sector ILIKE '%' || a.palabraclave || '%')
              AND (a.ubicacion = 'Todo el país'
                   OR (a.ubicacion = 'Remoto' AND o.modalidad = 'Remoto')
                   OR o.departamento = a.ubicacion)) AS coincidencias
    FROM alertas a
    WHERE a.candidatoid = $1
    ORDER BY a.fecha DESC, a.alertaid DESC
  `;

  const result = await pool.query(query, [candidatoId]);
  return result.rows;
};

export const crearAlerta = async (candidatoId, datos) => {
  const { palabraClave, ubicacion, frecuencia, porCorreo, porSms } = datos;

  if (!porCorreo && !porSms) {
    throw httpError('Elige al menos un medio de notificación', 400);
  }

  const result = await pool.query(
    `INSERT INTO alertas (candidatoid, palabraclave, ubicacion, frecuencia, porcorreo, porsms)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING alertaid AS "alertaId", palabraclave AS "palabraClave", ubicacion, frecuencia, activa`,
    [candidatoId, palabraClave, ubicacion, frecuencia, porCorreo, porSms]
  );

  return result.rows[0];
};

const buscarAlertaDeCandidato = async (alertaId, candidatoId) => {
  const result = await pool.query('SELECT candidatoid FROM alertas WHERE alertaid = $1', [alertaId]);

  if (result.rowCount === 0) {
    throw httpError('Alerta no encontrada', 404);
  }

  if (result.rows[0].candidatoid !== candidatoId) {
    throw httpError('No tienes permiso para modificar esta alerta', 403);
  }
};

export const cambiarEstadoAlerta = async (alertaId, candidatoId, activa) => {
  await buscarAlertaDeCandidato(alertaId, candidatoId);

  const result = await pool.query(
    'UPDATE alertas SET activa = $1 WHERE alertaid = $2 RETURNING alertaid AS "alertaId", activa',
    [activa, alertaId]
  );

  return result.rows[0];
};

export const eliminarAlerta = async (alertaId, candidatoId) => {
  await buscarAlertaDeCandidato(alertaId, candidatoId);

  await pool.query('DELETE FROM alertas WHERE alertaid = $1', [alertaId]);

  return { message: 'Alerta eliminada correctamente' };
};
import { pool } from '../db.js';

import { httpError } from '../utils/httpError.js';

import { crearUsuario } from './authServices.js';

const NOMBRE_USUARIO = `COALESCE(c.nombres || ' ' || c.apellidos, e.nombre, 'Administrador')`;

const ES_ESTE_MES = (campo) => `date_trunc('month', ${campo}) = date_trunc('month', NOW())`;

export const getResumen = async () => {
    const totales = await pool.query(`SELECT
        (SELECT COUNT(*) FROM usuarios)::int AS usuarios,
        (SELECT COUNT(*) FROM empresas WHERE estado = 'verificada')::int AS empresas,
        (SELECT COUNT(*) FROM ofertas WHERE estado = 'activa')::int AS "ofertasActivas",
        (SELECT COUNT(*) FROM empresas WHERE estado = 'pendiente')::int AS "empresasPendientes",
        (SELECT COUNT(*) FROM ofertas WHERE estado = 'en_revision')::int AS "ofertasPendientes",
        (SELECT COUNT(*) FROM valoraciones WHERE estado = 'pendiente' OR (estado = 'publicada' AND reportes > 0))::int AS "valoracionesPendientes"`);

    const actividad = await pool.query(`SELECT descripcion, fecha FROM (
            SELECT 'Se registró ' || ${NOMBRE_USUARIO} AS descripcion, u.fechaRegistro AS fecha
            FROM usuarios u
            LEFT JOIN candidatos c ON c.usuarioId = u.usuarioId
            LEFT JOIN empresas e ON e.usuarioId = u.usuarioId
            UNION ALL
            SELECT e.nombre || ' publicó la oferta ' || o.titulo, o.fechaPublicacion
            FROM ofertas o INNER JOIN empresas e ON e.empresaId = o.empresaId
            UNION ALL
            SELECT c.nombres || ' ' || c.apellidos || ' se postuló a ' || o.titulo, p.fechaPostulacion
            FROM postulaciones p
            INNER JOIN candidatos c ON c.candidatoId = p.candidatoId
            INNER JOIN ofertas o ON o.ofertaId = p.ofertaId
        ) actividad
        ORDER BY fecha DESC
        LIMIT 5`);

    const porSector = await pool.query(`SELECT sector, COUNT(*)::int AS total
        FROM ofertas
        WHERE estado = 'activa'
        GROUP BY sector
        ORDER BY total DESC`);

    const mes = await pool.query(`SELECT
        (SELECT COUNT(*) FROM candidatos c INNER JOIN usuarios u ON u.usuarioId = c.usuarioId WHERE ${ES_ESTE_MES('u.fechaRegistro')})::int AS candidatos,
        (SELECT COUNT(*) FROM empresas e INNER JOIN usuarios u ON u.usuarioId = e.usuarioId WHERE ${ES_ESTE_MES('u.fechaRegistro')})::int AS empresas,
        (SELECT COUNT(*) FROM postulaciones WHERE ${ES_ESTE_MES('fechaPostulacion')})::int AS postulaciones,
        (SELECT COUNT(*) FROM postulaciones WHERE estado = 'aceptada' AND ${ES_ESTE_MES('fechaPostulacion')})::int AS contrataciones`);

    return {
        totales: totales.rows[0],
        actividad: actividad.rows,
        porSector: porSector.rows,
        mes: mes.rows[0]
    };
};

export const getUsuarios = async (buscar = '') => {
    const result = await pool.query(`SELECT u.usuarioId AS "usuarioId", u.correo, u.estado, r.rol,
        u.fechaRegistro AS "fechaRegistro", ${NOMBRE_USUARIO} AS nombre
        FROM usuarios u
        INNER JOIN roles r ON r.rolId = u.rolId
        LEFT JOIN candidatos c ON c.usuarioId = u.usuarioId
        LEFT JOIN empresas e ON e.usuarioId = u.usuarioId
        WHERE ${NOMBRE_USUARIO} ILIKE $1 OR u.correo ILIKE $1
        ORDER BY u.usuarioId`, [`%${buscar}%`]);

    return result.rows;
};

export const crearAdmin = async (correo, clave) => {
    const usuarioId = await crearUsuario(pool, 'admin', correo, clave);

    return { message: 'Administrador creado correctamente', usuarioId };
};

export const cambiarEstadoUsuario = async (usuarioId, estado, adminId) => {
    if (Number(usuarioId) === adminId) {
        throw httpError('No puedes cambiar el estado de tu propia cuenta', 400);
    }

    const result = await pool.query(`UPDATE usuarios SET estado = $1
        WHERE usuarioId = $2
        RETURNING usuarioId AS "usuarioId", correo, estado`, [estado, usuarioId]);

    if (result.rowCount === 0) throw httpError('Usuario no encontrado', 404);

    return result.rows[0];
};

export const getEmpresas = async () => {
    const result = await pool.query(`SELECT e.empresaId AS "empresaId", e.nombre, e.nit, e.sector,
        e.personaContacto AS "personaContacto", e.correoContacto AS "correoContacto", e.estado,
        (SELECT COUNT(*) FROM ofertas o WHERE o.empresaId = e.empresaId)::int AS ofertas
        FROM empresas e
        ORDER BY CASE WHEN e.estado = 'pendiente' THEN 0 ELSE 1 END, e.nombre`);

    return result.rows;
};

export const cambiarEstadoEmpresa = async (empresaId, estado) => {
    const result = await pool.query(`UPDATE empresas SET estado = $1
        WHERE empresaId = $2
        RETURNING empresaId AS "empresaId", nombre, estado`, [estado, empresaId]);

    if (result.rowCount === 0) throw httpError('Empresa no encontrada', 404);

    return result.rows[0];
};

export const getOfertas = async () => {
    const result = await pool.query(`SELECT o.ofertaId AS "ofertaId", o.titulo, e.nombre AS empresa,
        o.fechaPublicacion AS "fechaPublicacion", o.estado,
        (SELECT COUNT(*) FROM postulaciones p WHERE p.ofertaId = o.ofertaId)::int AS postulaciones
        FROM ofertas o
        INNER JOIN empresas e ON e.empresaId = o.empresaId
        ORDER BY CASE WHEN o.estado = 'en_revision' THEN 0 ELSE 1 END, o.fechaPublicacion DESC`);

    return result.rows;
};

export const cambiarEstadoOferta = async (ofertaId, estado) => {
    const oferta = await pool.query('SELECT estado FROM ofertas WHERE ofertaId = $1', [ofertaId]);

    if (oferta.rowCount === 0) throw httpError('Oferta no encontrada', 404);

    if (oferta.rows[0].estado !== 'en_revision') {
        throw httpError('Solo se pueden aprobar o rechazar ofertas que están en revisión', 400);
    }

    const result = await pool.query(`UPDATE ofertas SET estado = $1
        WHERE ofertaId = $2
        RETURNING ofertaId AS "ofertaId", titulo, estado`, [estado, ofertaId]);

    return result.rows[0];
};

export const eliminarOferta = async (ofertaId) => {
    const result = await pool.query(`DELETE FROM ofertas WHERE ofertaId = $1
        RETURNING ofertaId AS "ofertaId", titulo`, [ofertaId]);

    if (result.rowCount === 0) throw httpError('Oferta no encontrada', 404);

    return { message: 'Oferta eliminada correctamente', oferta: result.rows[0] };
};

export const getValoraciones = async () => {
    const result = await pool.query(`SELECT v.valoracionId AS "valoracionId", e.nombre AS empresa,
        c.nombres || ' ' || c.apellidos AS autor, v.anonimo, v.calificacion, v.comentario,
        v.estado, v.reportes, v.fecha
        FROM valoraciones v
        INNER JOIN empresas e ON e.empresaId = v.empresaId
        INNER JOIN candidatos c ON c.candidatoId = v.candidatoId
        WHERE v.estado = 'pendiente' OR (v.estado = 'publicada' AND v.reportes > 0)
        ORDER BY v.fecha DESC`);

    return result.rows;
};

export const cambiarEstadoValoracion = async (valoracionId, estado) => {
    const result = await pool.query(`UPDATE valoraciones SET estado = $1, reportes = 0
        WHERE valoracionId = $2
        RETURNING valoracionId AS "valoracionId", estado`, [estado, valoracionId]);

    if (result.rowCount === 0) throw httpError('Valoración no encontrada', 404);

    return result.rows[0];
};

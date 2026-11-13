import { pool } from '../db.js';

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { httpError } from '../utils/httpError.js';

const CONSULTA_USUARIO = `SELECT u.usuarioId AS "usuarioId", u.correo, u.clave, u.estado, r.rol,
    c.candidatoId AS "candidatoId", e.empresaId AS "empresaId",
    COALESCE(c.nombres || ' ' || c.apellidos, e.nombre, 'Administrador') AS nombre
    FROM usuarios u
    INNER JOIN roles r ON r.rolId = u.rolId
    LEFT JOIN candidatos c ON c.usuarioId = u.usuarioId
    LEFT JOIN empresas e ON e.usuarioId = u.usuarioId`;

const encriptarClave = (clave) => {
    const SALT_ROUNDS = 10;

    const salt = bcrypt.genSaltSync(SALT_ROUNDS);

    return bcrypt.hashSync(clave, salt);
};

const crearSesion = (fila) => {
    const usuario = {
        usuarioId: fila.usuarioId,
        rol: fila.rol,
        nombre: fila.nombre,
        candidatoId: fila.candidatoId,
        empresaId: fila.empresaId
    };

    const token = jwt.sign(usuario, process.env.JWT_SECRET, { expiresIn: '8h' });

    return { token, usuario };
};

const crearUsuario = async (client, rol, correo, clave) => {
    const result = await client.query(`INSERT INTO usuarios (rolId, correo, clave)
        VALUES ((SELECT rolId FROM roles WHERE rol = $1), $2, $3)
        RETURNING usuarioId AS "usuarioId"`, [rol, correo, encriptarClave(clave)]);

    return result.rows[0].usuarioId;
};

export const getUsuarioById = async (usuarioId) => {
    const result = await pool.query(`${CONSULTA_USUARIO} WHERE u.usuarioId = $1`, [usuarioId]);

    if (result.rowCount === 0) throw httpError('Usuario no encontrado', 404);

    const { clave, ...usuario } = result.rows[0];

    return usuario;
};

export const registrarCandidato = async (nombres, apellidos, correo, telefono, areaInteres, clave) => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const usuarioId = await crearUsuario(client, 'candidato', correo, clave);

        await client.query(`INSERT INTO candidatos (usuarioId, nombres, apellidos, telefono, areaInteres)
            VALUES ($1, $2, $3, $4, $5)`, [usuarioId, nombres, apellidos, telefono || null, areaInteres]);

        await client.query('COMMIT');

        return crearSesion(await getUsuarioById(usuarioId));
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
};

export const registrarEmpresa = async (nombre, nit, sector, sitioWeb, personaContacto, correo, clave) => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const usuarioId = await crearUsuario(client, 'empresa', correo, clave);

        await client.query(`INSERT INTO empresas (usuarioId, nombre, nit, sector, sitioWeb, personaContacto, correoContacto)
            VALUES ($1, $2, $3, $4, $5, $6, $7)`, [usuarioId, nombre, nit, sector, sitioWeb || null, personaContacto, correo]);

        await client.query('COMMIT');

        return crearSesion(await getUsuarioById(usuarioId));
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
};

export const login = async (correo, clave, rol) => {
    const result = await pool.query(`${CONSULTA_USUARIO} WHERE u.correo = $1`, [correo]);

    const usuario = result.rows[0];

    if (!usuario || !bcrypt.compareSync(clave, usuario.clave)) {
        throw httpError('Correo o contraseña incorrectos', 401);
    }

    if (usuario.rol !== rol) {
        throw httpError(`Esta cuenta no es de tipo ${rol}, selecciona la pestaña correcta`, 403);
    }

    if (usuario.estado === 'suspendido') {
        throw httpError('Tu cuenta está suspendida, comunícate con el administrador', 403);
    }

    return crearSesion(usuario);
};

import { pool } from '../db.js';
import { httpError } from '../utils/httpError.js';

// Revisa que la oferta exista y que sea de la empresa que inició sesión
const buscarOfertaDeEmpresa = async (ofertaId, empresaId) => {
  const result = await pool.query(
    'SELECT ofertaid, empresaid, estado FROM ofertas WHERE ofertaid = $1',
    [ofertaId]
  );

  if (result.rowCount === 0) {
    throw httpError('Oferta no encontrada', 404);
  }

  if (result.rows[0].empresaid !== empresaId) {
    throw httpError('No tienes permiso para modificar esta oferta', 403);
  }

  return result.rows[0];
};

export const getPerfilEmpresa = async (empresaId) => {
  const query = `
    SELECT e.empresaid AS "empresaId",
           e.nombre,
           e.nit,
           e.sector,
           e.sitioweb AS "sitioWeb",
           e.descripcion,
           e.personacontacto AS "personaContacto",
           e.correocontacto AS "correoContacto",
           e.telefono,
           e.direccion,
           e.estado,
           e.visitas,
           u.correo
    FROM empresas e
    JOIN usuarios u ON u.usuarioid = e.usuarioid
    WHERE e.empresaid = $1
  `;

  const result = await pool.query(query, [empresaId]);

  if (result.rowCount === 0) {
    throw httpError('Empresa no encontrada', 404);
  }

  return result.rows[0];
};

export const actualizarPerfilEmpresa = async (empresaId, datos) => {
  const { nombre, sector, sitioWeb, descripcion, personaContacto, correoContacto, telefono, direccion } = datos;

  const query = `
    UPDATE empresas
    SET nombre = $1,
        sector = $2,
        sitioweb = $3,
        descripcion = $4,
        personacontacto = $5,
        correocontacto = $6,
        telefono = $7,
        direccion = $8
    WHERE empresaid = $9
    RETURNING empresaid AS "empresaId",
              nombre,
              nit,
              sector,
              sitioweb AS "sitioWeb",
              descripcion,
              personacontacto AS "personaContacto",
              correocontacto AS "correoContacto",
              telefono,
              direccion,
              estado
  `;

  const values = [
    nombre,
    sector,
    sitioWeb || null,
    descripcion || null,
    personaContacto,
    correoContacto,
    telefono || null,
    direccion || null,
    empresaId
  ];

  const result = await pool.query(query, values);

  if (result.rowCount === 0) {
    throw httpError('Empresa no encontrada', 404);
  }

  return result.rows[0];
};

export const getDashboardEmpresa = async (empresaId) => {
  const empresaRes = await pool.query(
    'SELECT nombre, personacontacto AS "personaContacto", visitas FROM empresas WHERE empresaid = $1',
    [empresaId]
  );

  if (empresaRes.rowCount === 0) {
    throw httpError('Empresa no encontrada', 404);
  }

  const ofertasRes = await pool.query(
    `SELECT COUNT(*)::int AS "ofertasActivas"
     FROM ofertas
     WHERE empresaid = $1 AND estado = 'activa'`,
    [empresaId]
  );

  const postulacionesRes = await pool.query(
    `SELECT COUNT(*) FILTER (WHERE p.estado = 'enviada')::int AS "postulacionesNuevas",
            COUNT(*) FILTER (WHERE p.estado = 'aceptada')::int AS aceptados
     FROM postulaciones p
     JOIN ofertas o ON o.ofertaid = p.ofertaid
     WHERE o.empresaid = $1`,
    [empresaId]
  );

  const recientesRes = await pool.query(
    `SELECT p.postulacionid AS "postulacionId",
            c.nombres || ' ' || c.apellidos AS candidato,
            o.titulo AS oferta,
            p.estado,
            p.fechapostulacion AS "fechaPostulacion"
     FROM postulaciones p
     JOIN ofertas o ON o.ofertaid = p.ofertaid
     JOIN candidatos c ON c.candidatoid = p.candidatoid
     WHERE o.empresaid = $1
     ORDER BY p.fechapostulacion DESC
     LIMIT 5`,
    [empresaId]
  );

  return {
    nombre: empresaRes.rows[0].nombre,
    personaContacto: empresaRes.rows[0].personaContacto,
    visitas: empresaRes.rows[0].visitas,
    ofertasActivas: ofertasRes.rows[0].ofertasActivas,
    postulacionesNuevas: postulacionesRes.rows[0].postulacionesNuevas,
    aceptados: postulacionesRes.rows[0].aceptados,
    recientes: recientesRes.rows
  };
};

export const getMisOfertas = async (empresaId) => {
  const query = `
    SELECT o.ofertaid AS "ofertaId",
           o.titulo,
           o.ubicacion,
           o.sector,
           o.tipotrabajo AS "tipoTrabajo",
           o.tipocontrato AS "tipoContrato",
           o.experiencia,
           o.salariominimo AS "salarioMinimo",
           o.salariomaximo AS "salarioMaximo",
           o.vacantes,
           o.descripcion,
           o.responsabilidades,
           o.requisitos,
           o.beneficios,
           o.personacontacto AS "personaContacto",
           o.correocontacto AS "correoContacto",
           o.telefonocontacto AS "telefonoContacto",
           TO_CHAR(o.fechacierre, 'YYYY-MM-DD') AS "fechaCierre",
           o.estado,
           o.fechapublicacion AS "fechaPublicacion",
           (SELECT COUNT(*) FROM postulaciones p WHERE p.ofertaid = o.ofertaid)::int AS postulaciones
    FROM ofertas o
    WHERE o.empresaid = $1
    ORDER BY o.fechapublicacion DESC
  `;

  const result = await pool.query(query, [empresaId]);
  return result.rows;
};

export const crearOferta = async (empresaId, datos) => {
  const {
    titulo, ubicacion, sector, tipoTrabajo, tipoContrato, experiencia,
    salarioMinimo, salarioMaximo, vacantes, descripcion, responsabilidades,
    requisitos, beneficios, personaContacto, correoContacto, telefonoContacto, fechaCierre
  } = datos;

  if (salarioMinimo && salarioMaximo && Number(salarioMaximo) < Number(salarioMinimo)) {
    throw httpError('El salario máximo no puede ser menor que el salario mínimo', 400);
  }

  const query = `
    INSERT INTO ofertas (empresaid, titulo, ubicacion, sector, tipotrabajo, tipocontrato, experiencia,
                         salariominimo, salariomaximo, vacantes, descripcion, responsabilidades, requisitos,
                         beneficios, personacontacto, correocontacto, telefonocontacto, fechacierre, estado)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, 'en_revision')
    RETURNING ofertaid AS "ofertaId",
              titulo,
              estado,
              fechapublicacion AS "fechaPublicacion"
  `;

  const values = [
    empresaId,
    titulo,
    ubicacion,
    sector,
    tipoTrabajo,
    tipoContrato,
    experiencia,
    salarioMinimo || null,
    salarioMaximo || null,
    vacantes,
    descripcion,
    responsabilidades,
    requisitos,
    beneficios || null,
    personaContacto,
    correoContacto,
    telefonoContacto || null,
    fechaCierre
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};

export const editarOferta = async (ofertaId, empresaId, datos) => {
  const oferta = await buscarOfertaDeEmpresa(ofertaId, empresaId);

  if (oferta.estado === 'cancelada') {
    throw httpError('No se puede editar una oferta cancelada', 400);
  }

  const {
    titulo, ubicacion, sector, tipoTrabajo, tipoContrato, experiencia,
    salarioMinimo, salarioMaximo, vacantes, descripcion, responsabilidades,
    requisitos, beneficios, personaContacto, correoContacto, telefonoContacto, fechaCierre
  } = datos;

  if (salarioMinimo && salarioMaximo && Number(salarioMaximo) < Number(salarioMinimo)) {
    throw httpError('El salario máximo no puede ser menor que el salario mínimo', 400);
  }

  const query = `
    UPDATE ofertas
    SET titulo = $1,
        ubicacion = $2,
        sector = $3,
        tipotrabajo = $4,
        tipocontrato = $5,
        experiencia = $6,
        salariominimo = $7,
        salariomaximo = $8,
        vacantes = $9,
        descripcion = $10,
        responsabilidades = $11,
        requisitos = $12,
        beneficios = $13,
        personacontacto = $14,
        correocontacto = $15,
        telefonocontacto = $16,
        fechacierre = $17
    WHERE ofertaid = $18
    RETURNING ofertaid AS "ofertaId",
              titulo,
              estado
  `;

  const values = [
    titulo,
    ubicacion,
    sector,
    tipoTrabajo,
    tipoContrato,
    experiencia,
    salarioMinimo || null,
    salarioMaximo || null,
    vacantes,
    descripcion,
    responsabilidades,
    requisitos,
    beneficios || null,
    personaContacto,
    correoContacto,
    telefonoContacto || null,
    fechaCierre,
    ofertaId
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};

export const cambiarEstadoOferta = async (ofertaId, empresaId, estado) => {
  const oferta = await buscarOfertaDeEmpresa(ofertaId, empresaId);

  if (oferta.estado === 'cancelada') {
    throw httpError('La oferta ya está cancelada y no se puede cambiar', 400);
  }

  if (estado === 'inactiva' && oferta.estado !== 'activa') {
    throw httpError('Solo se pueden inactivar ofertas que están activas', 400);
  }

  if (estado === 'activa' && oferta.estado !== 'inactiva') {
    throw httpError('Solo se pueden activar ofertas que están inactivas', 400);
  }

  const result = await pool.query(
    `UPDATE ofertas
     SET estado = $1
     WHERE ofertaid = $2
     RETURNING ofertaid AS "ofertaId", titulo, estado`,
    [estado, ofertaId]
  );

  return result.rows[0];
};

export const eliminarOferta = async (ofertaId, empresaId) => {
  await buscarOfertaDeEmpresa(ofertaId, empresaId);

  const result = await pool.query(
    'DELETE FROM ofertas WHERE ofertaid = $1 RETURNING ofertaid AS "ofertaId", titulo',
    [ofertaId]
  );

  return { message: 'Oferta eliminada correctamente', oferta: result.rows[0] };
};

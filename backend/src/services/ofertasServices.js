import { pool } from '../db.js';
import { httpError } from '../utils/httpError.js';

const campos = `o.ofertaid AS "ofertaId", o.empresaid AS "empresaId",
  o.titulo, o.ubicacion, d.distritoid AS "distritoId",
  d.nombre AS distrito, m.nombre AS municipio, dep.nombre AS departamento,
  o.modalidad, o.sector, o.tipotrabajo AS "tipoTrabajo",
  o.tipocontrato AS "tipoContrato", o.experiencia,
  o.salariominimo AS "salarioMinimo", o.salariomaximo AS "salarioMaximo",
  o.vacantes, o.descripcion, o.responsabilidades, o.requisitos,
  o.beneficios, o.personacontacto AS "personaContacto",
  o.correocontacto AS "correoContacto", o.telefonocontacto AS "telefonoContacto",
  o.fechacierre AS "fechaCierre", o.fechapublicacion AS "fechaPublicacion",
  e.nombre AS empresa, e.direccion, e.sitioweb AS "sitioWeb"`;

const joins = `
  FROM ofertas o
  INNER JOIN empresas e ON o.empresaid = e.empresaid
  LEFT JOIN distritos d ON o.distritoid = d.distritoid
  LEFT JOIN municipios m ON d.municipioid = m.municipioid
  LEFT JOIN departamentos dep ON m.departamentoid = dep.departamentoid
`;

export const obtenerCatalogos = async () => {
  const [departamentos, distritos, sectores] = await Promise.all([
    pool.query(`
      SELECT departamentoid AS "departamentoId", nombre
      FROM departamentos
      ORDER BY nombre
    `),
    pool.query(`
      SELECT d.distritoid AS "distritoId", d.nombre,
        m.nombre AS municipio, dep.nombre AS departamento
      FROM distritos d
      INNER JOIN municipios m ON d.municipioid = m.municipioid
      INNER JOIN departamentos dep ON m.departamentoid = dep.departamentoid
      ORDER BY dep.nombre, d.nombre
    `),
    pool.query(`
      SELECT DISTINCT o.sector
      FROM ofertas o
      INNER JOIN empresas e ON e.empresaid = o.empresaid
      WHERE o.estado = 'activa' AND e.estado = 'verificada'
      ORDER BY o.sector
    `)
  ]);

  return {
    departamentos: departamentos.rows,
    distritos: distritos.rows,
    sectores: sectores.rows.map(item => item.sector),
    modalidades: ['Presencial', 'Híbrido', 'Remoto']
  };
};

export const obtenerRecientes = async () => {
  const resultado = await pool.query(`
    SELECT ${campos}
    ${joins}
    WHERE o.estado = 'activa'
      AND e.estado = 'verificada'
    ORDER BY o.fechapublicacion DESC, o.ofertaid DESC
    LIMIT 3
  `);

  return resultado.rows;
};

export const obtenerResumen = async () => {
  const resultado = await pool.query(`
    SELECT
      (SELECT COUNT(*)::int FROM empresas WHERE estado = 'verificada') AS empresas,
      (SELECT COUNT(*)::int FROM usuarios WHERE estado = 'activo') AS usuarios,
      (SELECT COUNT(*)::int
       FROM ofertas o
       INNER JOIN empresas e ON e.empresaid = o.empresaid
       WHERE o.estado = 'activa' AND e.estado = 'verificada') AS empleos,
      (SELECT COUNT(*)::int
       FROM postulaciones p
       INNER JOIN ofertas o ON o.ofertaid = p.ofertaid
       INNER JOIN empresas e ON e.empresaid = o.empresaid
       WHERE o.estado = 'activa' AND e.estado = 'verificada') AS postulaciones
  `);

  return resultado.rows[0];
};

export const obtenerDetalle = async (id) => {
  const resultado = await pool.query(`
    SELECT ${campos},
      (SELECT ROUND(AVG(v.calificacion)::numeric, 1)
       FROM valoraciones v
       WHERE v.empresaid = e.empresaid
         AND v.estado = 'publicada') AS calificacion,
      (SELECT COUNT(*)::int
       FROM valoraciones v
       WHERE v.empresaid = e.empresaid
         AND v.estado = 'publicada') AS "totalValoraciones",
      (SELECT COALESCE(json_agg(json_build_object(
          'calificacion', v.calificacion,
          'comentario', v.comentario,
          'anonimo', v.anonimo,
          'nombreCandidato', CASE
            WHEN v.anonimo THEN 'Anónimo'
            ELSE CONCAT(c.nombres, ' ', LEFT(c.apellidos, 1), '.')
          END,
          'fecha', v.fecha
        ) ORDER BY v.fecha DESC), '[]'::json)
       FROM valoraciones v
       LEFT JOIN candidatos c ON c.candidatoid = v.candidatoid
       WHERE v.empresaid = e.empresaid AND v.estado = 'publicada') AS valoraciones
    ${joins}
    WHERE o.ofertaid = $1
      AND o.estado = 'activa'
      AND e.estado = 'verificada'
  `, [id]);

  if (resultado.rows.length === 0) {
    throw httpError('Oferta no encontrada', 404);
  }

  return resultado.rows[0];
};

export const buscarOfertas = async (filtros) => {
  const condiciones = [
    "o.estado = 'activa'",
    "e.estado = 'verificada'"
  ];
  const valores = [];

  const agregar = (valor, condicion) => {
    valores.push(valor);
    condiciones.push(condicion.replace('?', `$${valores.length}`));
  };

  if (filtros.buscar?.trim()) {
    valores.push(`%${filtros.buscar.trim()}%`);
    condiciones.push(`(
      o.titulo ILIKE $${valores.length}
      OR e.nombre ILIKE $${valores.length}
      OR o.descripcion ILIKE $${valores.length}
      OR o.sector ILIKE $${valores.length}
    )`);
  }

  if (filtros.departamento?.trim()) {
    agregar(`%${filtros.departamento.trim()}%`, 'dep.nombre ILIKE ?');
  }

  if (filtros.distrito?.trim()) {
    if (!filtros.departamento?.trim()) {
      throw httpError('Seleccione un departamento para filtrar por distrito', 400);
    }

    valores.push(`%${filtros.departamento.trim()}%`, `%${filtros.distrito.trim()}%`);
    condiciones.push(
      `(dep.nombre ILIKE $${valores.length - 1} AND d.nombre ILIKE $${valores.length})`
    );
  }

  if (filtros.modalidad?.trim()) {
    agregar(filtros.modalidad.trim(), 'o.modalidad = ?');
  }

  if (filtros.ubicacion?.trim()) {
    valores.push(`%${filtros.ubicacion.trim()}%`);
    condiciones.push(`(
      o.ubicacion ILIKE $${valores.length}
      OR d.nombre ILIKE $${valores.length}
      OR m.nombre ILIKE $${valores.length}
      OR dep.nombre ILIKE $${valores.length}
    )`);
  }

  if (filtros.experiencia?.trim()) {
    agregar(filtros.experiencia.trim(), 'o.experiencia = ?');
  }

  if (filtros.sector?.trim()) {
    agregar(filtros.sector.trim(), 'o.sector = ?');
  }

  if (filtros.tipoContrato?.trim()) {
    agregar(filtros.tipoContrato.trim(), 'o.tipocontrato = ?');
  }

  if (filtros.tipoTrabajo?.trim()) {
    agregar(filtros.tipoTrabajo.trim(), 'o.tipotrabajo = ?');
  }

  if (filtros.salarioMinimo) {
    agregar(Number(filtros.salarioMinimo), 'o.salariominimo >= ?');
  }

  const pagina = Number(filtros.pagina) || 1;

  const where = condiciones.join(' AND ');
  const total = await pool.query(`
    SELECT COUNT(*)::int AS total
    ${joins}
    WHERE ${where}
  `, valores);

  const orden = filtros.orden === 'salario'
    ? 'o.salariomaximo DESC NULLS LAST, o.salariominimo DESC NULLS LAST, o.ofertaid DESC'
    : 'o.fechapublicacion DESC, o.ofertaid DESC';

  const parametros = [...valores, 5, (pagina - 1) * 5];
  const resultado = await pool.query(`
    SELECT ${campos}
    ${joins}
    WHERE ${where}
    ORDER BY ${orden}
    LIMIT $${parametros.length - 1}
    OFFSET $${parametros.length}
  `, parametros);

  return {
    ofertas: resultado.rows,
    total: total.rows[0].total,
    pagina,
    totalPaginas: Math.ceil(total.rows[0].total / 5)
  };
};

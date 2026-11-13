DROP TABLE IF EXISTS valoraciones;
DROP TABLE IF EXISTS postulaciones;
DROP TABLE IF EXISTS ofertas;
DROP TABLE IF EXISTS empresas;
DROP TABLE IF EXISTS candidatos;
DROP TABLE IF EXISTS usuarios;
DROP TABLE IF EXISTS roles;

CREATE TABLE roles (
    rolId SERIAL PRIMARY KEY,
    rol VARCHAR(20) NOT NULL UNIQUE
);

CREATE TABLE usuarios (
    usuarioId SERIAL PRIMARY KEY,
    rolId INT NOT NULL REFERENCES roles(rolId),
    correo VARCHAR(120) NOT NULL UNIQUE,
    clave VARCHAR(100) NOT NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'activo' CHECK (estado IN ('activo', 'suspendido')),
    fechaRegistro TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE candidatos (
    candidatoId SERIAL PRIMARY KEY,
    usuarioId INT NOT NULL UNIQUE REFERENCES usuarios(usuarioId) ON DELETE CASCADE,
    nombres VARCHAR(80) NOT NULL,
    apellidos VARCHAR(80) NOT NULL,
    telefono VARCHAR(20),
    areaInteres VARCHAR(50) NOT NULL,
    titulo VARCHAR(100),
    resumen TEXT,
    experiencia VARCHAR(30),
    cv VARCHAR(200),
    visitas INT NOT NULL DEFAULT 0
);

CREATE TABLE empresas (
    empresaId SERIAL PRIMARY KEY,
    usuarioId INT NOT NULL UNIQUE REFERENCES usuarios(usuarioId) ON DELETE CASCADE,
    nombre VARCHAR(120) NOT NULL,
    nit VARCHAR(20) NOT NULL UNIQUE,
    sector VARCHAR(50) NOT NULL,
    sitioWeb VARCHAR(150),
    descripcion TEXT,
    personaContacto VARCHAR(100) NOT NULL,
    correoContacto VARCHAR(120) NOT NULL,
    telefono VARCHAR(20),
    direccion VARCHAR(150),
    estado VARCHAR(20) NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'verificada', 'rechazada', 'suspendida')),
    visitas INT NOT NULL DEFAULT 0
);

CREATE TABLE ofertas (
    ofertaId SERIAL PRIMARY KEY,
    empresaId INT NOT NULL REFERENCES empresas(empresaId) ON DELETE CASCADE,
    titulo VARCHAR(120) NOT NULL,
    ubicacion VARCHAR(60) NOT NULL,
    sector VARCHAR(50) NOT NULL,
    tipoTrabajo VARCHAR(30) NOT NULL,
    tipoContrato VARCHAR(30) NOT NULL,
    experiencia VARCHAR(30) NOT NULL,
    salario VARCHAR(50),
    vacantes INT NOT NULL DEFAULT 1 CHECK (vacantes > 0),
    descripcion TEXT NOT NULL,
    responsabilidades TEXT NOT NULL,
    requisitos TEXT NOT NULL,
    beneficios TEXT,
    personaContacto VARCHAR(100) NOT NULL,
    correoContacto VARCHAR(120) NOT NULL,
    telefonoContacto VARCHAR(20),
    fechaCierre DATE NOT NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'en_revision' CHECK (estado IN ('en_revision', 'activa', 'inactiva', 'cancelada', 'rechazada')),
    fechaPublicacion TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE postulaciones (
    postulacionId SERIAL PRIMARY KEY,
    ofertaId INT NOT NULL REFERENCES ofertas(ofertaId) ON DELETE CASCADE,
    candidatoId INT NOT NULL REFERENCES candidatos(candidatoId) ON DELETE CASCADE,
    cartaPresentacion TEXT,
    cv VARCHAR(200),
    estado VARCHAR(20) NOT NULL DEFAULT 'enviada' CHECK (estado IN ('enviada', 'en_revision', 'aceptada', 'rechazada')),
    fechaPostulacion TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE (ofertaId, candidatoId)
);

CREATE TABLE valoraciones (
    valoracionId SERIAL PRIMARY KEY,
    empresaId INT NOT NULL REFERENCES empresas(empresaId) ON DELETE CASCADE,
    candidatoId INT NOT NULL REFERENCES candidatos(candidatoId) ON DELETE CASCADE,
    calificacion INT NOT NULL CHECK (calificacion BETWEEN 1 AND 5),
    comentario TEXT NOT NULL,
    anonimo BOOLEAN NOT NULL DEFAULT FALSE,
    estado VARCHAR(20) NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'publicada', 'oculta')),
    reportes INT NOT NULL DEFAULT 0,
    fecha TIMESTAMP NOT NULL DEFAULT NOW()
);

INSERT INTO roles (rol) VALUES ('admin'), ('candidato'), ('empresa');

INSERT INTO usuarios (rolId, correo, clave, estado) VALUES
(1, 'admin@puentelaboral.com', '$2b$10$OmF4qdYW6WeJz/puykAK1.uTUY5p0bn.VHeSv7pHIvKtsaMqvVhe2', 'activo'),
(2, 'maria.hernandez@correo.com', '$2b$10$OmF4qdYW6WeJz/puykAK1.uTUY5p0bn.VHeSv7pHIvKtsaMqvVhe2', 'activo'),
(2, 'ana.garcia@correo.com', '$2b$10$OmF4qdYW6WeJz/puykAK1.uTUY5p0bn.VHeSv7pHIvKtsaMqvVhe2', 'activo'),
(2, 'carlos.lopez@correo.com', '$2b$10$OmF4qdYW6WeJz/puykAK1.uTUY5p0bn.VHeSv7pHIvKtsaMqvVhe2', 'activo'),
(2, 'pzelaya@correo.com', '$2b$10$OmF4qdYW6WeJz/puykAK1.uTUY5p0bn.VHeSv7pHIvKtsaMqvVhe2', 'suspendido'),
(3, 'talento@nexodigital.com', '$2b$10$OmF4qdYW6WeJz/puykAK1.uTUY5p0bn.VHeSv7pHIvKtsaMqvVhe2', 'activo'),
(3, 'rrhh@finanzascentrales.com', '$2b$10$OmF4qdYW6WeJz/puykAK1.uTUY5p0bn.VHeSv7pHIvKtsaMqvVhe2', 'activo'),
(3, 'contacto@agroverde.com', '$2b$10$OmF4qdYW6WeJz/puykAK1.uTUY5p0bn.VHeSv7pHIvKtsaMqvVhe2', 'activo');

INSERT INTO candidatos (usuarioId, nombres, apellidos, telefono, areaInteres, titulo, resumen, experiencia, visitas) VALUES
(2, 'María José', 'Hernández López', '7123-4567', 'Tecnología', 'Desarrolladora Web Junior', 'Estudiante de Ingeniería en Sistemas con conocimientos en HTML, CSS, Bootstrap y JavaScript.', '1 - 2 años', 1245),
(3, 'Ana', 'García', '7654-3210', 'Tecnología', 'Desarrolladora Full Stack', 'Desarrolladora web con experiencia en JavaScript, Node.js y MySQL.', 'Más de 3 años', 310),
(4, 'Carlos', 'López', '7890-1234', 'Tecnología', 'Analista de Calidad', 'Analista QA con experiencia en pruebas manuales y automatizadas.', 'Más de 3 años', 180),
(5, 'Pedro', 'Zelaya', '7000-1111', 'Ventas', 'Asesor de ventas', NULL, 'Sin experiencia', 12);

INSERT INTO empresas (usuarioId, nombre, nit, sector, sitioWeb, descripcion, personaContacto, correoContacto, telefono, direccion, estado, visitas) VALUES
(6, 'Nexo Digital', '0614-120512-101-3', 'Tecnología', 'https://www.nexodigital.com', 'Empresa salvadoreña dedicada al desarrollo de software.', 'Ricardo Méndez', 'talento@nexodigital.com', '2250-1234', 'Col. Escalón, San Salvador', 'verificada', 2140),
(7, 'Finanzas Centrales', '0614-010199-001-8', 'Finanzas', 'https://www.finanzascentrales.com', 'Institución financiera con presencia en todo el país.', 'Laura Rivas', 'rrhh@finanzascentrales.com', '2260-5000', 'Antiguo Cuscatlán, La Libertad', 'verificada', 980),
(8, 'AgroVerde', '0614-030321-102-5', 'Comercio', NULL, 'Distribuidora de productos agrícolas.', 'Mario Castro', 'contacto@agroverde.com', '2440-7788', 'Santa Ana', 'pendiente', 0);

INSERT INTO ofertas (empresaId, titulo, ubicacion, sector, tipoTrabajo, tipoContrato, experiencia, salario, vacantes, descripcion, responsabilidades, requisitos, beneficios, personaContacto, correoContacto, telefonoContacto, fechaCierre, estado, fechaPublicacion) VALUES
(1, 'Desarrollador Web Full Stack', 'San Salvador', 'Tecnología', 'Tiempo completo', 'Indefinido', '1 - 2 años', '$1,200 - $1,600', 2,
 'Buscamos un desarrollador que se una a nuestro equipo para crear aplicaciones web para clientes de Centroamérica.',
 E'Desarrollar y mantener aplicaciones web.\nCrear y consumir APIs REST.\nTrabajar en equipo usando metodologías ágiles.',
 E'Estudiante o graduado de Ingeniería en Sistemas.\nConocimientos de HTML, CSS, JavaScript y Bootstrap.\nConocimientos de bases de datos SQL.\n1 a 2 años de experiencia.',
 E'Prestaciones de ley y seguro médico.\nTrabajo híbrido.\nCapacitaciones pagadas.',
 'Ricardo Méndez', 'talento@nexodigital.com', '2250-1234', '2026-12-15', 'activa', '2026-11-01'),
(1, 'Analista de Calidad', 'San Salvador', 'Tecnología', 'Tiempo completo', 'Indefinido', '1 - 2 años', '$900 - $1,100', 1,
 'Buscamos un analista QA para asegurar la calidad de nuestros productos.',
 E'Diseñar y ejecutar casos de prueba.\nReportar y dar seguimiento a errores.',
 E'Conocimientos de pruebas de software.\nManejo de herramientas como Postman.',
 E'Prestaciones de ley.\nHorario flexible.',
 'Ricardo Méndez', 'talento@nexodigital.com', '2250-1234', '2026-12-08', 'activa', '2026-11-03'),
(1, 'Diseñador Gráfico', 'Remoto', 'Tecnología', 'Medio tiempo', 'Temporal', 'Sin experiencia', '$500 - $700', 1,
 'Diseñador para piezas de redes sociales y sitios web.',
 E'Crear piezas gráficas.\nApoyar en el diseño de interfaces.',
 E'Manejo de Figma e Illustrator.',
 NULL,
 'Ricardo Méndez', 'talento@nexodigital.com', '2250-1234', '2026-12-01', 'inactiva', '2026-10-20'),
(1, 'Desarrollador Backend', 'San Salvador', 'Tecnología', 'Tiempo completo', 'Indefinido', 'Más de 3 años', '$1,500 - $2,000', 1,
 'Desarrollador backend para nuestros servicios en la nube.',
 E'Desarrollar APIs con Node.js.\nAdministrar bases de datos PostgreSQL.',
 E'Experiencia con Node.js y Express.\nConocimientos de PostgreSQL.',
 E'Prestaciones de ley y seguro médico.',
 'Ricardo Méndez', 'talento@nexodigital.com', '2250-1234', '2026-12-30', 'en_revision', NOW()),
(2, 'Desarrollador Backend Java', 'Antiguo Cuscatlán', 'Finanzas', 'Tiempo completo', 'Indefinido', '1 - 2 años', '$1,300 - $1,700', 2,
 'Desarrollador Java para los sistemas internos del banco.',
 E'Desarrollar servicios con Java y Spring.\nMantener sistemas existentes.',
 E'Conocimientos de Java.\nConocimientos de SQL.',
 E'Prestaciones de ley.\nBono anual.',
 'Laura Rivas', 'rrhh@finanzascentrales.com', '2260-5000', '2026-12-20', 'activa', '2026-11-05'),
(2, 'Analista de Créditos', 'Antiguo Cuscatlán', 'Finanzas', 'Tiempo completo', 'Indefinido', 'Sin experiencia', '$800 - $1,000', 3,
 'Analista para evaluar solicitudes de crédito de clientes.',
 E'Analizar solicitudes de crédito.\nAtender a clientes.',
 E'Estudiante de Administración, Economía o afines.',
 E'Prestaciones de ley.\nSeguro de vida.',
 'Laura Rivas', 'rrhh@finanzascentrales.com', '2260-5000', '2026-12-10', 'activa', '2026-11-08');

INSERT INTO postulaciones (ofertaId, candidatoId, cartaPresentacion, estado, fechaPostulacion) VALUES
(1, 2, 'Me interesa formar parte de su equipo de desarrollo.', 'enviada', '2026-11-10'),
(1, 1, 'Tengo conocimientos en HTML, CSS y JavaScript.', 'en_revision', '2026-11-09'),
(2, 3, NULL, 'aceptada', '2026-11-06'),
(5, 1, NULL, 'rechazada', '2026-11-07'),
(6, 1, NULL, 'enviada', '2026-11-11');

INSERT INTO valoraciones (empresaId, candidatoId, calificacion, comentario, anonimo, estado) VALUES
(1, 3, 5, 'Excelente ambiente de trabajo, se aprende mucho y respetan el horario.', FALSE, 'publicada'),
(1, 2, 4, 'Buenas prestaciones, aunque en temporada de entregas hay bastante trabajo.', TRUE, 'publicada'),
(2, 1, 4, 'Buen ambiente de trabajo y capacitaciones constantes.', FALSE, 'pendiente');

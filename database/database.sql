DROP TABLE IF EXISTS valoraciones;
DROP TABLE IF EXISTS postulaciones;
DROP TABLE IF EXISTS ofertas;
DROP TABLE IF EXISTS empresas;
DROP TABLE IF EXISTS candidatos;
DROP TABLE IF EXISTS usuarios;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS distritos;
DROP TABLE IF EXISTS municipios;
DROP TABLE IF EXISTS departamentos;

CREATE TABLE roles (
    rolId SERIAL PRIMARY KEY,
    rol VARCHAR(20) NOT NULL UNIQUE
);

CREATE TABLE departamentos (
    departamentoId SERIAL PRIMARY KEY,
    nombre VARCHAR(60) NOT NULL UNIQUE
);

CREATE TABLE municipios (
    municipioId SERIAL PRIMARY KEY,
    departamentoId INT NOT NULL REFERENCES departamentos(departamentoId),
    nombre VARCHAR(80) NOT NULL,
    UNIQUE (departamentoId, nombre)
);

CREATE TABLE distritos (
    distritoId SERIAL PRIMARY KEY,
    municipioId INT NOT NULL REFERENCES municipios(municipioId),
    nombre VARCHAR(80) NOT NULL,
    UNIQUE (municipioId, nombre)
);

INSERT INTO departamentos (nombre) VALUES
('Ahuachapán'), ('Cabañas'), ('Chalatenango'), ('Cuscatlán'),
('La Libertad'), ('La Paz'), ('La Unión'), ('Morazán'),
('San Miguel'), ('San Salvador'), ('San Vicente'), ('Santa Ana'),
('Sonsonate'), ('Usulután');


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


INSERT INTO municipios (departamentoId, nombre)
SELECT d.departamentoId, 'Ahuachapán Norte' FROM departamentos d WHERE d.nombre = 'Ahuachapán'
ON CONFLICT (departamentoId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Atiquizaya' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Ahuachapán' AND m.nombre = 'Ahuachapán Norte'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'El Refugio' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Ahuachapán' AND m.nombre = 'Ahuachapán Norte'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'San Lorenzo' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Ahuachapán' AND m.nombre = 'Ahuachapán Norte'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Turín' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Ahuachapán' AND m.nombre = 'Ahuachapán Norte'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO municipios (departamentoId, nombre)
SELECT d.departamentoId, 'Ahuachapán Centro' FROM departamentos d WHERE d.nombre = 'Ahuachapán'
ON CONFLICT (departamentoId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Ahuachapán' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Ahuachapán' AND m.nombre = 'Ahuachapán Centro'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Apaneca' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Ahuachapán' AND m.nombre = 'Ahuachapán Centro'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Concepción de Ataco' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Ahuachapán' AND m.nombre = 'Ahuachapán Centro'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Tacuba' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Ahuachapán' AND m.nombre = 'Ahuachapán Centro'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO municipios (departamentoId, nombre)
SELECT d.departamentoId, 'Ahuachapán Sur' FROM departamentos d WHERE d.nombre = 'Ahuachapán'
ON CONFLICT (departamentoId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Guaymango' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Ahuachapán' AND m.nombre = 'Ahuachapán Sur'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Jujutla' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Ahuachapán' AND m.nombre = 'Ahuachapán Sur'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'San Francisco Menéndez' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Ahuachapán' AND m.nombre = 'Ahuachapán Sur'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'San Pedro Puxtla' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Ahuachapán' AND m.nombre = 'Ahuachapán Sur'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO municipios (departamentoId, nombre)
SELECT d.departamentoId, 'San Salvador Norte' FROM departamentos d WHERE d.nombre = 'San Salvador'
ON CONFLICT (departamentoId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Aguilares' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'San Salvador' AND m.nombre = 'San Salvador Norte'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'El Paisnal' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'San Salvador' AND m.nombre = 'San Salvador Norte'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Guazapa' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'San Salvador' AND m.nombre = 'San Salvador Norte'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO municipios (departamentoId, nombre)
SELECT d.departamentoId, 'San Salvador Oeste' FROM departamentos d WHERE d.nombre = 'San Salvador'
ON CONFLICT (departamentoId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Apopa' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'San Salvador' AND m.nombre = 'San Salvador Oeste'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Nejapa' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'San Salvador' AND m.nombre = 'San Salvador Oeste'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO municipios (departamentoId, nombre)
SELECT d.departamentoId, 'San Salvador Este' FROM departamentos d WHERE d.nombre = 'San Salvador'
ON CONFLICT (departamentoId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Ilopango' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'San Salvador' AND m.nombre = 'San Salvador Este'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'San Martín' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'San Salvador' AND m.nombre = 'San Salvador Este'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Soyapango' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'San Salvador' AND m.nombre = 'San Salvador Este'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Tonacatepeque' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'San Salvador' AND m.nombre = 'San Salvador Este'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO municipios (departamentoId, nombre)
SELECT d.departamentoId, 'San Salvador Centro' FROM departamentos d WHERE d.nombre = 'San Salvador'
ON CONFLICT (departamentoId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Ayutuxtepeque' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'San Salvador' AND m.nombre = 'San Salvador Centro'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Mejicanos' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'San Salvador' AND m.nombre = 'San Salvador Centro'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'San Salvador' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'San Salvador' AND m.nombre = 'San Salvador Centro'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Cuscatancingo' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'San Salvador' AND m.nombre = 'San Salvador Centro'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Ciudad Delgado' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'San Salvador' AND m.nombre = 'San Salvador Centro'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO municipios (departamentoId, nombre)
SELECT d.departamentoId, 'San Salvador Sur' FROM departamentos d WHERE d.nombre = 'San Salvador'
ON CONFLICT (departamentoId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Panchimalco' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'San Salvador' AND m.nombre = 'San Salvador Sur'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Rosario de Mora' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'San Salvador' AND m.nombre = 'San Salvador Sur'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'San Marcos' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'San Salvador' AND m.nombre = 'San Salvador Sur'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Santo Tomás' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'San Salvador' AND m.nombre = 'San Salvador Sur'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Santiago Texacuangos' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'San Salvador' AND m.nombre = 'San Salvador Sur'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO municipios (departamentoId, nombre)
SELECT d.departamentoId, 'La Libertad Norte' FROM departamentos d WHERE d.nombre = 'La Libertad'
ON CONFLICT (departamentoId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Quezaltepeque' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'La Libertad' AND m.nombre = 'La Libertad Norte'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'San Matías' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'La Libertad' AND m.nombre = 'La Libertad Norte'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'San Pablo Tacachico' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'La Libertad' AND m.nombre = 'La Libertad Norte'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO municipios (departamentoId, nombre)
SELECT d.departamentoId, 'La Libertad Centro' FROM departamentos d WHERE d.nombre = 'La Libertad'
ON CONFLICT (departamentoId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'San Juan Opico' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'La Libertad' AND m.nombre = 'La Libertad Centro'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Ciudad Arce' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'La Libertad' AND m.nombre = 'La Libertad Centro'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO municipios (departamentoId, nombre)
SELECT d.departamentoId, 'La Libertad Oeste' FROM departamentos d WHERE d.nombre = 'La Libertad'
ON CONFLICT (departamentoId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Colón' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'La Libertad' AND m.nombre = 'La Libertad Oeste'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Jayaque' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'La Libertad' AND m.nombre = 'La Libertad Oeste'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Sacacoyo' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'La Libertad' AND m.nombre = 'La Libertad Oeste'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Tepecoyo' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'La Libertad' AND m.nombre = 'La Libertad Oeste'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Talnique' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'La Libertad' AND m.nombre = 'La Libertad Oeste'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO municipios (departamentoId, nombre)
SELECT d.departamentoId, 'La Libertad Este' FROM departamentos d WHERE d.nombre = 'La Libertad'
ON CONFLICT (departamentoId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Antiguo Cuscatlán' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'La Libertad' AND m.nombre = 'La Libertad Este'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Huizúcar' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'La Libertad' AND m.nombre = 'La Libertad Este'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Nuevo Cuscatlán' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'La Libertad' AND m.nombre = 'La Libertad Este'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'San José Villanueva' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'La Libertad' AND m.nombre = 'La Libertad Este'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Zaragoza' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'La Libertad' AND m.nombre = 'La Libertad Este'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO municipios (departamentoId, nombre)
SELECT d.departamentoId, 'La Libertad Costa' FROM departamentos d WHERE d.nombre = 'La Libertad'
ON CONFLICT (departamentoId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Chiltiupán' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'La Libertad' AND m.nombre = 'La Libertad Costa'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Jicalapa' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'La Libertad' AND m.nombre = 'La Libertad Costa'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'La Libertad' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'La Libertad' AND m.nombre = 'La Libertad Costa'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Tamanique' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'La Libertad' AND m.nombre = 'La Libertad Costa'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Teotepeque' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'La Libertad' AND m.nombre = 'La Libertad Costa'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO municipios (departamentoId, nombre)
SELECT d.departamentoId, 'La Libertad Sur' FROM departamentos d WHERE d.nombre = 'La Libertad'
ON CONFLICT (departamentoId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Comasagua' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'La Libertad' AND m.nombre = 'La Libertad Sur'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Santa Tecla' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'La Libertad' AND m.nombre = 'La Libertad Sur'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO municipios (departamentoId, nombre)
SELECT d.departamentoId, 'Chalatenango Norte' FROM departamentos d WHERE d.nombre = 'Chalatenango'
ON CONFLICT (departamentoId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'La Palma' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Chalatenango' AND m.nombre = 'Chalatenango Norte'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Citalá' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Chalatenango' AND m.nombre = 'Chalatenango Norte'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'San Ignacio' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Chalatenango' AND m.nombre = 'Chalatenango Norte'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO municipios (departamentoId, nombre)
SELECT d.departamentoId, 'Chalatenango Centro' FROM departamentos d WHERE d.nombre = 'Chalatenango'
ON CONFLICT (departamentoId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Nueva Concepción' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Chalatenango' AND m.nombre = 'Chalatenango Centro'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Tejutla' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Chalatenango' AND m.nombre = 'Chalatenango Centro'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'La Reina' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Chalatenango' AND m.nombre = 'Chalatenango Centro'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Agua Caliente' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Chalatenango' AND m.nombre = 'Chalatenango Centro'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Dulce Nombre de María' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Chalatenango' AND m.nombre = 'Chalatenango Centro'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'El Paraíso' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Chalatenango' AND m.nombre = 'Chalatenango Centro'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'San Fernando' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Chalatenango' AND m.nombre = 'Chalatenango Centro'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'San Francisco Morazán' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Chalatenango' AND m.nombre = 'Chalatenango Centro'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'San Rafael' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Chalatenango' AND m.nombre = 'Chalatenango Centro'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Santa Rita' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Chalatenango' AND m.nombre = 'Chalatenango Centro'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO municipios (departamentoId, nombre)
SELECT d.departamentoId, 'Chalatenango Sur' FROM departamentos d WHERE d.nombre = 'Chalatenango'
ON CONFLICT (departamentoId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Chalatenango' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Chalatenango' AND m.nombre = 'Chalatenango Sur'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Arcatao' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Chalatenango' AND m.nombre = 'Chalatenango Sur'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Azacualpa' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Chalatenango' AND m.nombre = 'Chalatenango Sur'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Comalapa' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Chalatenango' AND m.nombre = 'Chalatenango Sur'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Concepción Quezaltepeque' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Chalatenango' AND m.nombre = 'Chalatenango Sur'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'El Carrizal' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Chalatenango' AND m.nombre = 'Chalatenango Sur'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'La Laguna' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Chalatenango' AND m.nombre = 'Chalatenango Sur'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Las Vueltas' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Chalatenango' AND m.nombre = 'Chalatenango Sur'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Nombre de Jesús' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Chalatenango' AND m.nombre = 'Chalatenango Sur'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Nueva Trinidad' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Chalatenango' AND m.nombre = 'Chalatenango Sur'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Ojos de Agua' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Chalatenango' AND m.nombre = 'Chalatenango Sur'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Potonico' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Chalatenango' AND m.nombre = 'Chalatenango Sur'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'San Antonio de la Cruz' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Chalatenango' AND m.nombre = 'Chalatenango Sur'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'San Antonio Los Ranchos' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Chalatenango' AND m.nombre = 'Chalatenango Sur'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'San Francisco Lempa' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Chalatenango' AND m.nombre = 'Chalatenango Sur'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'San Isidro Labrador' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Chalatenango' AND m.nombre = 'Chalatenango Sur'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'San José Cancasque' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Chalatenango' AND m.nombre = 'Chalatenango Sur'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'San Miguel de Mercedes' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Chalatenango' AND m.nombre = 'Chalatenango Sur'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'San José Las Flores' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Chalatenango' AND m.nombre = 'Chalatenango Sur'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'San Luis del Carmen' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Chalatenango' AND m.nombre = 'Chalatenango Sur'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO municipios (departamentoId, nombre)
SELECT d.departamentoId, 'Cuscatlán Norte' FROM departamentos d WHERE d.nombre = 'Cuscatlán'
ON CONFLICT (departamentoId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Suchitoto' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Cuscatlán' AND m.nombre = 'Cuscatlán Norte'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'San José Guayabal' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Cuscatlán' AND m.nombre = 'Cuscatlán Norte'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Oratorio de Concepción' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Cuscatlán' AND m.nombre = 'Cuscatlán Norte'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'San Bartolomé Perulapía' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Cuscatlán' AND m.nombre = 'Cuscatlán Norte'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'San Pedro Perulapán' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Cuscatlán' AND m.nombre = 'Cuscatlán Norte'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO municipios (departamentoId, nombre)
SELECT d.departamentoId, 'Cuscatlán Sur' FROM departamentos d WHERE d.nombre = 'Cuscatlán'
ON CONFLICT (departamentoId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Cojutepeque' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Cuscatlán' AND m.nombre = 'Cuscatlán Sur'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'San Rafael Cedros' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Cuscatlán' AND m.nombre = 'Cuscatlán Sur'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Candelaria' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Cuscatlán' AND m.nombre = 'Cuscatlán Sur'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Monte San Juan' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Cuscatlán' AND m.nombre = 'Cuscatlán Sur'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'El Carmen' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Cuscatlán' AND m.nombre = 'Cuscatlán Sur'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'San Cristóbal' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Cuscatlán' AND m.nombre = 'Cuscatlán Sur'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Santa Cruz Michapa' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Cuscatlán' AND m.nombre = 'Cuscatlán Sur'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'San Ramón' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Cuscatlán' AND m.nombre = 'Cuscatlán Sur'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'El Rosario' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Cuscatlán' AND m.nombre = 'Cuscatlán Sur'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Santa Cruz Analquito' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Cuscatlán' AND m.nombre = 'Cuscatlán Sur'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Tenancingo' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Cuscatlán' AND m.nombre = 'Cuscatlán Sur'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO municipios (departamentoId, nombre)
SELECT d.departamentoId, 'Cabañas Este' FROM departamentos d WHERE d.nombre = 'Cabañas'
ON CONFLICT (departamentoId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Sensuntepeque' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Cabañas' AND m.nombre = 'Cabañas Este'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Victoria' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Cabañas' AND m.nombre = 'Cabañas Este'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Dolores' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Cabañas' AND m.nombre = 'Cabañas Este'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Guacotecti' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Cabañas' AND m.nombre = 'Cabañas Este'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'San Isidro' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Cabañas' AND m.nombre = 'Cabañas Este'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO municipios (departamentoId, nombre)
SELECT d.departamentoId, 'Cabañas Oeste' FROM departamentos d WHERE d.nombre = 'Cabañas'
ON CONFLICT (departamentoId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Ilobasco' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Cabañas' AND m.nombre = 'Cabañas Oeste'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Tejutepeque' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Cabañas' AND m.nombre = 'Cabañas Oeste'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Jutiapa' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Cabañas' AND m.nombre = 'Cabañas Oeste'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Cinquera' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Cabañas' AND m.nombre = 'Cabañas Oeste'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO municipios (departamentoId, nombre)
SELECT d.departamentoId, 'La Paz Oeste' FROM departamentos d WHERE d.nombre = 'La Paz'
ON CONFLICT (departamentoId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Cuyultitán' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'La Paz' AND m.nombre = 'La Paz Oeste'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Olocuilta' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'La Paz' AND m.nombre = 'La Paz Oeste'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'San Juan Talpa' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'La Paz' AND m.nombre = 'La Paz Oeste'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'San Luis Talpa' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'La Paz' AND m.nombre = 'La Paz Oeste'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'San Pedro Masahuat' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'La Paz' AND m.nombre = 'La Paz Oeste'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Tapalhuaca' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'La Paz' AND m.nombre = 'La Paz Oeste'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'San Francisco Chinameca' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'La Paz' AND m.nombre = 'La Paz Oeste'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO municipios (departamentoId, nombre)
SELECT d.departamentoId, 'La Paz Centro' FROM departamentos d WHERE d.nombre = 'La Paz'
ON CONFLICT (departamentoId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'El Rosario' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'La Paz' AND m.nombre = 'La Paz Centro'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Jerusalén' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'La Paz' AND m.nombre = 'La Paz Centro'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Mercedes La Ceiba' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'La Paz' AND m.nombre = 'La Paz Centro'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Paraíso de Osorio' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'La Paz' AND m.nombre = 'La Paz Centro'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'San Antonio Masahuat' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'La Paz' AND m.nombre = 'La Paz Centro'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'San Emigdio' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'La Paz' AND m.nombre = 'La Paz Centro'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'San Juan Tepezontes' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'La Paz' AND m.nombre = 'La Paz Centro'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'San Luis La Herradura' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'La Paz' AND m.nombre = 'La Paz Centro'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'San Miguel Tepezontes' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'La Paz' AND m.nombre = 'La Paz Centro'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'San Pedro Nonualco' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'La Paz' AND m.nombre = 'La Paz Centro'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Santa María Ostuma' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'La Paz' AND m.nombre = 'La Paz Centro'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Santiago Nonualco' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'La Paz' AND m.nombre = 'La Paz Centro'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO municipios (departamentoId, nombre)
SELECT d.departamentoId, 'La Paz Este' FROM departamentos d WHERE d.nombre = 'La Paz'
ON CONFLICT (departamentoId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'San Juan Nonualco' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'La Paz' AND m.nombre = 'La Paz Este'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'San Rafael Obrajuelo' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'La Paz' AND m.nombre = 'La Paz Este'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Zacatecoluca' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'La Paz' AND m.nombre = 'La Paz Este'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO municipios (departamentoId, nombre)
SELECT d.departamentoId, 'La Unión Norte' FROM departamentos d WHERE d.nombre = 'La Unión'
ON CONFLICT (departamentoId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Anamorós' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'La Unión' AND m.nombre = 'La Unión Norte'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Bolívar' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'La Unión' AND m.nombre = 'La Unión Norte'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Concepción de Oriente' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'La Unión' AND m.nombre = 'La Unión Norte'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'El Sauce' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'La Unión' AND m.nombre = 'La Unión Norte'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Lislique' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'La Unión' AND m.nombre = 'La Unión Norte'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Nueva Esparta' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'La Unión' AND m.nombre = 'La Unión Norte'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Pasaquina' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'La Unión' AND m.nombre = 'La Unión Norte'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Polorós' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'La Unión' AND m.nombre = 'La Unión Norte'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'San José La Fuente' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'La Unión' AND m.nombre = 'La Unión Norte'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Santa Rosa de Lima' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'La Unión' AND m.nombre = 'La Unión Norte'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO municipios (departamentoId, nombre)
SELECT d.departamentoId, 'La Unión Sur' FROM departamentos d WHERE d.nombre = 'La Unión'
ON CONFLICT (departamentoId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Conchagua' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'La Unión' AND m.nombre = 'La Unión Sur'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'El Carmen' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'La Unión' AND m.nombre = 'La Unión Sur'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Intipucá' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'La Unión' AND m.nombre = 'La Unión Sur'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'La Unión' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'La Unión' AND m.nombre = 'La Unión Sur'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Meanguera del Golfo' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'La Unión' AND m.nombre = 'La Unión Sur'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'San Alejo' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'La Unión' AND m.nombre = 'La Unión Sur'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Yayantique' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'La Unión' AND m.nombre = 'La Unión Sur'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Yucuaiquín' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'La Unión' AND m.nombre = 'La Unión Sur'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO municipios (departamentoId, nombre)
SELECT d.departamentoId, 'Usulután Norte' FROM departamentos d WHERE d.nombre = 'Usulután'
ON CONFLICT (departamentoId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Santiago de María' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Usulután' AND m.nombre = 'Usulután Norte'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Alegría' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Usulután' AND m.nombre = 'Usulután Norte'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Berlín' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Usulután' AND m.nombre = 'Usulután Norte'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Mercedes Umaña' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Usulután' AND m.nombre = 'Usulután Norte'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Jucuapa' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Usulután' AND m.nombre = 'Usulután Norte'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'El Triunfo' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Usulután' AND m.nombre = 'Usulután Norte'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Estanzuelas' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Usulután' AND m.nombre = 'Usulután Norte'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'San Buenaventura' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Usulután' AND m.nombre = 'Usulután Norte'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Nueva Granada' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Usulután' AND m.nombre = 'Usulután Norte'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO municipios (departamentoId, nombre)
SELECT d.departamentoId, 'Usulután Este' FROM departamentos d WHERE d.nombre = 'Usulután'
ON CONFLICT (departamentoId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Usulután' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Usulután' AND m.nombre = 'Usulután Este'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Jucuarán' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Usulután' AND m.nombre = 'Usulután Este'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'San Dionisio' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Usulután' AND m.nombre = 'Usulután Este'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Concepción Batres' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Usulután' AND m.nombre = 'Usulután Este'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Santa María' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Usulután' AND m.nombre = 'Usulután Este'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Ozatlán' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Usulután' AND m.nombre = 'Usulután Este'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Tecapán' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Usulután' AND m.nombre = 'Usulután Este'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Santa Elena' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Usulután' AND m.nombre = 'Usulután Este'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'California' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Usulután' AND m.nombre = 'Usulután Este'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Ereguayquín' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Usulután' AND m.nombre = 'Usulután Este'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO municipios (departamentoId, nombre)
SELECT d.departamentoId, 'Usulután Oeste' FROM departamentos d WHERE d.nombre = 'Usulután'
ON CONFLICT (departamentoId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Jiquilisco' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Usulután' AND m.nombre = 'Usulután Oeste'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Puerto El Triunfo' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Usulután' AND m.nombre = 'Usulután Oeste'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'San Agustín' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Usulután' AND m.nombre = 'Usulután Oeste'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'San Francisco Javier' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Usulután' AND m.nombre = 'Usulután Oeste'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO municipios (departamentoId, nombre)
SELECT d.departamentoId, 'Sonsonate Norte' FROM departamentos d WHERE d.nombre = 'Sonsonate'
ON CONFLICT (departamentoId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Juayúa' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Sonsonate' AND m.nombre = 'Sonsonate Norte'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Nahuizalco' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Sonsonate' AND m.nombre = 'Sonsonate Norte'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Salcoatitán' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Sonsonate' AND m.nombre = 'Sonsonate Norte'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Santa Catarina Masahuat' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Sonsonate' AND m.nombre = 'Sonsonate Norte'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO municipios (departamentoId, nombre)
SELECT d.departamentoId, 'Sonsonate Centro' FROM departamentos d WHERE d.nombre = 'Sonsonate'
ON CONFLICT (departamentoId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Sonsonate' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Sonsonate' AND m.nombre = 'Sonsonate Centro'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Sonzacate' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Sonsonate' AND m.nombre = 'Sonsonate Centro'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Nahulingo' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Sonsonate' AND m.nombre = 'Sonsonate Centro'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'San Antonio del Monte' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Sonsonate' AND m.nombre = 'Sonsonate Centro'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Santo Domingo de Guzmán' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Sonsonate' AND m.nombre = 'Sonsonate Centro'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO municipios (departamentoId, nombre)
SELECT d.departamentoId, 'Sonsonate Este' FROM departamentos d WHERE d.nombre = 'Sonsonate'
ON CONFLICT (departamentoId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Izalco' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Sonsonate' AND m.nombre = 'Sonsonate Este'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Armenia' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Sonsonate' AND m.nombre = 'Sonsonate Este'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Caluco' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Sonsonate' AND m.nombre = 'Sonsonate Este'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'San Julián' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Sonsonate' AND m.nombre = 'Sonsonate Este'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Cuisnahuat' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Sonsonate' AND m.nombre = 'Sonsonate Este'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Santa Isabel Ishuatán' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Sonsonate' AND m.nombre = 'Sonsonate Este'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO municipios (departamentoId, nombre)
SELECT d.departamentoId, 'Sonsonate Oeste' FROM departamentos d WHERE d.nombre = 'Sonsonate'
ON CONFLICT (departamentoId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Acajutla' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Sonsonate' AND m.nombre = 'Sonsonate Oeste'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO municipios (departamentoId, nombre)
SELECT d.departamentoId, 'Santa Ana Norte' FROM departamentos d WHERE d.nombre = 'Santa Ana'
ON CONFLICT (departamentoId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Masahuat' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Santa Ana' AND m.nombre = 'Santa Ana Norte'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Metapán' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Santa Ana' AND m.nombre = 'Santa Ana Norte'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Santa Rosa Guachipilín' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Santa Ana' AND m.nombre = 'Santa Ana Norte'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Texistepeque' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Santa Ana' AND m.nombre = 'Santa Ana Norte'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO municipios (departamentoId, nombre)
SELECT d.departamentoId, 'Santa Ana Centro' FROM departamentos d WHERE d.nombre = 'Santa Ana'
ON CONFLICT (departamentoId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Santa Ana' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Santa Ana' AND m.nombre = 'Santa Ana Centro'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO municipios (departamentoId, nombre)
SELECT d.departamentoId, 'Santa Ana Este' FROM departamentos d WHERE d.nombre = 'Santa Ana'
ON CONFLICT (departamentoId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Coatepeque' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Santa Ana' AND m.nombre = 'Santa Ana Este'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'El Congo' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Santa Ana' AND m.nombre = 'Santa Ana Este'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO municipios (departamentoId, nombre)
SELECT d.departamentoId, 'Santa Ana Oeste' FROM departamentos d WHERE d.nombre = 'Santa Ana'
ON CONFLICT (departamentoId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Candelaria de la Frontera' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Santa Ana' AND m.nombre = 'Santa Ana Oeste'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Chalchuapa' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Santa Ana' AND m.nombre = 'Santa Ana Oeste'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'El Porvenir' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Santa Ana' AND m.nombre = 'Santa Ana Oeste'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'San Antonio Pajonal' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Santa Ana' AND m.nombre = 'Santa Ana Oeste'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'San Sebastián Salitrillo' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Santa Ana' AND m.nombre = 'Santa Ana Oeste'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Santiago de la Frontera' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Santa Ana' AND m.nombre = 'Santa Ana Oeste'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO municipios (departamentoId, nombre)
SELECT d.departamentoId, 'San Vicente Norte' FROM departamentos d WHERE d.nombre = 'San Vicente'
ON CONFLICT (departamentoId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Apastepeque' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'San Vicente' AND m.nombre = 'San Vicente Norte'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Santa Clara' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'San Vicente' AND m.nombre = 'San Vicente Norte'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'San Ildefonso' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'San Vicente' AND m.nombre = 'San Vicente Norte'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'San Esteban Catarina' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'San Vicente' AND m.nombre = 'San Vicente Norte'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'San Sebastián' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'San Vicente' AND m.nombre = 'San Vicente Norte'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'San Lorenzo' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'San Vicente' AND m.nombre = 'San Vicente Norte'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Santo Domingo' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'San Vicente' AND m.nombre = 'San Vicente Norte'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO municipios (departamentoId, nombre)
SELECT d.departamentoId, 'San Vicente Sur' FROM departamentos d WHERE d.nombre = 'San Vicente'
ON CONFLICT (departamentoId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'San Vicente' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'San Vicente' AND m.nombre = 'San Vicente Sur'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Guadalupe' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'San Vicente' AND m.nombre = 'San Vicente Sur'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Verapaz' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'San Vicente' AND m.nombre = 'San Vicente Sur'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Tepetitán' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'San Vicente' AND m.nombre = 'San Vicente Sur'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Tecoluca' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'San Vicente' AND m.nombre = 'San Vicente Sur'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'San Cayetano Istepeque' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'San Vicente' AND m.nombre = 'San Vicente Sur'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO municipios (departamentoId, nombre)
SELECT d.departamentoId, 'San Miguel Norte' FROM departamentos d WHERE d.nombre = 'San Miguel'
ON CONFLICT (departamentoId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Ciudad Barrios' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'San Miguel' AND m.nombre = 'San Miguel Norte'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Sesori' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'San Miguel' AND m.nombre = 'San Miguel Norte'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Nuevo Edén de San Juan' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'San Miguel' AND m.nombre = 'San Miguel Norte'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'San Gerardo' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'San Miguel' AND m.nombre = 'San Miguel Norte'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'San Luis de la Reina' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'San Miguel' AND m.nombre = 'San Miguel Norte'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Carolina' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'San Miguel' AND m.nombre = 'San Miguel Norte'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'San Antonio del Mosco' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'San Miguel' AND m.nombre = 'San Miguel Norte'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Chapeltique' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'San Miguel' AND m.nombre = 'San Miguel Norte'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO municipios (departamentoId, nombre)
SELECT d.departamentoId, 'San Miguel Centro' FROM departamentos d WHERE d.nombre = 'San Miguel'
ON CONFLICT (departamentoId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'San Miguel' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'San Miguel' AND m.nombre = 'San Miguel Centro'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Comacarán' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'San Miguel' AND m.nombre = 'San Miguel Centro'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Uluazapa' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'San Miguel' AND m.nombre = 'San Miguel Centro'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Moncagua' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'San Miguel' AND m.nombre = 'San Miguel Centro'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Quelepa' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'San Miguel' AND m.nombre = 'San Miguel Centro'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Chirilagua' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'San Miguel' AND m.nombre = 'San Miguel Centro'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO municipios (departamentoId, nombre)
SELECT d.departamentoId, 'San Miguel Oeste' FROM departamentos d WHERE d.nombre = 'San Miguel'
ON CONFLICT (departamentoId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Chinameca' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'San Miguel' AND m.nombre = 'San Miguel Oeste'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Nueva Guadalupe' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'San Miguel' AND m.nombre = 'San Miguel Oeste'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Lolotique' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'San Miguel' AND m.nombre = 'San Miguel Oeste'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'San Jorge' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'San Miguel' AND m.nombre = 'San Miguel Oeste'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'San Rafael Oriente' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'San Miguel' AND m.nombre = 'San Miguel Oeste'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'El Tránsito' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'San Miguel' AND m.nombre = 'San Miguel Oeste'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO municipios (departamentoId, nombre)
SELECT d.departamentoId, 'Morazán Norte' FROM departamentos d WHERE d.nombre = 'Morazán'
ON CONFLICT (departamentoId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Arambala' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Morazán' AND m.nombre = 'Morazán Norte'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Cacaopera' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Morazán' AND m.nombre = 'Morazán Norte'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Corinto' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Morazán' AND m.nombre = 'Morazán Norte'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'El Rosario' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Morazán' AND m.nombre = 'Morazán Norte'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Joateca' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Morazán' AND m.nombre = 'Morazán Norte'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Jocoaitique' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Morazán' AND m.nombre = 'Morazán Norte'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Meanguera' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Morazán' AND m.nombre = 'Morazán Norte'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Perquín' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Morazán' AND m.nombre = 'Morazán Norte'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'San Fernando' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Morazán' AND m.nombre = 'Morazán Norte'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'San Isidro' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Morazán' AND m.nombre = 'Morazán Norte'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Torola' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Morazán' AND m.nombre = 'Morazán Norte'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO municipios (departamentoId, nombre)
SELECT d.departamentoId, 'Morazán Sur' FROM departamentos d WHERE d.nombre = 'Morazán'
ON CONFLICT (departamentoId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Chilanga' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Morazán' AND m.nombre = 'Morazán Sur'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Delicias de Concepción' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Morazán' AND m.nombre = 'Morazán Sur'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'El Divisadero' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Morazán' AND m.nombre = 'Morazán Sur'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Gualococti' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Morazán' AND m.nombre = 'Morazán Sur'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Guatajiagua' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Morazán' AND m.nombre = 'Morazán Sur'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Jocoro' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Morazán' AND m.nombre = 'Morazán Sur'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Lolotiquillo' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Morazán' AND m.nombre = 'Morazán Sur'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Osicala' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Morazán' AND m.nombre = 'Morazán Sur'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'San Carlos' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Morazán' AND m.nombre = 'Morazán Sur'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'San Francisco Gotera' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Morazán' AND m.nombre = 'Morazán Sur'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'San Simón' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Morazán' AND m.nombre = 'Morazán Sur'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Sensembra' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Morazán' AND m.nombre = 'Morazán Sur'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Sociedad' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Morazán' AND m.nombre = 'Morazán Sur'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Yamabal' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Morazán' AND m.nombre = 'Morazán Sur'
ON CONFLICT (municipioId, nombre) DO NOTHING;

INSERT INTO distritos (municipioId, nombre)
SELECT m.municipioId, 'Yoloaiquín' FROM municipios m JOIN departamentos d ON m.departamentoId = d.departamentoId
WHERE d.nombre = 'Morazán' AND m.nombre = 'Morazán Sur'
ON CONFLICT (municipioId, nombre) DO NOTHING;



CREATE TABLE ofertas (
    ofertaId SERIAL PRIMARY KEY,
    empresaId INT NOT NULL REFERENCES empresas(empresaId) ON DELETE CASCADE,
    titulo VARCHAR(120) NOT NULL,
    ubicacion VARCHAR(60) NOT NULL,
    departamento VARCHAR(60),
    municipio VARCHAR(80),
    distritoId INT REFERENCES distritos(distritoId),
    modalidad VARCHAR(20) NOT NULL DEFAULT 'Presencial'
        CHECK (modalidad IN ('Presencial', 'Híbrido', 'Remoto')),
    sector VARCHAR(50) NOT NULL,
    tipoTrabajo VARCHAR(30) NOT NULL,
    tipoContrato VARCHAR(30) NOT NULL,
    experiencia VARCHAR(30) NOT NULL,
    salarioMinimo INT CHECK (salarioMinimo >= 0),
    salarioMaximo INT CHECK (salarioMaximo >= salarioMinimo),
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

INSERT INTO usuarios (rolId, correo, clave, estado, fechaRegistro) VALUES
(1, 'admin@puentelaboral.com', '$2b$10$OmF4qdYW6WeJz/puykAK1.uTUY5p0bn.VHeSv7pHIvKtsaMqvVhe2', 'activo', NOW() - INTERVAL '60 days'),
(2, 'maria.hernandez@correo.com', '$2b$10$OmF4qdYW6WeJz/puykAK1.uTUY5p0bn.VHeSv7pHIvKtsaMqvVhe2', 'activo', NOW() - INTERVAL '25 days'),
(2, 'ana.garcia@correo.com', '$2b$10$OmF4qdYW6WeJz/puykAK1.uTUY5p0bn.VHeSv7pHIvKtsaMqvVhe2', 'activo', NOW() - INTERVAL '15 days'),
(2, 'carlos.lopez@correo.com', '$2b$10$OmF4qdYW6WeJz/puykAK1.uTUY5p0bn.VHeSv7pHIvKtsaMqvVhe2', 'activo', NOW() - INTERVAL '12 days'),
(2, 'pzelaya@correo.com', '$2b$10$OmF4qdYW6WeJz/puykAK1.uTUY5p0bn.VHeSv7pHIvKtsaMqvVhe2', 'suspendido', NOW() - INTERVAL '9 days'),
(3, 'talento@nexodigital.com', '$2b$10$OmF4qdYW6WeJz/puykAK1.uTUY5p0bn.VHeSv7pHIvKtsaMqvVhe2', 'activo', NOW() - INTERVAL '40 days'),
(3, 'rrhh@finanzascentrales.com', '$2b$10$OmF4qdYW6WeJz/puykAK1.uTUY5p0bn.VHeSv7pHIvKtsaMqvVhe2', 'activo', NOW() - INTERVAL '35 days'),
(3, 'contacto@agroverde.com', '$2b$10$OmF4qdYW6WeJz/puykAK1.uTUY5p0bn.VHeSv7pHIvKtsaMqvVhe2', 'activo', NOW() - INTERVAL '1 days');

INSERT INTO candidatos (usuarioId, nombres, apellidos, telefono, areaInteres, titulo, resumen, experiencia, visitas) VALUES
(2, 'María José', 'Hernández López', '7123-4567', 'Tecnología', 'Desarrolladora Web Junior', 'Estudiante de Ingeniería en Sistemas con conocimientos en HTML, CSS, Bootstrap y JavaScript.', '1 - 2 años', 1245),
(3, 'Ana', 'García', '7654-3210', 'Tecnología', 'Desarrolladora Full Stack', 'Desarrolladora web con experiencia en JavaScript, Node.js y MySQL.', 'Más de 3 años', 310),
(4, 'Carlos', 'López', '7890-1234', 'Tecnología', 'Analista de Calidad', 'Analista QA con experiencia en pruebas manuales y automatizadas.', 'Más de 3 años', 180),
(5, 'Pedro', 'Zelaya', '7000-1111', 'Ventas', 'Asesor de ventas', NULL, 'Sin experiencia', 12);

INSERT INTO empresas (usuarioId, nombre, nit, sector, sitioWeb, descripcion, personaContacto, correoContacto, telefono, direccion, estado, visitas) VALUES
(6, 'Nexo Digital', '0614-120512-101-3', 'Tecnología', 'https://www.nexodigital.com', 'Empresa salvadoreña dedicada al desarrollo de software.', 'Ricardo Méndez', 'talento@nexodigital.com', '2250-1234', 'Col. Escalón, San Salvador', 'verificada', 2140),
(7, 'Finanzas Centrales', '0614-010199-001-8', 'Finanzas', 'https://www.finanzascentrales.com', 'Institución financiera con presencia en todo el país.', 'Laura Rivas', 'rrhh@finanzascentrales.com', '2260-5000', 'Antiguo Cuscatlán, La Libertad', 'verificada', 980),
(8, 'AgroVerde', '0614-030321-102-5', 'Comercio', NULL, 'Distribuidora de productos agrícolas.', 'Mario Castro', 'contacto@agroverde.com', '2440-7788', 'Santa Ana', 'pendiente', 0);

INSERT INTO ofertas (empresaId, titulo, ubicacion, sector, tipoTrabajo, tipoContrato, experiencia, salarioMinimo, salarioMaximo, vacantes, descripcion, responsabilidades, requisitos, beneficios, personaContacto, correoContacto, telefonoContacto, fechaCierre, estado, fechaPublicacion) VALUES
(1, 'Desarrollador Web Full Stack', 'San Salvador', 'Tecnología', 'Tiempo completo', 'Indefinido', '1 - 2 años', 1200, 1600, 2,
 'Buscamos un desarrollador que se una a nuestro equipo para crear aplicaciones web para clientes de Centroamérica.',
 E'Desarrollar y mantener aplicaciones web.\nCrear y consumir APIs REST.\nTrabajar en equipo usando metodologías ágiles.',
 E'Estudiante o graduado de Ingeniería en Sistemas.\nConocimientos de HTML, CSS, JavaScript y Bootstrap.\nConocimientos de bases de datos SQL.\n1 a 2 años de experiencia.',
 E'Prestaciones de ley y seguro médico.\nTrabajo híbrido.\nCapacitaciones pagadas.',
 'Ricardo Méndez', 'talento@nexodigital.com', '2250-1234', (NOW() + INTERVAL '30 days')::date, 'activa', NOW() - INTERVAL '12 days'),
(1, 'Analista de Calidad', 'San Salvador', 'Tecnología', 'Tiempo completo', 'Indefinido', '1 - 2 años', 900, 1100, 1,
 'Buscamos un analista QA para asegurar la calidad de nuestros productos.',
 E'Diseñar y ejecutar casos de prueba.\nReportar y dar seguimiento a errores.',
 E'Conocimientos de pruebas de software.\nManejo de herramientas como Postman.',
 E'Prestaciones de ley.\nHorario flexible.',
 'Ricardo Méndez', 'talento@nexodigital.com', '2250-1234', (NOW() + INTERVAL '20 days')::date, 'activa', NOW() - INTERVAL '10 days'),
(1, 'Diseñador Gráfico', 'Remoto', 'Tecnología', 'Medio tiempo', 'Temporal', 'Sin experiencia', 500, 700, 1,
 'Diseñador para piezas de redes sociales y sitios web.',
 E'Crear piezas gráficas.\nApoyar en el diseño de interfaces.',
 E'Manejo de Figma e Illustrator.',
 NULL,
 'Ricardo Méndez', 'talento@nexodigital.com', '2250-1234', (NOW() + INTERVAL '15 days')::date, 'inactiva', NOW() - INTERVAL '24 days'),
(1, 'Desarrollador Backend', 'San Salvador', 'Tecnología', 'Tiempo completo', 'Indefinido', 'Más de 3 años', 1500, 2000, 1,
 'Desarrollador backend para nuestros servicios en la nube.',
 E'Desarrollar APIs con Node.js.\nAdministrar bases de datos PostgreSQL.',
 E'Experiencia con Node.js y Express.\nConocimientos de PostgreSQL.',
 E'Prestaciones de ley y seguro médico.',
 'Ricardo Méndez', 'talento@nexodigital.com', '2250-1234', (NOW() + INTERVAL '45 days')::date, 'en_revision', NOW() - INTERVAL '0 days'),
(2, 'Desarrollador Backend Java', 'Antiguo Cuscatlán', 'Finanzas', 'Tiempo completo', 'Indefinido', '1 - 2 años', 1300, 1700, 2,
 'Desarrollador Java para los sistemas internos del banco.',
 E'Desarrollar servicios con Java y Spring.\nMantener sistemas existentes.',
 E'Conocimientos de Java.\nConocimientos de SQL.',
 E'Prestaciones de ley.\nBono anual.',
 'Laura Rivas', 'rrhh@finanzascentrales.com', '2260-5000', (NOW() + INTERVAL '35 days')::date, 'activa', NOW() - INTERVAL '8 days'),
(2, 'Analista de Créditos', 'Antiguo Cuscatlán', 'Finanzas', 'Tiempo completo', 'Indefinido', 'Sin experiencia', 800, 1000, 3,
 'Analista para evaluar solicitudes de crédito de clientes.',
 E'Analizar solicitudes de crédito.\nAtender a clientes.',
 E'Estudiante de Administración, Economía o afines.',
 E'Prestaciones de ley.\nSeguro de vida.',
 'Laura Rivas', 'rrhh@finanzascentrales.com', '2260-5000', (NOW() + INTERVAL '25 days')::date, 'activa', NOW() - INTERVAL '5 days');

-- Relacionar las ofertas demostrativas con el catalogo territorial.
UPDATE ofertas
SET modalidad = 'Remoto',
    distritoId = NULL,
    departamento = NULL,
    municipio = NULL
WHERE LOWER(TRIM(ubicacion)) = 'remoto';

UPDATE ofertas o
SET distritoId = d.distritoId
FROM distritos d
WHERE LOWER(TRIM(o.ubicacion)) = LOWER(TRIM(d.nombre))
  AND LOWER(TRIM(o.ubicacion)) <> 'remoto';

-- Completar el municipio y departamento a partir del distrito relacionado.
UPDATE ofertas o
SET municipio = m.nombre,
    departamento = dep.nombre
FROM distritos d
INNER JOIN municipios m ON m.municipioId = d.municipioId
INNER JOIN departamentos dep ON dep.departamentoId = m.departamentoId
WHERE o.distritoId = d.distritoId;

CREATE INDEX idx_ofertas_distrito ON ofertas(distritoId);
CREATE INDEX idx_ofertas_modalidad ON ofertas(modalidad);

INSERT INTO postulaciones (ofertaId, candidatoId, cartaPresentacion, estado, fechaPostulacion) VALUES
(1, 2, 'Me interesa formar parte de su equipo de desarrollo.', 'enviada', NOW() - INTERVAL '2 days'),
(1, 1, 'Tengo conocimientos en HTML, CSS y JavaScript.', 'en_revision', NOW() - INTERVAL '3 days'),
(2, 3, NULL, 'aceptada', NOW() - INTERVAL '6 days'),
(5, 1, NULL, 'rechazada', NOW() - INTERVAL '4 days'),
(6, 1, NULL, 'enviada', NOW() - INTERVAL '1 days');

INSERT INTO valoraciones (empresaId, candidatoId, calificacion, comentario, anonimo, estado) VALUES
(1, 3, 5, 'Excelente ambiente de trabajo, se aprende mucho y respetan el horario.', FALSE, 'publicada'),
(1, 2, 4, 'Buenas prestaciones, aunque en temporada de entregas hay bastante trabajo.', TRUE, 'publicada'),
(2, 1, 4, 'Buen ambiente de trabajo y capacitaciones constantes.', FALSE, 'pendiente');

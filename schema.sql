-- ============================================================
-- ANTOJITOS DULCES — Esquema de base de datos
-- Dos tablas relacionadas: clientes y cotizaciones.
-- Cada cotización queda ligada a un cliente (cliente_id).
-- ============================================================

CREATE TABLE IF NOT EXISTS clientes (
  id          SERIAL PRIMARY KEY,
  nombre      VARCHAR(100) NOT NULL,
  apellido    VARCHAR(100) NOT NULL,
  telefono    VARCHAR(100) NOT NULL,
  direccion   VARCHAR(100),              -- calle y número (opcional)
  poblacion   VARCHAR(150),              -- población / sector (opcional)
  creado_en   TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cotizaciones (
  id                 SERIAL PRIMARY KEY,
  cliente_id         INTEGER NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  tipo_evento        VARCHAR(100),
  fecha_evento       DATE,
  cantidad_personas  INTEGER,       -- "15 personas", "20 personas", etc.
  tipo_torta         VARCHAR(100),
  mensaje            VARCHAR(500),
  creado_en          TIMESTAMP DEFAULT NOW()
);

-- Índice para buscar rápido las cotizaciones de un cliente
CREATE INDEX IF NOT EXISTS idx_cotizaciones_cliente ON cotizaciones(cliente_id);

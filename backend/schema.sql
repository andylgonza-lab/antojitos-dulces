-- ============================================================
-- ANTOJITOS DULCES — Esquema de base de datos
-- Dos tablas relacionadas: clientes y cotizaciones.
-- Cada cotización queda ligada a un cliente (cliente_id).
-- ============================================================

CREATE TABLE IF NOT EXISTS clientes (
  id          SERIAL PRIMARY KEY,
  nombre      TEXT NOT NULL,
  apellido    TEXT NOT NULL,
  telefono    TEXT NOT NULL,
  direccion   TEXT,              -- calle y número (opcional)
  poblacion   TEXT,              -- población / sector (opcional)
  creado_en   TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cotizaciones (
  id                 SERIAL PRIMARY KEY,
  cliente_id         INTEGER NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  tipo_evento        TEXT,
  fecha_evento       DATE,
  hora_entrega       TIME,
  cantidad_personas  TEXT,       -- "15 personas", "20 personas", etc.
  tipo_torta         TEXT,
  mensaje            TEXT,
  creado_en          TIMESTAMP DEFAULT NOW()
);

-- Índice para buscar rápido las cotizaciones de un cliente
CREATE INDEX IF NOT EXISTS idx_cotizaciones_cliente ON cotizaciones(cliente_id);

-- ============================================================
-- Contador de visitas: una sola fila que se va incrementando
-- ============================================================
CREATE TABLE IF NOT EXISTS visitas (
  id    INTEGER PRIMARY KEY DEFAULT 1,
  total INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT solo_una_fila CHECK (id = 1)
);
INSERT INTO visitas (id, total) VALUES (1, 0) ON CONFLICT (id) DO NOTHING;

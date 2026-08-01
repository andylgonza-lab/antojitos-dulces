// ============================================================
// ANTOJITOS DULCES — Backend
// Recibe el formulario de cotización, guarda al cliente y a la
// cotización en PostgreSQL. Corre por separado de la página web
// (que sigue siendo HTML/CSS/JS servido con Live Server).
// ============================================================
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();
app.use(cors()); // permite que la página (otro puerto) le hable a este servidor
app.use(express.json());

// ---- Crear cliente + cotización ----
app.post("/api/cotizaciones", async (req, res) => {
  const {
    nombre,
    apellido,
    telefono,
    direccion,
    poblacion,
    evento,
    fecha,
    hora,
    personas,
    torta,
    mensaje,
  } = req.body;

  if (!nombre || !apellido || !telefono) {
    return res.status(400).json({
      error: "Faltan datos obligatorios (nombre, apellido o teléfono).",
    });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const clienteResult = await client.query(
      `INSERT INTO clientes (nombre, apellido, telefono, direccion, poblacion)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      [nombre, apellido, telefono, direccion || null, poblacion || null]
    );
    const clienteId = clienteResult.rows[0].id;

    await client.query(
      `INSERT INTO cotizaciones
        (cliente_id, tipo_evento, fecha_evento, hora_entrega, cantidad_personas, tipo_torta, mensaje)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        clienteId,
        evento || null,
        fecha || null,
        hora || null,
        personas || null,
        torta || null,
        mensaje || null,
      ]
    );

    await client.query("COMMIT");
    res.status(201).json({ ok: true, clienteId });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error al guardar la cotización:", err);
    res.status(500).json({ error: "Error al guardar la cotización." });
  } finally {
    client.release();
  }
});

// ---- Listar cotizaciones (con datos del cliente) ----
// Útil para revisar los pedidos que han llegado, por ejemplo
// abriendo http://localhost:3000/api/cotizaciones en el navegador.
app.get("/api/cotizaciones", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        co.id,
        cl.nombre, cl.apellido, cl.telefono, cl.direccion, cl.poblacion,
        co.tipo_evento, co.fecha_evento, co.hora_entrega, co.cantidad_personas,
        co.tipo_torta, co.mensaje, co.creado_en
      FROM cotizaciones co
      JOIN clientes cl ON cl.id = co.cliente_id
      ORDER BY co.creado_en DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("Error al obtener las cotizaciones:", err);
    res.status(500).json({ error: "Error al obtener las cotizaciones." });
  }
});

// ---- Contador de visitas ----
// Suma 1 cada vez que alguien carga la página y devuelve el total.
app.post("/api/visitas/hit", async (req, res) => {
  try {
    const result = await pool.query(
      `UPDATE visitas SET total = total + 1 WHERE id = 1 RETURNING total`
    );
    res.json({ total: result.rows[0].total });
  } catch (err) {
    console.error("Error al actualizar el contador de visitas:", err);
    res.status(500).json({ error: "Error al actualizar el contador de visitas." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Backend de Antojitos Dulces escuchando en http://localhost:${PORT}`);
});
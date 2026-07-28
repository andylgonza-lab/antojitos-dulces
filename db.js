// ============================================================
// Conexión a PostgreSQL usando un "pool" de conexiones.
// Las credenciales se leen desde el archivo .env (nunca las
// escribas directo en el código).
// ============================================================
require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

pool.on("error", (err) => {
  console.error("Error inesperado en el pool de PostgreSQL:", err);
});

module.exports = pool;

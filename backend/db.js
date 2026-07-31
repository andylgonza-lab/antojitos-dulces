// ============================================================
// Conexión a PostgreSQL usando un "pool" de conexiones.
// Las credenciales se leen desde el archivo .env (nunca las
// escribas directo en el código).
//
// Soporta dos modos:
// 1. DATABASE_URL definida (una sola cadena completa) → se usa esa.
// 2. Si no, usa las variables sueltas (DB_HOST, DB_USER, etc.) —
//    más fácil de depurar si la contraseña tiene caracteres raros.
// Detecta Supabase automáticamente (por el host) y activa SSL,
// que Supabase exige siempre, sin importar el modo usado.
// ============================================================
require("dotenv").config();
const { Pool } = require("pg");

const esSupabase = (
  process.env.DATABASE_URL || process.env.DB_HOST || ""
).includes("supabase");

const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: esSupabase ? { rejectUnauthorized: false } : false,
    })
  : new Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD, // pg lo toma tal cual, sin pelear con codificar símbolos en una URL
      port: process.env.DB_PORT,
      ssl: esSupabase ? { rejectUnauthorized: false } : false,
    });

pool.on("error", (err) => {
  console.error("Error inesperado en el pool de PostgreSQL:", err);
});

module.exports = pool;
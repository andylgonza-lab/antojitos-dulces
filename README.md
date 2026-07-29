# Antojitos Dulces — Backend (Node + Express + PostgreSQL)

Este servidor recibe el formulario de cotización de la página y guarda al **cliente**
y a la **cotización** en PostgreSQL, en dos tablas relacionadas.

## 1. Instalar dependencias

Desde la carpeta `backend/`:

```bash
cd backend
npm install
```

## 2. Configurar la conexión a la base de datos

```bash
cp .env.example .env
```

Abre `.env` y reemplaza los valores por los de tu PostgreSQL local (usuario, password, etc).
Si instalaste Postgres con la configuración por defecto, probablemente `DB_USER=postgres`
y `DB_HOST=localhost` ya están correctos — solo cambia `DB_PASSWORD`.

## 3. Crear la base de datos y las tablas

Desde la terminal (con Postgres corriendo):

```bash
# Crea la base de datos (solo la primera vez)
createdb antojitos_dulces

# Crea las tablas clientes y cotizaciones
psql -d antojitos_dulces -f schema.sql
```

> Si `createdb` o `psql` no se reconocen como comando, es porque la carpeta `bin` de
> PostgreSQL no está en el PATH de tu sistema. Alternativa: abre **pgAdmin**, crea ahí
> la base de datos `antojitos_dulces`, y pega el contenido de `schema.sql` en su
> "Query Tool" para crear las tablas.

## 4. Levantar el servidor

```bash
npm start
```

Si todo está bien configurado, verás en la terminal:

```
✅ Backend de Antojitos Dulces escuchando en http://localhost:3000
```

Déjalo corriendo en esa terminal mientras usas la página (necesitas **dos** cosas abiertas
a la vez: Live Server para la página, y este backend para guardar los datos).

## 5. Probar que funciona

Completa y envía el formulario de cotización en la página normalmente. Luego, abre esto
en el navegador para ver todo lo que se ha guardado:

```
http://localhost:3000/api/cotizaciones
```

Vas a ver una lista en formato JSON con cada cotización y los datos del cliente asociado.

## Estructura de las tablas

**clientes**
| Columna    | Tipo      | Notas                        |
|------------|-----------|-------------------------------|
| id         | SERIAL    | Autogenerado                  |
| nombre     | TEXT      | Obligatorio                   |
| apellido   | TEXT      | Obligatorio                   |
| telefono   | TEXT      | Obligatorio                   |
| direccion  | TEXT      | Opcional                      |
| poblacion  | TEXT      | Opcional                      |
| creado_en  | TIMESTAMP | Se llena solo                 |

**cotizaciones**
| Columna            | Tipo      | Notas                              |
|---------------------|-----------|-------------------------------------|
| id                  | SERIAL    | Autogenerado                        |
| cliente_id          | INTEGER   | Referencia a `clientes.id`          |
| tipo_evento         | TEXT      |                                      |
| fecha_evento        | DATE      |                                      |
| cantidad_personas   | TEXT      | "15 personas", "20 personas", etc.  |
| tipo_torta          | TEXT      |                                      |
| mensaje             | TEXT      |                                      |
| creado_en           | TIMESTAMP | Se llena solo                       |

## ¿Por qué dos tablas y no una sola?

Porque un mismo cliente puede pedir varias cotizaciones a lo largo del tiempo. Separarlas
evita repetir su nombre/teléfono/dirección cada vez, y te permite después hacer consultas
como "¿cuántas cotizaciones ha pedido esta persona?" o "¿cuáles son mis clientes más
frecuentes?" — cosas que con una sola tabla mezclada serían más difíciles.

## Notas importantes

- Este backend corre **solo en tu computador** (`localhost`) por ahora. La página web en
  `js/script.js` intenta guardar cada cotización acá, pero si el backend no está corriendo
  (por ejemplo, cuando publiques la página en internet más adelante), el formulario sigue
  funcionando igual gracias a Formspree — el guardado en Postgres simplemente no ocurre
  silenciosamente, sin romper nada.
- El archivo `.env` **nunca** debe subirse a GitHub — ya está en `.gitignore` para evitarlo,
  porque contiene la contraseña de tu base de datos.
- Cuando quieras publicar la página con el backend funcionando de verdad para cualquier
  visitante (no solo tú en tu computador), vas a necesitar "hostear" este backend y la base
  de datos en un servicio como Railway, Render o Supabase — eso lo podemos ver más adelante.
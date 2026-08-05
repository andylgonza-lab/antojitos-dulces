# Antojitos Dulces

Landing page + backend para **Antojitos Dulces**, pastelería en Los Álamos, Chile.

- 📷 Instagram: [@antojitos_dulces_la](https://www.instagram.com/antojitos_dulces_la/)
- 💬 WhatsApp: +56 9 8407 2985
- 📍 Toqui Araucano #135, esquina Simón Carballo, Los Álamos, Chile

## 🌐 Sitios publicados

| Sitio | URL | Estado |
|---|---|---|
| **Principal (Bluehosting)** | https://antojitosdulces.codingbase.cl | ✅ Frontend + backend + BD, todo funcionando |
| Backend (Bluehosting) | https://api-antojitosdulces.codingbase.cl | ✅ API propia, Postgres en el mismo hosting |
| GitHub Pages (respaldo) | https://andylgonza-lab.github.io/antojitos-dulces/ | ⚠️ Conectado a Supabase (backend anterior) |
| Netlify (respaldo) | https://antojitos-dulces-la.netlify.app/ | ⚠️ Conectado a Supabase (backend anterior) |

## 📁 Estructura del proyecto

```
Antojitos-dulces/
├── index.html               → página principal
├── css/styles.css
├── js/script.js
├── assets/                  → logo, fotos
├── README.md                → este archivo
├── ESTADO-DEL-PROYECTO.md   → bitácora para retomar el trabajo en cualquier momento
└── backend/
    ├── server.js             → servidor Express (endpoints /api/...)
    ├── db.js                 → conexión a PostgreSQL
    ├── schema.sql            → estructura de las tablas
    ├── package.json
    └── .env                  → credenciales (NUNCA subir a git)
```

## ▶️ Cómo trabajar en el proyecto (en local)

1. Abre la carpeta en VS Code.
2. **Frontend**: clic derecho en `index.html` → *Open with Live Server*.
3. **Backend**: en una terminal aparte, `cd backend && npm start`.

## 🔧 Flujo de trabajo para hacer cambios (sin romper el sitio publicado)

**Regla de oro: nunca se edita directo en producción** (ni en el Administrador de archivos de cPanel, ni en el sitio en vivo). Siempre local → probado → recién ahí se sube.

### Paso a paso

1. **Edita en tu carpeta local**, nunca en cPanel directamente.
2. **Prueba en local antes de subir nada**:
   - Frontend con Live Server
   - Backend con `npm start` (revisa que no tire errores en la terminal)
3. Si todo funciona bien y no rompe nada, recién ahí subes **solo los archivos que cambiaste**:

   | Qué cambiaste | Dónde subirlo (Administrador de archivos de cPanel) | Paso extra |
   |---|---|---|
   | `index.html`, `css/`, `js/`, `assets/` | Carpeta `antojitosdulces.codingbase.cl` | Ninguno — se actualiza solo |
   | `server.js`, `db.js`, `package.json` | Carpeta `api-antojitosdulces.codingbase.cl` | **Ir a "Setup Node.js App" → "REINICIAR"** — si no reinicias, el servidor sigue usando el código viejo aunque el archivo ya esté actualizado |

4. Si cambiaste el backend, prueba de inmediato abriendo `https://api-antojitosdulces.codingbase.cl/api/cotizaciones` en el navegador — debe responder `[]` o una lista, no un error.
5. **Buen hábito**: haz `git commit` de tus cambios en local aunque no los subas a GitHub cada vez — así siempre tienes una versión anterior "buena" a la que volver si algo sale mal en producción.

### Si algo se rompe después de subir un cambio

Vuelve a subir la versión anterior del archivo (la que tenías en tu `git log` o en tu última copia local funcionando) al mismo lugar, y si era el backend, reinicia de nuevo en "Setup Node.js App". El sitio vuelve a la normalidad en el momento.

## 🗄️ Base de datos

PostgreSQL en el mismo hosting (Bluehosting). Ver `backend/schema.sql` para la estructura completa (tablas `clientes`, `cotizaciones`, `visitas`).

⚠️ Nota importante de PostgreSQL: si alguna vez agregas una tabla nueva con una columna `SERIAL`, después de crearla hay que correr esto en phpPgAdmin para que el usuario de la app pueda insertar filas:
```sql
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO codingba_antojitos_user;
```
("Sincronizar permisos" de cPanel no cubre esto automáticamente.)

## 📄 Más detalles

Para el historial completo de decisiones, funcionalidades ya construidas y lo pendiente, ver **`ESTADO-DEL-PROYECTO.md`** — súbelo al iniciar un chat nuevo con Claude para retomar el contexto sin tener que explicar todo de nuevo.

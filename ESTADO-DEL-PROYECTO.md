# Antojitos Dulces — Estado del proyecto

> Sube o pega este archivo al iniciar un chat nuevo con Claude para que retome el contexto completo del proyecto.

## Qué es esto

Landing page + backend para "Antojitos Dulces", pastelería en Los Álamos, Chile.
Instagram: @antojitos_dulces_la — WhatsApp: +56 9 8407 2985

## ✅ Estado actual: publicada, migrada y funcionando

- **Sitio principal**: `https://antojitosdulces.cl` (dominio definitivo, comprado y configurado, SSL activo)
- **Backend**: `https://api-antojitosdulces.codingbase.cl` (Node.js vía "Setup Node.js App" en cPanel, Node 20.20.2)
- **Base de datos**: PostgreSQL en el mismo cPanel — BD `codingba_antojitos_bd`, usuario `codingba_antojitos_user`
- **Respaldo estable**: GitHub Pages (`https://andylgonza-lab.github.io/antojitos-dulces/`) — se mantiene a propósito. Solo funciona el envío de correo por Formspree ahí (no tiene backend propio conectado); es aceptable, es solo un respaldo.
- **Dados de baja** (ya no existen): Netlify, subdominio `antojitosdulces.codingbase.cl`, proyecto de Supabase — eran temporales del período de pruebas antes del dominio definitivo.

⚠️ La cuenta de cPanel es **prestada** (comparte cuenta con el sitio y correos de `codingbase.cl`) — siempre confirmar dos veces antes de tocar cualquier dominio o archivo que no sea de Antojitos Dulces.

## Estructura de carpetas (proyecto local)

```
Antojitos-dulces/
├── index.html, css/, js/, assets/     → frontend (raíz, para GitHub Pages)
├── README.md                          → flujo de trabajo para modificaciones
├── ESTADO-DEL-PROYECTO.md             → este archivo
└── backend/
    ├── server.js, db.js, schema.sql
    ├── package.json, .env (no subir a git)
```

## Funcionalidades ya construidas

- Landing completa: hero, sobre nosotros (con "Nuestra Promesa"), catálogo por ocasión (6 tarjetas), **catálogo interactivo de sabores** (18 tortas + 3 nuevas: Panqueque de Naranja/Chocolate/Nuez = 21 en total) con modal y descripciones, precios en modal (tabla completa con las 21 tortas x 4 tramos de personas, con acceso también desde una tarjeta junto al mapa), features, testimonios, slider de Instagram automático, mapa embebido con la dirección real, footer con contacto
- **Documentos legales**: Política de Privacidad, Términos y Condiciones y Aviso Legal — accesibles desde el footer (modal reutilizable), redactados a la medida del sitio real (qué datos recolecta, Formspree, Google Maps, etc.). Son un borrador orientado al caso real, no asesoría legal certificada — revisar con abogado antes de diciembre 2026 (entrada en vigencia de la Ley 21.719 de Protección de Datos; como PyME hay margen: solo amonestación, no multa, el primer año)
- **Checkbox de consentimiento** en el formulario: obligatorio, sin marcar por defecto, con links clickeables a Política de Privacidad y Términos que abren el modal correspondiente
- Formulario de cotización → guarda en Postgres (tablas `clientes` + `cotizaciones`) Y envía correo por Formspree (ambos a la vez)
- Campos del formulario: nombre, apellido, teléfono, dirección/población (opcionales), tipo evento, fecha, hora de entrega/retiro, cantidad personas (15/20/30/40), tipo de torta (21 opciones), mensaje, checkbox de aceptación de políticas
- Contador de visitas real (tabla `visitas` en Postgres, no servicio externo)
- Botón "volver arriba" + sección activa resaltada en navbar (scrollspy)
- El submenú desplegable de "Catálogo" en el navbar fue eliminado (ahora es un link simple) — el JS que lo controlaba se dejó defensivo (con chequeo `if (dropdown)`) para que no rompa nada si se vuelve a tocar el navbar
- Responsive, con varios ajustes de mobile ya resueltos (logo, menú, footer)

## Gotchas aprendidos (para no repetir errores)

1. **Secuencias de Postgres**: "Sincronizar permisos" en cPanel da permisos sobre TABLAS pero no sobre SEQUENCES (los `id SERIAL`). Si un usuario nuevo no puede insertar: `GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO codingba_antojitos_user;`
2. **Variables de entorno en "Setup Node.js App"**: hay que darle "GUARDAR" explícito después de añadirlas — si no, no persisten aunque parezcan agregadas.
3. **Después de cambiar env vars o código del backend**: siempre hay que "REINICIAR" la app de Node para que tome los cambios.
4. **cPanel — dominios nuevos**: al crear un dominio o subdominio, NUNCA compartir el "Document Root" con otro dominio existente — siempre carpeta separada.
5. Errores como "Cannot GET /" o el aviso rojo al hacer NPM Install en cPanel suelen ser falsas alarmas — confirmar mirando el log real (`/home/codingba/logs/antojitos-backend.log`) antes de asumir que algo se rompió.
6. **Si el usuario edita el HTML a mano y elimina un elemento** (como el dropdown), revisar que el JS que lo referenciaba no se rompa — un solo `querySelector` que devuelve `null` puede detener TODO el script que viene después.
7. Cada vez que se agrega un tipo de torta nuevo, debe quedar igual (mismo texto exacto) en 3 lugares: el `<select id="torta">` del formulario, la tabla del modal de precios, y el arreglo `sabores` en `script.js` — así el catálogo interactivo puede preseleccionarla automáticamente en el formulario.

## 💡 Ideas para más adelante (sin iniciar todavía)

- [ ] Cambios de diseño puntuales a la página (a definir cuándo)
- [ ] **Notificación por WhatsApp cuando llega una cotización** (además del correo actual) — para investigar: la forma estándar es integrar la API de WhatsApp Business (Meta) o un servicio intermediario tipo Twilio/CallMeBot, desde el backend (`server.js`), en el mismo punto donde ya se guarda en Postgres
- [ ] Sistema de clientes frecuentes (registro de compras, regalo cada 5 compras)
- [ ] Evaluar si conviene reconectar GitHub Pages a un backend real, o dejarlo solo como respaldo de correo
- [ ] Revisar documentos legales con un abogado antes de diciembre 2026, y actualizar el RUT en el Aviso Legal cuando se formalice el negocio

## Flujo de trabajo para modificaciones

Ver `README.md` — resumen: editar y probar siempre en local primero (Live Server + `npm start` en `backend/`); frontend se sube y ya funciona; backend necesita subir el archivo Y darle "REINICIAR" en Setup Node.js App.

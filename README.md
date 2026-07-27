# Antojitos Dulces — Landing Page

Landing page de una página para el emprendimiento **Antojitos Dulces** (repostería y coctelería).
Hecha en HTML, CSS y JavaScript puro — no necesita backend ni base de datos para funcionar.

## 📁 Estructura

```
antojitos-dulces/
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── script.js
├── assets/
│   ├── logo.png
│   └── subtitulo.png
└── README.md
```

## ▶️ Cómo verla en VS Code

1. Abre la carpeta `antojitos-dulces` en VS Code.
2. Instala la extensión **Live Server** (de Ritwick Dey), si no la tienes.
3. Clic derecho sobre `index.html` → **Open with Live Server**.
4. Se abrirá en tu navegador con recarga automática cada vez que guardes cambios.

## 📧 Conectar el formulario a tu correo (Formspree)

El formulario de cotización usa **Formspree**, un servicio gratuito que recibe los datos
del formulario y te los reenvía por correo — no necesitas backend propio para esto.

1. Entra a [formspree.io](https://formspree.io) y crea una cuenta gratis.
2. Crea un nuevo formulario y copia el **Form ID** que te entrega (algo como `mzbqwxyz`).
3. En `index.html`, busca esta línea:
   ```html
   <form class="form" id="cotizacionForm" action="https://formspree.io/f/TU_ID_DE_FORMSPREE" method="POST">
   ```
4. Reemplaza `TU_ID_DE_FORMSPREE` por tu ID real.
5. La primera vez que alguien envíe el formulario, Formspree te pedirá confirmar tu correo. Después de eso, todos los envíos te llegarán automáticamente.

> El plan gratuito de Formspree permite 50 envíos al mes, más que suficiente para partir.

## 🖼️ Reemplazar las fotos (diseño v2)

El diseño actual tiene varias zonas marcadas como marcador de posición, para que reemplaces
por tus fotos reales de tortas cuando las tengas. Todas están en `index.html`:

1. **Foto del hero** (torta principal): busca `<div class="hero__media">` y dentro de
   `<div class="hero__photo"></div>` agrega una imagen, por ejemplo:
   ```html
   <div class="hero__photo">
     <img src="assets/torta-hero.jpg" alt="Torta Antojitos Dulces" style="width:100%;height:100%;object-fit:cover;border-radius:14px;">
   </div>
   ```
   (y elimina la regla `.hero__photo::before` en `css/styles.css` si ya no quieres el texto de marcador).

2. **Collage "Sobre nosotros"**: busca `<div class="nosotros__collage">` — tiene 3 bloques
   `div.nosotros__ph`. Reemplaza cada uno por una etiqueta `<img>` con tu foto.

3. **Catálogo**: busca `<div class="catalogo__grid">` — cada `div.cat-card` es una categoría.
   Agrega tu foto de fondo con `style="background-image:url('assets/tu-foto.jpg')"` o
   reemplaza el `div` por una `<picture>`/`<img>` manteniendo la clase `cat-card`.

4. **Slider de Instagram**: ahora es un carrusel horizontal con flechas. En `js/script.js`, cambia `totalPlaceholders` por la cantidad de fotos que tengas, y agrega el fondo de cada una en `index.html` con el mismo truco que usaste en el catálogo (`background-image` + `background-size: cover`). Ejemplo, reemplazando el bloque que genera los `div.insta__ph` en `js/script.js` por:
   ```js
   const fotos = ['ig-1.jpg', 'ig-2.jpg', 'ig-3.jpg', 'ig-4.jpg', 'ig-5.jpg', 'ig-6.jpg', 'ig-7.jpg', 'ig-8.jpg'];
   fotos.forEach(nombre => {
     const div = document.createElement('div');
     div.className = 'insta__ph';
     div.style.backgroundImage = `url('assets/${nombre}')`;
     instaGrid.appendChild(div);
   });
   ```
   Mientras más fotos agregues, más se podrá deslizar el carrusel con las flechas.

Guarda todas tus fotos dentro de la carpeta `assets/`.

## 🚀 Subir a GitHub

Desde la terminal integrada de VS Code (dentro de la carpeta del proyecto):

```bash
git init
git add .
git commit -m "Landing page Antojitos Dulces"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/antojitos-dulces.git
git push -u origin main
```

## 🌐 Publicarla gratis en internet

Con **GitHub Pages** (lo más simple, ya que usas GitHub):

1. Sube el proyecto a GitHub (paso anterior).
2. En el repositorio: **Settings → Pages**.
3. En "Branch" elige `main` y carpeta `/ (root)` → **Save**.
4. En un par de minutos tu página quedará disponible en:
   `https://TU_USUARIO.github.io/antojitos-dulces/`

Otras alternativas igual de fáciles: **Netlify** o **Vercel** (arrastras la carpeta y listo).

## 🐘 Siguientes pasos con PostgreSQL (opcional, a futuro)

Esta versión no usa base de datos porque una landing estática no la necesita. El día que quieras, por ejemplo, **guardar las cotizaciones en tu propia base de datos** (además de recibirlas por correo), el camino natural sería:

1. Crear un backend simple con **Node.js + Express**.
2. Una tabla en Postgres, por ejemplo:
   ```sql
   CREATE TABLE cotizaciones (
     id SERIAL PRIMARY KEY,
     nombre TEXT NOT NULL,
     telefono TEXT NOT NULL,
     tipo_evento TEXT,
     fecha_evento DATE,
     personas INTEGER,
     mensaje TEXT,
     creado_en TIMESTAMP DEFAULT NOW()
   );
   ```
3. Un endpoint `POST /api/cotizaciones` que reciba el formulario, lo guarde en Postgres y además envíe el correo (con `nodemailer`, por ejemplo).
4. Cambiar el `action` del formulario en `index.html` para que apunte a ese endpoint en vez de a Formspree.

Si quieres, en otra conversación te puedo ayudar a armar ese backend paso a paso.

## ✏️ Cosas para personalizar

- **Textos de "Sobre nosotros"**: son un borrador — cámbialos por tu historia real.
- **Productos**: ajusta nombres, precios o categorías según tu carta real.
- **Colores**: están definidos como variables al inicio de `css/styles.css` (`:root`), fáciles de ajustar si tu bosquejo de marca tiene tonos distintos.
- **Fuente script**: se usa "Alex Brush" de Google Fonts por parecido al logo. Si tienes el nombre exacto de tu fuente, dímelo y la reemplazo.
# antojitos-dulces

// ============================================================
// ANTOJITOS DULCES — script.js
// Menú móvil (con dropdown de catálogo), año del footer,
// placeholders de Instagram y envío del formulario vía Formspree.
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
  // ---- Menú móvil (nav dividido en dos: navLinksLeft y navLinksRight) ----
  const burger = document.getElementById("navBurger");
  const navGroups = [
    document.getElementById("navLinksLeft"),
    document.getElementById("navLinksRight"),
  ];

  burger.addEventListener("click", () => {
    const isOpen = !navGroups[0].classList.contains("is-open");
    navGroups.forEach((group) => group.classList.toggle("is-open", isOpen));
    burger.setAttribute("aria-expanded", String(isOpen));
  });

  navGroups.forEach((group) => {
    group.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        // No cerrar si es el toggle del dropdown en móvil
        if (a.parentElement.classList.contains("nav__dropdown")) return;
        navGroups.forEach((g) => g.classList.remove("is-open"));
        burger.setAttribute("aria-expanded", "false");
      });
    });
  });

  // ---- Dropdown "Catálogo" en móvil (tap para abrir/cerrar) ----
  // Nota: se hizo defensivo porque el submenú desplegable de Catálogo
  // fue quitado del HTML — sin este chequeo, el script se rompía acá
  // y todo lo que viene después dejaba de funcionar.
  const dropdown = document.querySelector(".nav__dropdown");
  if (dropdown) {
    const dropdownToggle = dropdown.querySelector("a");
    dropdownToggle.addEventListener("click", (e) => {
      if (window.innerWidth <= 980) {
        e.preventDefault();
        dropdown.classList.toggle("is-open");
      }
    });
  }

  // ---- Año dinámico en el footer ----
  document.getElementById("year").textContent = new Date().getFullYear();

  // URL base de tu backend local (ver carpeta backend/). Solo funciona
  // mientras tengas ese servidor corriendo con "npm start" en otra terminal.
  const API_BASE = "https://api-antojitosdulces.codingbase.cl";

  // ---- Contador de visitas ----
  // Ahora usa tu propio backend + Postgres (tabla "visitas"), en vez del
  // servicio gratuito CountAPI, que no era confiable.
  const visitCountEl = document.getElementById("visitCount");
  fetch(`${API_BASE}/api/visitas/hit`, { method: "POST" })
    .then((res) => res.json())
    .then((data) => {
      visitCountEl.textContent = data.total.toLocaleString("es-CL");
    })
    .catch(() => {
      visitCountEl.textContent = "—";
    });

  // ---- Placeholders de Instagram ----
  // Reemplaza este bloque por tus fotos reales (ver README.md)
  const instaGrid = document.getElementById("instaGrid");

  const fotos = [
    "ig-1.webp",
    "ig-2.webp",
    "ig-3.webp",
    "ig-4.webp",
    "ig-5.webp",
    "ig-6.webp",
    "ig-7.webp",
    "ig-8.webp",
    "ig-9.webp",
    "ig-10.webp",
  ];
  fotos.forEach((nombre) => {
    const div = document.createElement("div");
    div.className = "insta__ph";
    div.style.backgroundImage = `url('assets/${nombre}')`;
    instaGrid.appendChild(div);
  });

  // ---- Flechas del slider de Instagram ----
  const instaPrev = document.getElementById("instaPrev");
  const instaNext = document.getElementById("instaNext");
  const scrollAmount = () => instaGrid.clientWidth * 0.9;

  instaPrev.addEventListener("click", () => {
    instaGrid.scrollBy({ left: -scrollAmount(), behavior: "smooth" });
    reiniciarAutoAvance();
  });
  instaNext.addEventListener("click", () => {
    instaGrid.scrollBy({ left: scrollAmount(), behavior: "smooth" });
    reiniciarAutoAvance();
  });

  // ---- Auto-avance del slider (galería automática) ----
  const INSTA_AUTO_MS = 3500; // cada cuánto avanza solo, en milisegundos
  let instaAutoTimer = null;

  function avanzarAuto() {
    const maxScroll = instaGrid.scrollWidth - instaGrid.clientWidth;
    if (instaGrid.scrollLeft >= maxScroll - 5) {
      instaGrid.scrollTo({ left: 0, behavior: "smooth" }); // vuelve al inicio
    } else {
      instaGrid.scrollBy({ left: scrollAmount(), behavior: "smooth" });
    }
  }

  function iniciarAutoAvance() {
    detenerAutoAvance();
    instaAutoTimer = setInterval(avanzarAuto, INSTA_AUTO_MS);
  }
  function detenerAutoAvance() {
    if (instaAutoTimer) clearInterval(instaAutoTimer);
  }
  function reiniciarAutoAvance() {
    // al hacer clic en una flecha, reinicia la cuenta regresiva del auto-avance
    iniciarAutoAvance();
  }

  iniciarAutoAvance();

  // Se pausa mientras el mouse está encima o mientras tocas el carrusel
  // (para que no "se te escape" mientras estás mirando o deslizando)
  ["mouseenter", "touchstart"].forEach((evento) => {
    instaGrid.addEventListener(evento, detenerAutoAvance);
  });
  ["mouseleave", "touchend"].forEach((evento) => {
    instaGrid.addEventListener(evento, iniciarAutoAvance);
  });

  // ---- Botón "volver arriba" ----
  const backToTop = document.getElementById("backToTop");
  window.addEventListener("scroll", () => {
    backToTop.classList.toggle("is-visible", window.scrollY > 500);
  });
  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // ---- Sección activa en el navbar (resalta dónde estás mientras haces scroll) ----
  const navLinksTodos = document.querySelectorAll('.nav__links a[href^="#"]');
  const seccionesObservadas = [];

  navLinksTodos.forEach((link) => {
    const id = link.getAttribute("href").slice(1);
    // "Inicio" apunta a #top (el header), pero lo que nos interesa
    // detectar es el hero de más abajo, no el header que siempre está fijo.
    const seccion = id === "top" ? document.getElementById("hero") : document.getElementById(id);
    if (seccion) seccionesObservadas.push({ id, link, seccion });
  });

  function marcarSeccionActiva(idVisible) {
    navLinksTodos.forEach((link) => link.classList.remove("is-active"));
    const activa = seccionesObservadas.find((s) => s.seccion.id === idVisible);
    if (activa) activa.link.classList.add("is-active");
  }

  if ("IntersectionObserver" in window && seccionesObservadas.length) {
    const scrollSpyObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) marcarSeccionActiva(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 } // detecta cerca del centro de la pantalla
    );
    seccionesObservadas.forEach(({ seccion }) => scrollSpyObserver.observe(seccion));
  }

  // ---- Catálogo interactivo de sabores ----
  // NOTA: estas descripciones son un borrador generado según el nombre de
  // cada torta — revísalas y corrígelas si algo no calza con tu receta real.
  const sabores = [
    { nombre: "Torta Yogurth", icono: "🍰", desc: "Bizcocho de vainilla con un suave toque de yogurt, crema chantilly y una fina capa de jalea. Delicada, fresca y liviana — ideal si buscas algo no tan dulce." },
    { nombre: "Manjar Platano", icono: "🍌", desc: "Cuatro capas de bizcocho de vainilla rellenas con manjar, plátano natural y una suave crema de plátano. Un clásico dulce y reconfortante." },
    { nombre: "Manjar Mermelada", icono: "🍓", desc: "Cuatro capas de bizcocho de vainilla que combinan mermelada, una fina capa de crema y manjar. Dulce y con distintas texturas en cada bocado." },
    { nombre: "Manjar Crema", icono: "🍮", desc: "Cuatro capas de bizcocho de vainilla rellenas con manjar y crema chantilly. Simple, cremosa y siempre un acierto seguro." },
    { nombre: "Piña crema", icono: "🍍", desc: "Cuatro capas de bizcocho de vainilla rellenas con piña natural y crema chantilly. Fresca, liviana y perfecta para los días de calor." },
    { nombre: "Piña manjar", icono: "🍍", desc: "Cuatro capas de bizcocho de vainilla rellenas con piña, manjar y una fina capa de crema. El equilibrio justo entre lo ácido de la fruta y lo dulce del manjar." },
    { nombre: "Durazno Crema", icono: "🍑", desc: "Cuatro capas de bizcocho de vainilla rellenas con durazno y crema chantilly. Suave, frutal y delicada." },
    { nombre: "Durazno manjar", icono: "🍑", desc: "Cuatro capas de bizcocho de vainilla rellenas con durazno, manjar y una fina capa de crema. Dulce y jugosa, con el sabor del durazno en cada capa." },
    { nombre: "Torta lúcuma manjar", icono: "🟠", desc: "Cuatro capas de bizcocho de vainilla rellenas con manjar y crema de lúcuma. El sabor inconfundible de la lúcuma, en una torta cremosa y distinta." },
    { nombre: "Torta Frambuesa-crema", icono: "🍇", desc: "Cuatro capas de bizcocho de vainilla con frambuesas naturales y crema chantilly. Fresca y con ese toque ácido que la hace irresistible." },
    { nombre: "Torta Mocca", icono: "☕", desc: "Cuatro capas de bizcocho de vainilla rellenos con manjar y crema de mocca. Para quienes aman el café en cada bocado." },
    { nombre: "Torta Amor (bizcocho)", icono: "❤️", desc: "Cuatro capas de bizcocho de vainilla rellenos con manjar, crema pastelera, mermelada y frambuesas con crema. Nuestra torta más completa, pensada para ocasiones especiales." },
    { nombre: "Tres Leches", icono: "🥛", desc: "Cuatro capas de bizcocho de vainilla remojadas en tres leches, con relleno de manjar y crema pastelera. El clásico de siempre, jugoso hasta el último bocado." },
    { nombre: "Manjar Nuez", icono: "🌰", desc: "Cuatro capas de bizcocho de vainilla rellenos con nueces, manjar y crema. Dulce, con textura crocante y sabor intenso." },
    { nombre: "Selva Negra", icono: "🍒", desc: "Cuatro capas de bizcocho de chocolate rellenos con mermelada, crema chantilly, chispas de chocolate y marrasquinos. La clásica Selva Negra, elegante y llena de sabor." },
    { nombre: "Torta chocolatosa", icono: "🍫", desc: "Bizcocho de brownie relleno con ganache de chocolate y cubierto en ganache. Para los amantes del chocolate intenso, sin límites." },
    { nombre: "Torta amor (hojarasca)", icono: "💛", desc: "Capas de hojarasca crocante rellenas con manjar, crema pastelera, mermelada y frambuesas naturales con crema. Nuestra torta del amor en versión crujiente y delicada." },
    { nombre: "Torta Celestial", icono: "✨", desc: "Bizcocho de chocolate y de vainilla, alternados con discos de merengue y hojarasca, rellenos de mermelada, manjar, crema pastelera y frambuesas con crema. Una combinación única de texturas, para algo realmente especial." },
    { nombre: "Torta Panqueque de Naranja", icono: "🍊", desc: "Capas de panqueque relleno de manjar y un suave toque de naranja. Fresca, aromática y distinta a las demás." },
    { nombre: "Torta Panqueque de Chocolate", icono: "🍫", desc: "Capas de panqueque de chocolate rellenas de manjar. Para quienes quieren el sabor de siempre en un formato distinto." },
    { nombre: "Torta Panqueque de Nuez", icono: "🌰", desc: "Capas de panqueque relleno de manjar y nueces, con esa textura crocante que las hace tan ricas." },
  ];

  const saboresGrid = document.getElementById("saboresGrid");
  sabores.forEach((sabor) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "sabor-card";
    card.innerHTML = `
      <span class="sabor-card__icon">${sabor.icono}</span>
      <span class="sabor-card__nombre">${sabor.nombre}</span>
    `;
    card.addEventListener("click", () => abrirSaborModal(sabor));
    saboresGrid.appendChild(card);
  });

  const saborModal = document.getElementById("saborModal");
  const saborOverlay = document.getElementById("saborOverlay");
  const saborClose = document.getElementById("saborClose");
  const saborIcono = document.getElementById("saborIcono");
  const saborTitle = document.getElementById("saborTitle");
  const saborDescripcion = document.getElementById("saborDescripcion");
  const saborCotizar = document.getElementById("saborCotizar");

  function abrirSaborModal(sabor) {
    saborIcono.textContent = sabor.icono;
    saborTitle.textContent = sabor.nombre;
    saborDescripcion.textContent = sabor.desc;

    // Si el nombre calza con una opción del selector de tortas, la deja
    // pre-seleccionada para cuando la persona vaya a cotizar.
    const selectTorta = document.getElementById("torta");
    if (selectTorta) {
      const coincide = Array.from(selectTorta.options).some(
        (op) => op.value === sabor.nombre
      );
      if (coincide) selectTorta.value = sabor.nombre;
    }

    saborModal.classList.add("is-open");
    saborModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
  }
  function cerrarSaborModal() {
    saborModal.classList.remove("is-open");
    saborModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  }
  saborOverlay.addEventListener("click", cerrarSaborModal);
  saborClose.addEventListener("click", cerrarSaborModal);
  saborCotizar.addEventListener("click", cerrarSaborModal);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") cerrarSaborModal();
  });

  // ---- Documentos legales (Política de Privacidad, Términos, Aviso Legal) ----
  // NOTA: esto es un borrador orientado a lo que el sitio realmente hace,
  // no es asesoría legal certificada. Antes de diciembre de 2026 (entrada
  // en vigencia de la Ley 21.719 de Protección de Datos) conviene que un
  // abogado lo revise. Actualiza el nombre/RUT cuando formalices el negocio.
  const legalDocs = {
    privacidad: {
      titulo: "Política de Privacidad",
      html: `
        <h3>¿Qué datos recolectamos?</h3>
        <p>Cuando completas el formulario de cotización, guardamos: nombre, apellido, teléfono, dirección y población (si los ingresas), tipo de evento, fecha, hora de entrega o retiro, cantidad de personas, tipo de torta y el mensaje que escribas.</p>
        <h3>¿Para qué los usamos?</h3>
        <p>Únicamente para procesar tu solicitud de cotización y contactarte por WhatsApp o correo para coordinar tu pedido. No usamos tus datos para fines distintos a este.</p>
        <h3>¿Dónde se guardan?</h3>
        <p>En una base de datos propia, alojada en nuestro proveedor de hosting en Chile. Además, el formulario envía una copia a <strong>Formspree</strong>, un servicio externo que nos reenvía la solicitud por correo — ellos procesan esos datos según su propia política de privacidad.</p>
        <h3>Servicios de terceros integrados en el sitio</h3>
        <p>Esta página utiliza <strong>Google Maps</strong> (para mostrar nuestra ubicación) y enlaces a <strong>Instagram</strong> y <strong>WhatsApp</strong>. Estos servicios pueden recolectar datos según sus propias políticas, ajenas a nosotros.</p>
        <h3>¿Compartimos tus datos?</h3>
        <p>No vendemos ni compartimos tus datos con terceros distintos a los mencionados arriba (Formspree, para el envío del correo).</p>
        <h3>Tus derechos</h3>
        <p>Puedes solicitar en cualquier momento acceder, corregir o eliminar tus datos, escribiéndonos por WhatsApp al +56 9 8407 2985.</p>
        <h3>Cambios a esta política</h3>
        <p>Podemos actualizar este documento en el futuro. Te recomendamos revisarlo de tanto en tanto.</p>
      `,
    },
    terminos: {
      titulo: "Términos y Condiciones",
      html: `
        <h3>Sobre este sitio</h3>
        <p>Este sitio es informativo y funciona como herramienta para solicitar cotizaciones. No es una tienda en línea: no se procesan pagos ni compras directamente aquí.</p>
        <h3>Sobre las cotizaciones</h3>
        <p>Enviar el formulario <strong>no confirma un pedido</strong> — es una solicitud. La confirmación final (precio, fecha, forma de pago y entrega) se coordina directamente contigo por WhatsApp.</p>
        <h3>Precios</h3>
        <p>Los precios mostrados son referenciales y pueden variar según personalización, decoración o disponibilidad. Están sujetos a cambio sin previo aviso.</p>
        <h3>Disponibilidad</h3>
        <p>La disponibilidad de fechas y tortas depende de nuestra capacidad de producción al momento de tu solicitud.</p>
        <h3>Uso del sitio</h3>
        <p>Te pedimos usar el formulario con datos reales y no enviar información falsa, spam, ni contenido ofensivo.</p>
        <h3>Propiedad del contenido</h3>
        <p>Las fotografías, logo, textos y diseño de este sitio son propiedad de Antojitos Dulces, salvo que se indique lo contrario. No está permitido reproducirlos sin autorización.</p>
        <h3>Responsabilidad</h3>
        <p>No nos hacemos responsables por atrasos o fallas causadas por terceros ajenos a nuestro control (problemas de conexión, servicios externos como Google Maps o Formspree, etc.).</p>
        <h3>Ley aplicable</h3>
        <p>Estos términos se rigen por las leyes de la República de Chile.</p>
      `,
    },
    aviso: {
      titulo: "Aviso Legal",
      html: `
        <h3>Identificación</h3>
        <p><strong>Antojitos Dulces</strong> es un emprendimiento de repostería y coctelería operado como persona natural (aún sin RUT de empresa formalizado — será debidamente actualizado al momento de formalizar la actividad económica).</p>
        <h3>Domicilio y contacto</h3>
        <p>Toqui Araucano #135, esquina Simón Carballo, Los Álamos, Chile.<br>
        WhatsApp: +56 9 8407 2985 — Instagram: @antojitos_dulces_la</p>
        <h3>Objeto del sitio</h3>
        <p>Informar sobre nuestros productos y servicios de repostería, y facilitar la solicitud de cotizaciones para eventos y celebraciones.</p>
        <h3>Propiedad intelectual</h3>
        <p>La marca "Antojitos Dulces", el logo, las fotografías y los textos de este sitio son propiedad de Antojitos Dulces, salvo indicación contraria.</p>
        <h3>Enlaces e integraciones externas</h3>
        <p>Este sitio incluye un mapa de Google Maps y enlaces a Instagram y WhatsApp — plataformas de terceros que no están bajo nuestro control y cuentan con sus propias políticas.</p>
        <h3>Legislación aplicable</h3>
        <p>Este aviso se rige por las leyes de la República de Chile.</p>
      `,
    },
  };

  const legalModal = document.getElementById("legalModal");
  const legalOverlay = document.getElementById("legalOverlay");
  const legalClose = document.getElementById("legalClose");
  const legalTitle = document.getElementById("legalTitle");
  const legalContenido = document.getElementById("legalContenido");

  function abrirLegalModal(docKey) {
    const doc = legalDocs[docKey];
    if (!doc) return;
    legalTitle.textContent = doc.titulo;
    legalContenido.innerHTML = doc.html;
    legalModal.classList.add("is-open");
    legalModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
  }
  function cerrarLegalModal() {
    legalModal.classList.remove("is-open");
    legalModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  }
  document.querySelectorAll(".bottombar__legal-link").forEach((btn) => {
    btn.addEventListener("click", () => abrirLegalModal(btn.dataset.doc));
  });
  legalOverlay.addEventListener("click", cerrarLegalModal);
  legalClose.addEventListener("click", cerrarLegalModal);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") cerrarLegalModal();
  });

  // ---- Modal de precios ----
  const preciosModal = document.getElementById("preciosModal");
  const preciosTrigger = document.getElementById("preciosTrigger");
  const preciosClose = document.getElementById("preciosClose");
  const preciosOverlay = document.getElementById("preciosOverlay");
  const preciosCotizar = document.getElementById("preciosCotizar");

  function abrirPreciosModal(e) {
    if (e) e.preventDefault();
    preciosModal.classList.add("is-open");
    preciosModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
  }
  function cerrarPreciosModal() {
    preciosModal.classList.remove("is-open");
    preciosModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  }
  preciosTrigger.addEventListener("click", abrirPreciosModal);
  document.getElementById("preciosTriggerMapa")?.addEventListener("click", abrirPreciosModal);
  preciosClose.addEventListener("click", cerrarPreciosModal);
  preciosOverlay.addEventListener("click", cerrarPreciosModal);
  preciosCotizar.addEventListener("click", cerrarPreciosModal);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") cerrarPreciosModal();
  });

  // ---- Envío del formulario de cotización ----
  const form = document.getElementById("cotizacionForm");
  const status = document.getElementById("formStatus");

  // URL de tu backend local para guardar cotizaciones (ver carpeta backend/).
  const BACKEND_URL = `${API_BASE}/api/cotizaciones`;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    status.textContent = "Enviando tu cotización...";

    const formData = new FormData(form);

    // Guardar en PostgreSQL (backend propio) — en paralelo, sin bloquear
    // el envío del correo. Si el backend no está corriendo, esto falla
    // en silencio y el formulario sigue funcionando igual por correo.
    const datos = Object.fromEntries(formData.entries());
    fetch(BACKEND_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    }).catch((err) => {
      console.warn(
        "No se pudo guardar en la base de datos local (¿está el backend corriendo?):",
        err
      );
    });

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        status.textContent =
          "¡Listo! Recibimos tu solicitud, te responderemos pronto 💛";
        form.reset();
      } else {
        status.textContent =
          "No pudimos enviar el formulario. Escríbenos por WhatsApp mientras lo revisamos.";
      }
    } catch (err) {
      status.textContent =
        "No pudimos enviar el formulario. Escríbenos por WhatsApp mientras lo revisamos.";
    }
  });
});
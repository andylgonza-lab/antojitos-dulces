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
  const dropdown = document.querySelector(".nav__dropdown");
  const dropdownToggle = dropdown.querySelector("a");
  dropdownToggle.addEventListener("click", (e) => {
    if (window.innerWidth <= 980) {
      e.preventDefault();
      dropdown.classList.toggle("is-open");
    }
  });

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
    "ig-1.png",
    "ig-2.png",
    "ig-3.png",
    "ig-4.png",
    "ig-5.png",
    "ig-6.png",
    "ig-7.png",
    "ig-8.png",
    "ig-9.png",
    "ig-10.png",
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
    { nombre: "Manjar Platano", icono: "🍌", desc: "Cuatro capas de bizcocho de vainilla rellenas con manjar casero, plátano natural y una suave crema de plátano. Un clásico dulce y reconfortante." },
    { nombre: "Manjar Mermelada", icono: "🍓", desc: "Cuatro capas de bizcocho de vainilla que combinan mermelada, una fina capa de crema y manjar casero. Dulce y con distintas texturas en cada bocado." },
    { nombre: "Manjar Crema", icono: "🍮", desc: "Cuatro capas de bizcocho de vainilla rellenas con manjar casero y crema chantilly. Simple, cremosa y siempre un acierto seguro." },
    { nombre: "Piña crema", icono: "🍍", desc: "Cuatro capas de bizcocho de vainilla con piña natural y crema chantilly. Fresca, liviana y perfecta para los días de calor." },
    { nombre: "Piña manjar", icono: "🍍", desc: "Cuatro capas de bizcocho de vainilla con piña, manjar casero y una fina capa de crema. El equilibrio justo entre lo ácido de la fruta y lo dulce del manjar." },
    { nombre: "Durazno Crema", icono: "🍑", desc: "Cuatro capas de bizcocho de vainilla con durazno y crema chantilly. Suave, frutal y delicada." },
    { nombre: "Durazno manjar", icono: "🍑", desc: "Cuatro capas de bizcocho de vainilla con durazno, manjar casero y una fina capa de crema. Dulce y jugosa, con el sabor del durazno en cada capa." },
    { nombre: "Torta lúcuma manjar", icono: "🟠", desc: "Cuatro capas de bizcocho de vainilla con manjar casero y crema de lúcuma. El sabor inconfundible de la lúcuma, en una torta cremosa y distinta." },
    { nombre: "Torta Frambuesa-crema", icono: "🍇", desc: "Cuatro capas de bizcocho de vainilla con frambuesas naturales y crema chantilly. Fresca y con ese toque ácido que la hace irresistible." },
    { nombre: "Torta Mocca", icono: "☕", desc: "Cuatro capas de bizcocho de vainilla con manjar casero y crema de mocca. Para quienes aman el café en cada bocado." },
    { nombre: "Torta Amor (bizcocho)", icono: "❤️", desc: "Cuatro capas de bizcocho de vainilla con manjar casero, crema pastelera, mermelada y frambuesas con crema. Nuestra torta más completa, pensada para ocasiones especiales." },
    { nombre: "Tres Leches", icono: "🥛", desc: "Cuatro capas de bizcocho de vainilla remojadas en tres leches, con relleno de manjar casero y crema pastelera. El clásico de siempre, jugoso hasta el último bocado." },
    { nombre: "Manjar Nuez", icono: "🌰", desc: "Cuatro capas de bizcocho de vainilla con nueces, manjar casero y crema. Dulce, con textura crocante y sabor intenso." },
    { nombre: "Selva Negra", icono: "🍒", desc: "Cuatro capas de bizcocho de chocolate con mermelada, crema chantilly, chispas de chocolate y marrasquinos. La clásica Selva Negra, elegante y llena de sabor." },
    { nombre: "Torta chocolatosa", icono: "🍫", desc: "Bizcocho de brownie relleno con ganache de chocolate y cubierto en ganache. Para los amantes del chocolate intenso, sin límites." },
    { nombre: "Torta amor (hojarasca)", icono: "💛", desc: "Capas de hojarasca crocante con manjar casero, crema pastelera, mermelada y frambuesas naturales con crema. Nuestra torta del amor en versión crujiente y delicada." },
    { nombre: "Torta Celestial", icono: "✨", desc: "Bizcocho de chocolate y de vainilla, alternados con discos de merengue y hojarasca, rellenos de mermelada, manjar casero, crema pastelera y frambuesas con crema. Una combinación única de texturas, para algo realmente especial." },
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
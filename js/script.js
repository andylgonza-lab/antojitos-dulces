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
  // const API_BASE = "http://localhost:3000";
   const API_BASE = "https://antojitos-dulces.onrender.com/";

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
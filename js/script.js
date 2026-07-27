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

  // ---- Placeholders de Instagram ----
  // Reemplaza este bloque por tus fotos reales (ver README.md)
  const instaGrid = document.getElementById("instaGrid");

  const fotos = [
    "ig-1.jpeg",
    "ig-2.jpeg",
    "ig-3.jpeg",
    "ig-4.jpeg",
    "ig-5.jpeg",
    "ig-6.png",
    "ig-7.jpeg",
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
  });
  instaNext.addEventListener("click", () => {
    instaGrid.scrollBy({ left: scrollAmount(), behavior: "smooth" });
  });

  // ---- Envío del formulario de cotización ----
  const form = document.getElementById("cotizacionForm");
  const status = document.getElementById("formStatus");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    status.textContent = "Enviando tu cotización...";

    const formData = new FormData(form);

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
function resolveClientLogo() {
  return "public/icons/client-logos/pozito-logo.png";
}

function getBrandHTML() {
  const clientLogo = resolveClientLogo();
  const clientPart = clientLogo
    ? `<span class="sidebar__collab-sep" aria-hidden="true">+</span>
       <img src="${clientLogo}" alt="Marca aliada" class="sidebar__collab-logo sidebar__collab-logo--client" />`
    : "";
  return `
    <div class="sidebar__brand-collab">
      <a href="#" class="sidebar__brand">
        <span class="logo logo--lg" aria-hidden="true">
          <svg class="logo__svg" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
            <path fill="currentColor" d="M156.7 256H16c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h142.2c15.9 0 30.8 10.9 33.4 26.6 3.3 20-12.1 37.4-31.6 37.4-14.1 0-26.1-9.2-30.4-21.9-2.1-6.3-8.6-10.1-15.2-10.1H81.6c-9.8 0-17.7 8.8-15.9 18.4 8.6 44.1 47.6 77.6 94.2 77.6 57.1 0 102.7-50.1 95.2-108.6C249 291 205.4 256 156.7 256zM16 224h336c59.7 0 106.8-54.8 93.8-116.7-7.6-36.2-36.9-65.5-73.1-73.1-55.4-11.6-105.1 24.9-114.9 75.5-1.9 9.6 6.1 18.3 15.8 18.3h32.8c6.7 0 13.1-3.8 15.2-10.1C325.9 105.2 337.9 96 352 96c19.4 0 34.9 17.4 31.6 37.4-2.6 15.7-17.4 26.6-33.4 26.6H16c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16zm384 32H243.7c19.3 16.6 33.2 38.8 39.8 64H400c26.5 0 48 21.5 48 48s-21.5 48-48 48c-17.9 0-33.3-9.9-41.6-24.4-2.9-5-8.7-7.6-14.5-7.6h-33.8c-10.9 0-19 10.8-15.3 21.1 17.8 50.6 70.5 84.8 129.4 72.3 41.2-8.7 75.1-41.6 84.7-82.7C526 321.5 470.5 256 400 256z" />
          </svg>
        </span>
        <span class="sidebar__name">FlowPass</span>
      </a>
      ${clientPart}
    </div>
  `;
}

function getNavHTML(activeKey) {
  const links = [
    { href: "index.html", icon: "users", label: "Usuarios", key: "index.html" },
    {
      href: "ingreso.html",
      icon: "key",
      label: "Check-in",
      key: "ingreso.html",
    },
    {
      href: "historial.html",
      icon: "history",
      label: "Historial",
      key: "historial.html",
    },
  ];
  const items = links
    .map(({ href, icon, label, key }) => {
      const isActive = key === activeKey;
      return `
        <a href="${href}" class="sidebar__link${
        isActive ? " sidebar__link--active" : ""
      }" ${isActive ? 'aria-current="page"' : ""}>
          <svg class="icon button__icon icon--sm" aria-hidden="true">
            <use href="/public/icons/sprites.svg#${icon}"></use>
          </svg>
          ${label}
        </a>`;
    })
    .join("\n");
  return `
    <nav class="sidebar__nav" aria-label="Menú principal">
      ${items}
    </nav>`;
}

function getFooterHTML() {
  return `
    <div class="sidebar__footer">
      <a href="logout.html" class="sidebar__link sidebar__link--logout">
        Salir
        <svg class="icon button__icon" aria-hidden="true">
          <use href="/public/icons/sprites.svg#logout"></use>
        </svg>
      </a>
    </div>`;
}

function detectActiveKey() {
  const file = (
    window.location.pathname.split("/").pop() || "index.html"
  ).toLowerCase();
  if (file === "" || file === "index" || file === "index.htm")
    return "index.html";
  return file;
}

function renderSidebarInto(aside) {
  const activeKey = detectActiveKey();
  const panelId = "sidebar-panel";
  aside.innerHTML = `
    <div class="sidebar__bar">
      ${getBrandHTML()}
      <button class="sidebar__toggle" aria-controls="${panelId}" aria-expanded="false" aria-label="Abrir menú">
        <svg class="icon button__icon" aria-hidden="true">
          <use href="/public/icons/sprites.svg#menu-left"></use>
        </svg>
      </button>
    </div>
    <div class="sidebar__container" id="${panelId}">
      <button class="sidebar__close" type="button" aria-label="Cerrar menú">✕</button>
      ${getNavHTML(activeKey)}
      ${getFooterHTML()}
    </div>
    <div class="sidebar__overlay" data-overlay hidden></div>
  `;

  // Interacciones (solo necesarias en tablet/móvil)
  const toggle = aside.querySelector(".sidebar__toggle");
  const overlay = aside.querySelector("[data-overlay]");
  const container = aside.querySelector(".sidebar__container");
  const closeBtn = aside.querySelector(".sidebar__close");

  // Cerrar al navegar (mejor UX en móvil)
  container.addEventListener("click", (e) => {
    const el = e.target;
    if (el.closest && el.closest("a")) {
      closeDrawer();
    }
  });

  function getFocusable() {
    return Array.from(
      container.querySelectorAll(
        'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    ).filter((el) => !el.hasAttribute("disabled"));
  }

  let lastFocused = null;

  function openDrawer() {
    lastFocused = document.activeElement;
    aside.classList.add("sidebar--open");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Cerrar menú");
    overlay && overlay.removeAttribute("hidden");
    document.body.classList.add("body--no-scroll");
    const focusables = getFocusable();
    if (focusables.length) focusables[0].focus();
    document.addEventListener("keydown", onKeyDown);
  }

  function closeDrawer() {
    aside.classList.remove("sidebar--open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Abrir menú");
    overlay && overlay.setAttribute("hidden", "");
    document.body.classList.remove("body--no-scroll");
    document.removeEventListener("keydown", onKeyDown);
    if (lastFocused && lastFocused.focus) {
      lastFocused.focus();
    } else {
      toggle.focus();
    }
  }

  function onKeyDown(e) {
    if (e.key === "Escape") {
      e.preventDefault();
      closeDrawer();
      return;
    }
    if (e.key === "Tab") {
      const focusables = getFocusable();
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  toggle.addEventListener("click", () => {
    const expanded = toggle.getAttribute("aria-expanded") === "true";
    if (expanded) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });
  overlay && overlay.addEventListener("click", closeDrawer);
  closeBtn && closeBtn.addEventListener("click", closeDrawer);
}

function mountSidebar() {
  const aside = document.querySelector("aside.sidebar");
  if (!aside) return;
  renderSidebarInto(aside);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", mountSidebar);
} else {
  mountSidebar();
}

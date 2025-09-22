let currentAbort = null;

let usersMenu = null;
let usersMenuTrigger = null;
let usersMenuRow = null;

function createUsersMenu() {
  const menu = document.createElement("div");
  menu.className = "users-menu";
  menu.setAttribute("role", "menu");
  menu.hidden = true;
  menu.innerHTML = `
    <button
      type="button"
      class="users-menu__item users-menu__item--danger"
      role="menuitem"
      data-action="delete"
    >
      <svg class="icon" aria-hidden="true">
        <use href="/public/icons/sprites.svg#trash"></use>
       </svg>
      Eliminar alumno
    </button>
  `;

  menu.addEventListener("click", (event) => {
    const item = event.target.closest("[data-action]");
    if (!item) return;
    event.preventDefault();
    handleUsersMenuAction(item.dataset.action);
  });

  document.body.append(menu);
  return menu;
}

function getUsersMenu() {
  if (!usersMenu) usersMenu = createUsersMenu();
  return usersMenu;
}

function hideUsersMenu() {
  if (!usersMenu || usersMenu.hidden) return;
  usersMenu.classList.remove("is-open");
  usersMenu.hidden = true;
  usersMenu.style.top = "";
  usersMenu.style.left = "";

  if (usersMenuTrigger) {
    usersMenuTrigger.setAttribute("aria-expanded", "false");
  }

  usersMenuTrigger = null;
  usersMenuRow = null;
}

function showUsersMenu(trigger) {
  const menu = getUsersMenu();
  if (usersMenuTrigger && usersMenuTrigger !== trigger) {
    usersMenuTrigger.setAttribute("aria-expanded", "false");
  }

  menu.hidden = false;
  menu.style.visibility = "hidden";
  menu.style.top = "0px";
  menu.style.left = "0px";

  const triggerRect = trigger.getBoundingClientRect();
  const menuRect = menu.getBoundingClientRect();
  const margin = 8;
  const top = triggerRect.bottom + window.scrollY + 4;
  let left = triggerRect.right + window.scrollX - menuRect.width;
  const maxLeft = window.scrollX + window.innerWidth - menuRect.width - margin;
  const minLeft = window.scrollX + margin;
  left = Math.min(Math.max(left, minLeft), maxLeft);

  menu.style.top = `${Math.max(top, window.scrollY + margin)}px`;
  menu.style.left = `${left}px`;
  menu.style.visibility = "";
  menu.classList.add("is-open");

  trigger.setAttribute("aria-expanded", "true");
  usersMenuTrigger = trigger;
  usersMenuRow = trigger.closest(".table__row");
}

function toggleUsersMenu(trigger) {
  const menu = getUsersMenu();
  if (!menu.hidden && trigger === usersMenuTrigger) {
    hideUsersMenu();
  } else {
    showUsersMenu(trigger);
  }
}

function handleUsersMenuDocumentClick(event) {
  if (event.target.closest("[data-users-menu-trigger]")) return;
  if (usersMenu && usersMenu.contains(event.target)) return;
  hideUsersMenu();
}

function handleUsersMenuKeydown(event) {
  if (event.key === "Escape") hideUsersMenu();
}

function initUsersMenu() {
  getUsersMenu();
  document.addEventListener("click", handleUsersMenuDocumentClick);
  document.addEventListener("keydown", handleUsersMenuKeydown);
  window.addEventListener("resize", hideUsersMenu);
  window.addEventListener("scroll", hideUsersMenu, true);
}

function handleUsersMenuAction(action) {
  if (action === "delete") {
    // TODO: agregar llamada real al backend usando usersMenuRow.dataset.userId.
  }
  hideUsersMenu();
}

/**
 * Carga usuarios desde el backend.
 * params: objeto de filtros. En tu backend actual usas:
 *   field1=Nombre, value1=<texto>
 */
function buildQueryParams(page) {
  const queryParams = {};
  if (page) {
    queryParams.page = page;
  }

  let index = 1;
  DASHBOARD_FILTERS.forEach((item) => {
    const input = $("#" + item.element_id).value;
    if (input && String(input).trim() !== "") {
      queryParams["field" + index] = item.key;
      queryParams["value" + index] = String(input).trim();
      index++;
    }
  });

  return queryParams;
}
async function loadUsers(page = 1) {
  if (page) {
    setPage(page);
  }

  renderLoading("usersTbody");

  // Cancela petición anterior si existe
  if (currentAbort) currentAbort.abort();
  currentAbort = new AbortController();

  try {
    // arma tus query params como tu backend espera:
    const queryParams = buildQueryParams(page);
    const url = buildUrl(ENV_VARS.url_get_users, queryParams);
    const res = await load_users(url, currentAbort);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();

    // Tu flujo actual devuelve algo como [{ total, data: [...] }]
    const items = Array.isArray(data) ? data : data?.data || [];
    if (!items.length) return renderEmpty("usersTbody");

    const { total, data: users } = items[0] || {};
    if (!Array.isArray(users) || users.length === 0) {
      renderPagination(0);
      return renderEmpty("usersTbody");
    }

    renderTableRows(users, "usersTbody", TABLE_COLUMNS);
    renderPagination(total);
    // Si quieres usar 'total' para paginación o mostrar un contador:
    // console.log("Total:", total);
  } catch (err) {
    if (err?.name === "AbortError") return; // petición cancelada: ignorar
    console.log(err);
    renderError("usersTbody");
    renderPagination(0);
  } finally {
    currentAbort = null;
  }
}

// =======================
// UI (Eventos)
// =======================

/** Botón “Nuevo usuario” abre el form en nueva pestaña */
function initAddNewUser() {
  const btn = $("#nuevoUsuario");
  if (!btn) return;
  btn.addEventListener("click", () => {
    window.open(ENV_VARS.url_form, "_self");
  });
}

/** Buscador con debounce. Enter busca inmediato. ESC limpia. */
function initSearch() {
  const input = $("#searchInput");
  if (!input) return;

  const run = debounce(() => loadUsers(), DEBOUNCE_MS);

  input.addEventListener("input", run);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      loadUsers();
    } else if (e.key === "Escape") {
      input.value = "";
      loadUsers();
    }
  });
}

// =======================
// Init
// =======================
document.addEventListener("DOMContentLoaded", () => {
  //LOAD DYNAMIC FIELDS
  renderHead(TABLE_COLUMNS, "usersThead");
  fillSelect("Plan", PLANES);
  fillSelect("Medio_de_pago", METODO_DE_PAGO);
  fillSelect("PaymentStatus", ESTADO_PAGO);
  fillSelect("FilterPlanSelect", PLANES);
  fillSelect("statusSelect", ESTADO_PLAN);

  initSearch();
  initAddNewUser();
  initUsersMenu();
  if (window.SessionManager) {
    loadUsers();
  } else {
    window.addEventListener("session-ready", () => loadUsers(), { once: true });
  }

  DASHBOARD_FILTERS.forEach((item) => {
    if (item.onChange)
      document
        .getElementById(item.element_id)
        .addEventListener("change", () => {
          loadUsers(); // tu función que vuelve a cargar con filtros
        });
  });

  /*
    document.getElementById("methodSelect").addEventListener("change", () => {
        const value = document.getElementById("methodSelect").value;
        console.log("Nuevo método:", value);
        loadUsers();
    });
*/

  const tbody = $("#usersTbody");
  tbody.addEventListener("click", (e) => {
    const menuTrigger = e.target.closest("[data-users-menu-trigger]");
    if (menuTrigger) {
      e.preventDefault();
      e.stopPropagation();
      toggleUsersMenu(menuTrigger);
      return;
    }

    const row = e.target.closest(".table__row");
    if (!row) return;
    const raw = row.dataset.user || "";
    const user = raw ? JSON.parse(decodeURIComponent(raw)) : null;
    if (user) openModal(user);
  });
});

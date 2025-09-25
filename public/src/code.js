let currentAbort = null;

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
    console.log(item);
    if (item.key == "sort"){
      queryParams.sort = input;
    }
    else if (input && String(input).trim() !== "") {
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

  fillSelect("Medio_de_pago", METODO_DE_PAGO);
  fillSelect("PaymentStatus", ESTADO_PAGO);

  fillSelect("statusSelect", ESTADO_PLAN);

  initSearch();
  initAddNewUser();
  initUsersMenu();
  initConfirmDeleteDialog();
  if (window.SessionManager) {
    loadUsers();


  } else {
    window.addEventListener("session-ready", () => {
      loadUsers();
    }, { once: true });
  }

  window.addEventListener("info_loaded", () => {
    fillSelect("Plan", PLANES);
    fillSelect("FilterPlanSelect", PLANES);
  }, { once: true });

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

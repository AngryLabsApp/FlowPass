
// =======================
// Config
// =======================
const DEBOUNCE_MS = 350;
const TABLE_COLSPAN = 14; // cantidad de columnas de tu tabla

// Espera que tengas estas variables definidas en algún lado
// const ENV_VARS = { url_form: "...", url_get_users: "..." };

// =======================
// Utils
// =======================


/** Debounce sencillo */
function debounce(fn, wait = 300) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}



/** Mapea estado a clase de badge (opcional) */
function statusBadgeClass(status) {
  const s = String(status || "").toLowerCase();
  if (["pagado","activo", "paid", "completo", "completed"].includes(s))
    return "badge--paid";
  if (["pendiente","pausado", "pendiente de pago", "pending"].includes(s))
    return "badge--pending";
  if (["vencido","inactivo", "overdue", "failed", "atrasado"].includes(s))
    return "badge--overdue";
  return "badge--method";
}

// =======================
// Render (Tabla)
// =======================

/** Renderiza una fila de usuario */
function renderUserRow(user) {
  const payload = encodeURIComponent(JSON.stringify(user));
  return `
    <tr class="table__row" role="button" tabindex="0" data-user="${payload}">
      <td class="table__cell table__col--first-name">${safe(user.Nombre)}</td>
      <td class="table__cell table__col--last-name">${safe(user.Apellidos)}</td>
      <td class="table__cell table__col--plan">${safe(user.Plan)}</td>
      <td class="table__cell table__col--classes">${safe(
        user.Clases_tomadas
      )}/${safe(user.Limite_clases)}</td>
      <td class="table__cell table__col--grace">${safe(
        user.Dias_de_Gracia
      )}</td>
      <td class="table__cell table__col--start">${formatDate(
        user.Fecha_Inicio_Plan
      )}</td>
      <td class="table__cell table__col--end">${formatDate(
        user.Proxima_Fecha_Pago
      )}</td>
      <td class="table__cell table__col--status">
        <span class="badge ${statusBadgeClass(user.Estado)}">${safe(
        user.Estado
        )}</span>
      </td>
       <td class="table__cell table__col--status">
        <span class="badge ${statusBadgeClass(user.Estado_Pago)}">${safe(
        user.Estado_Pago
        )}</span>
      </td>
    </tr>
  `;
}

/** Estados de tabla */
function renderLoading(tbody) {
  tbody.innerHTML = `<tr class="table__row"><td class="table__cell" colspan="${TABLE_COLSPAN}">Cargando...</td></tr>`;
}
function renderEmpty(tbody, msg = "Sin registros") {
  tbody.innerHTML = `<tr class="table__row"><td class="table__cell" colspan="${TABLE_COLSPAN}">${safe(
    msg
  )}</td></tr>`;
}
function renderError(
  tbody,
  msg = "Error al cargar datos. Intenta nuevamente."
) {
  tbody.innerHTML = `<tr class="table__row"><td class="table__cell" colspan="${TABLE_COLSPAN}">${safe(
    msg
  )}</td></tr>`;
}

// =======================
// Data (Fetch)
// =======================

let currentAbort = null;

/**
 * Carga usuarios desde el backend.
 * params: objeto de filtros. En tu backend actual usas:
 *   field1=Nombre, value1=<texto>
 */
function buildQueryParams(page) {
  const queryParams = {};

  const input = $("#searchInput").value;
  const status = $("#statusSelect").value;
  // const method = $("#methodSelect").value;

  if (page){
    queryParams.page = page
  }
  if (input && String(input).trim() !== "") {
    queryParams.field1 = "Nombre";
    queryParams.value1 = String(input).trim();
  }

  if (status && String(status).trim() !== "") {
    queryParams.field2 = "Estado"; // <-- puedes cambiar a "Email" si buscas por email
    queryParams.value2 = String(status).trim();
  }

  return queryParams;
}

async function loadUsers(page) {
    if (page){
        setPage(page);
    }
  const tbody = $("#usersTbody");
  if (!tbody) return;
  renderLoading(tbody);

  // Cancela petición anterior si existe
  if (currentAbort) currentAbort.abort();
  currentAbort = new AbortController();

  try {
    // arma tus query params como tu backend espera:
    const queryParams = buildQueryParams(page);
    const url = buildUrl(ENV_VARS.url_get_users, queryParams);
    const res = await fetch(url, {
      signal: currentAbort.signal,
      headers: { Accept: "application/json" },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();

    // Tu flujo actual devuelve algo como [{ total, data: [...] }]
    const items = Array.isArray(data) ? data : data?.data || [];
    if (!items.length) return renderEmpty(tbody);

    const { total, data: users } = items[0] || {};
    if (!Array.isArray(users) || users.length === 0) return renderEmpty(tbody);

    tbody.innerHTML = users.map(renderUserRow).join("");
    renderPagination(total);
    // Si quieres usar 'total' para paginación o mostrar un contador:
    // console.log("Total:", total);
  } catch (err) {
    if (err.name === "AbortError") return; // petición cancelada: ignorar
    console.error(err);
    renderError(tbody);
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
    window.open(ENV_VARS.url_form, "_blank");
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
  initSearch();
  initAddNewUser();
  loadUsers(); // carga inicial sin filtros

  document.getElementById("statusSelect").addEventListener("change", () => {
    loadUsers(); // tu función que vuelve a cargar con filtros
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
    const row = e.target.closest(".table__row");
    if (!row) return;
    const raw = row.dataset.user || "";
    const user = raw ? JSON.parse(decodeURIComponent(raw)) : null;
    if (user) openModal(user);
  });
});

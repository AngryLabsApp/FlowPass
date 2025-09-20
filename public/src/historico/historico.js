function open_historico_form() {
  const btn = document.getElementById("downloadHistory");
  if (!btn) return;
  btn.addEventListener("click", () => {
  window.open(ENV_VARS.url_form_historico, "_other");
  });
}
function setCurrentMonth() {
  const monthInput = document.getElementById('paymentsMonthFilter');
  if (!monthInput) return;
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const value = `${now.getFullYear()}-${month}`;
  monthInput.value = value;
}


function buildQueryParams(page) {
  const queryParams = {};

  const input = $("#paymentsSearch").value;
  const status = "";//$("#statusSelect").value;
  // const method = $("#methodSelect").value;

  if (page){
    queryParams.page = page
  }
  if (input && String(input).trim() !== "") {
    queryParams.field1 = "nombre";
    queryParams.value1 = String(input).trim();
  }

  if (status && String(status).trim() !== "") {
    queryParams.field2 = "estado"; // <-- puedes cambiar a "Email" si buscas por email
    queryParams.value2 = String(status).trim();
  }
  queryParams.start_date = "2025-09-01";
  
  queryParams.end_date = "2025-09-30";
  queryParams.type = "query";
  return queryParams;
}

let currentAbort = null;
async function getPagos(page = 1) {
    if (page){
        setPage(page);
    }
  
    renderLoading("paymentsTableBody");
    
    // Cancela petición anterior si existe
  if (currentAbort) currentAbort.abort();
  currentAbort = new AbortController();

  try {
    // arma tus query params como tu backend espera:
    const queryParams = buildQueryParams(page);
    const url = buildUrl(ENV_VARS.url_get_pagos, queryParams);
    const res = await get_pagos(url, currentAbort);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();


    // Tu flujo actual devuelve algo como [{ total, data: [...] }]
    const items = Array.isArray(data) ? data : data?.data || [];
    if (!items.length) return renderEmpty("paymentsTableBody");
   

       const { total, data: users } = items[0] || {};
    if (!Array.isArray(users) || users.length === 0) {
        renderPagination(0);
      return renderEmpty("paymentsTableBody");
    }

    renderTableRows(users,"paymentsTableBody",TABLE_PAYMENTS_COLUMNS);
    renderPagination(total);

  } catch (err) {
    if (err?.name === "AbortError") return; // petición cancelada: ignorar
    renderError("paymentsTableBody");
    renderPagination(0);
  } finally {
    currentAbort = null;
  }
}

document.addEventListener("DOMContentLoaded", () => {
    renderHead(TABLE_PAYMENTS_COLUMNS, "payments_table");


    open_historico_form();
    setCurrentMonth();

    if (window.SessionManager) {
      getPagos();
  } else {
    window.addEventListener("session-ready", () => getPagos(), { once: true });
  }


});
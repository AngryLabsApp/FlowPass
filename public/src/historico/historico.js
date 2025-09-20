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
  if (page){
    queryParams.page = page
  }

  let index = 1;
  DASHBOARD_PAGOS_FILTERS.forEach(item =>{
      const input = $("#"+item.element_id).value;
      if (item.key == "fechas"){
        queryParams.start_date = input;
        queryParams.end_date = input;
        index ++;
      } 
      else if (input && String(input).trim() !== "") {
        queryParams["field"+index] = item.key;
        queryParams["value"+index] = String(input).trim();
        index ++;
      }
  });
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
    console.log(err);
    if (err?.name === "AbortError") return; // petición cancelada: ignorar
    renderError("paymentsTableBody");
    renderPagination(0);
  } finally {
    currentAbort = null;
  }
}



function initSearch() {
  const input = $("#paymentsSearch");
  if (!input) return;

  const run = debounce(() => getPagos(), DEBOUNCE_MS);

  input.addEventListener("input", run);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      getPagos();
    } else if (e.key === "Escape") {
      input.value = "";
      getPagos();
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {

    renderHead(TABLE_PAYMENTS_COLUMNS, "payments_table");
    fillSelect("FilterEstadoPagoSelect", ESTADO_PAGO);

    initSearch();
    open_historico_form();
    setCurrentMonth();

    if (window.SessionManager) {
      getPagos();
    } else {
      window.addEventListener("session-ready", () => getPagos(), { once: true });
    }

  DASHBOARD_PAGOS_FILTERS.forEach(item =>{
    if (item.onChange)
      document.getElementById(item.element_id).addEventListener("change", () => {
        getPagos(); // tu función que vuelve a cargar con filtros
      });
  });


});
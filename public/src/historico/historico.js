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

async function getTotalMes() {
  try {
    const base_queryParams = buildQueryParams();
    const queryParams ={
      type: "total",
      start_date: base_queryParams.start_date,
      end_date: base_queryParams.end_date,
    };
    const url = buildUrl(ENV_VARS.url_get_pagos, queryParams);
    const res = await get_pagos(url, currentAbort);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    const items = Array.isArray(data) ? data : data?.data || [];
    const { total } = items[0] || {};

    const valueEl = document.getElementById('total_mensual_value');
    if (valueEl) {
      const sanitize = (input) => {
        if (typeof input === 'number') return input;
        if (typeof input === 'string') {
          const parsed = Number(input);
          if (Number.isFinite(parsed)) return parsed;
        }
        const cleaned = Number(String(input ?? '').replace(/[^0-9.-]+/g, ''));
        return Number.isFinite(cleaned) ? cleaned : null;
      };

      const numericTotal = sanitize(total);
      const amount = Number.isFinite(numericTotal) ? numericTotal : 0;
      const formatter = typeof window.formatCurrency === 'function'
        ? window.formatCurrency
        : null;

      if (formatter) {
        valueEl.textContent = formatter('PEN', amount);
      } else {
        valueEl.textContent = `S/. ${amount.toLocaleString('es-PE', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`;
      }
    }

    const periodEl = document.getElementById('total_mensual_period');
    if (periodEl) {
      const monthInput = document.getElementById('paymentsMonthFilter');
      const monthValue = monthInput?.value;
      if (monthValue) {
        const [year, month] = monthValue.split('-').map(Number);
        const referenceDate = new Date(year, (month || 1) - 1, 1);
        if (!Number.isNaN(referenceDate.getTime())) {
          const formatter = new Intl.DateTimeFormat('es-PE', {
            month: 'long',
            year: 'numeric',
          });
          let formatted = formatter.format(referenceDate);
          if (formatted.includes(' de ')) {
            const [monthName, yearText] = formatted.split(' de ');
            const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);
            formatted = `${capitalizedMonth} ${yearText}`;
          } else {
            formatted = formatted.charAt(0).toUpperCase() + formatted.slice(1);
          }
          periodEl.textContent = formatted;
        } else {
          periodEl.textContent = 'Mes actual';
        }
      } else {
        periodEl.textContent = 'Mes actual';
      }
    }
    
  } catch (err) {
    console.log(err);
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
      getTotalMes();
    } else {
      window.addEventListener("session-ready", () => {getPagos(); getTotalMes()}, { once: true });
    }

  DASHBOARD_PAGOS_FILTERS.forEach(item =>{
    if (item.onChange)
      document.getElementById(item.element_id).addEventListener("change", () => {
        getPagos();
        if (item.key == "fechas") getTotalMes();
      });
  });


});

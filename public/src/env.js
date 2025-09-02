const ENV_VARS = {
  url_form:
    "https://n8n.angrylabs.app/form/54f40a75-b183-4483-9c51-82d281c6b504",
  url_get_users:
    "https://n8n.angrylabs.app/webhook/9ecc1791-c157-4084-8de6-6924235d95cd",
  url_update:
    "https://n8n.angrylabs.app/webhook/afd7e9b5-36c7-40de-956c-c23631d804b1",
  url_ingreso:"https://n8n.angrylabs.app/webhook/b9a49ebc-c1cc-4551-bca6-21832295b34c"
};

const planToAmount = {
    '12 Sesiones Mensuales': 150,
    '16 Sesiones Mensuales': 180,
    '20 Sesiones Mensuales': 200,
    'Clase Libre': 15,
    'Clase Gratis': 0
};

/** Atajo de querySelector */
const $ = (sel, ctx = document) => ctx.querySelector(sel);


/** Construye URL con query params de forma segura */
function buildUrl(base, params = {}) {
  const url = new URL(base, location.origin);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && String(v).trim() !== "") {
      url.searchParams.set(k, v);
    }
  });
  return url.toString();
}

/** Formatea fecha a YYYY-MM-DD si es posible */
function formatDate(value) {
  if (!value) return "-";
  const raw = String(value);
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;
  const d = new Date(raw);
  if (isNaN(d)) return raw;
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

/** Escapa texto para evitar inyecciones si renderizas con innerHTML */
function safe(text) {
  const span = document.createElement("span");
  span.textContent = text ?? "";
  return span.innerHTML;
}


function setField(modalEl, field, value) {
  const el = modalEl.querySelector(`[data-field="${field}"]`);
  if (el) el.textContent = value ?? "—";
}
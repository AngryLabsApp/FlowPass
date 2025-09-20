function toTitleCase(str) {
  return str.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
}

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

/** Formatea fecha a DD-MM-YYYY si es posible (sin cambiar formato global existente) */
function formatDateDMY(value) {
  if (!value) return "-";
  const raw = String(value).trim();

  // Si viene en dd/mm/yyyy o dd-mm-yyyy, normaliza a dd-mm-yyyy
  const dmy = raw.match(/^([0-3]?\d)[\/-]([0-1]?\d)[\/-](\d{4})$/);
  if (dmy) {
    const d = dmy[1].padStart(2, '0');
    const m = dmy[2].padStart(2, '0');
    const y = dmy[3];
    return `${d}-${m}-${y}`;
  }

  // Si viene como yyyy-mm-dd (fecha pura), evita offsets de zona
  const ymd = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (ymd) {
    const y = ymd[1];
    const m = ymd[2];
    const d = ymd[3];
    return `${d}-${m}-${y}`;
  }

  // Intento genérico con Date (ISO u otros); si no se puede, devuelve el raw
  const dt = new Date(raw);
  if (isNaN(dt)) return raw;
  const d = String(dt.getDate()).padStart(2, '0');
  const m = String(dt.getMonth() + 1).padStart(2, '0');
  const y = String(dt.getFullYear());
  return `${d}-${m}-${y}`;
}

function parseFlexibleDate(value) {
  if (!value) return null;

  if (value instanceof Date && !isNaN(value)) {
    return value;
  }

  const raw = String(value).trim();
  if (!raw) return null;

  const ymd = raw.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (ymd) {
    const [, y, m, d] = ymd;
    const year = Number(y);
    const month = Number(m) - 1;
    const day = Number(d);
    const dt = new Date(year, month, day);
    if (!isNaN(dt)) return dt;
  }

  const dmy = raw.match(/^([0-3]?\d)[\/-]([0-1]?\d)[\/-](\d{4})$/);
  if (dmy) {
    const [, d, m, y] = dmy;
    const day = Number(d);
    const month = Number(m) - 1;
    const year = Number(y);
    const dt = new Date(year, month, day);
    if (!isNaN(dt)) return dt;
  }

  const timestamp = Date.parse(raw);
  if (!Number.isNaN(timestamp)) {
    const dt = new Date(timestamp);
    if (!isNaN(dt)) return dt;
  }

  return null;
}

function formatDateLongSpanish(value) {
  const date = parseFlexibleDate(value);
  if (!date) return null;

  try {
    return new Intl.DateTimeFormat("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  } catch (_) {
    return null;
  }
}

function formatMemberSince(value) {
  const formatted = formatDateLongSpanish(value);
  return formatted ? `Miembro desde: ${formatted}` : "Miembro desde: —";
}

function getUserInitials(nombre, apellidos) {
  const parts = [];
  if (typeof nombre === "string") parts.push(...nombre.trim().split(/\s+/));
  if (typeof apellidos === "string") parts.push(...apellidos.trim().split(/\s+/));
  const filtered = parts.filter(Boolean);

  if (filtered.length === 0) {
    return "?";
  }

  const first = filtered[0];
  const last = filtered.length > 1 ? filtered[filtered.length - 1] : filtered[0];

  const firstInitial = first.charAt(0);
  let secondInitial = "";

  if (filtered.length > 1) {
    secondInitial = last.charAt(0);
  } else {
    secondInitial = first.charAt(1) || "";
  }

  const initials = (firstInitial + secondInitial).toLocaleUpperCase("es-ES");
  return initials || firstInitial.toLocaleUpperCase("es-ES");
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

/** Mapea estado a clase de badge (opcional) */
function statusBadgeClass(status) {
  const s = String(status || "").toLowerCase();
  if (["pagado","activo", "paid", "completo", "completed"].includes(s))
    return "badge--paid";
  if (["pendiente", "pendiente de pago", "pending"].includes(s))
    return "badge--pending";
  if (["congelado", "frozen", "pausado"].includes(s))
    return "badge--frozen";
  if (["vencido","inactivo", "overdue", "failed", "atrasado"].includes(s))
    return "badge--overdue";
  return "badge--method";
}


function isMobile() {
  let check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};


const DEBOUNCE_MS = 350;
/** Debounce sencillo */
function debounce(fn, wait = 300) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}

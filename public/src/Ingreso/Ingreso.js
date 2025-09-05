let Is_Modal_Open = false;
let Is_Mobile = false;
/** Devuelve mensaje claro cuando la suscripción no está activa */
function buildNonActiveMsg(user) {
  const estado = String(user?.estado || "").trim();
  const estadoMostrar = estado || "desconocido";
  return `Tu suscripción está en estado ${estadoMostrar}. Por favor activa tu suscripción de nuevo.`;
}
function updateSubmitState() {
  const input = document.getElementById("checkinQuery");
  const submit =
    document.getElementById("checkinSubmit") ||
    document.querySelector('#checkinForm button[type="submit"]');
  if (!input || !submit) return;
  submit.disabled = input.value.trim().length < 4;
}
function applyCheckinUI({ ok, user, message }) {
  const statusEl = document.getElementById("checkinStatus");
  const resultsEl = document.getElementById("checkinResults");
  const selEl = document.getElementById("checkinSelected");
  const contentEl = document.querySelector(".content");

  if (!statusEl) return;

  // Limpia clases previas
  statusEl.classList.remove("checkin__status--ok", "checkin__status--err");

  if (ok) {
    // ✅ Éxito
    const fullName = [user?.Nombre, user?.Apellidos].filter(Boolean).join(" ");
    statusEl.textContent =
      message || `Ingreso registrado para ${fullName || "usuario"} ✅`;
    statusEl.classList.add("checkin__status--ok");

    // Limpia timers/estilos de mensaje previo
    if (statusEl) {
      window.clearTimeout(statusEl.__msgTimer);
      statusEl.style.removeProperty("opacity");
      statusEl.style.removeProperty("transition");
    }

    // Limpia cualquier estado de error visual en el contenedor
    const contentEl2 = document.querySelector(".content");
    if (contentEl2) {
      contentEl2.classList.remove("content--error");
      window.clearTimeout(contentEl2.__errTimer);
    }

    // Oculta lista de resultados
    resultsEl?.setAttribute("hidden", "");

    // (Opcional) Limpia selección y el form
    // Si quieres dejar seleccionado, comenta estas 2 líneas:
    if (selEl) {
      selEl.hidden = true;
      selEl.innerHTML = "";
    }
    document.getElementById("checkinForm")?.reset();
    if (!Is_Mobile) document.getElementById("checkinQuery")?.focus();
    updateSubmitState();
  } else {
    // ❌ Error
    statusEl.textContent =
      message || "No se pudo registrar el ingreso. Intenta de nuevo.";
    statusEl.classList.add("checkin__status--err");
    // Asegura estado visible (por si venía saliendo)
    statusEl.classList.remove("checkin__status--slide-out");

    // Mantén visible la selección y/o resultados para corregir/reintentar
    // (no escondemos nada aquí)
    // Si quieres volver a mostrar sugerencias:
    // resultsEl?.removeAttribute('hidden');

    // Marca el contenedor principal con estado de error y ligera animación
    if (contentEl) {
      contentEl.classList.add("content--error");
      // Remueve la marca después de una breve pausa (3s) para no quedarse rojo permanente
      window.clearTimeout(contentEl.__errTimer);
      contentEl.__errTimer = window.setTimeout(() => {
        contentEl.classList.remove("content--error");
      }, 5000);
    }

    // Oculta el mensaje de error automáticamente tras 3s con un deslizamiento suave
    window.clearTimeout(statusEl.__msgTimer);
    statusEl.__msgTimer = window.setTimeout(() => {
      statusEl.classList.add("checkin__status--slide-out");

      const cleanup = () => {
        statusEl.textContent = "";
        statusEl.classList.remove("checkin__status--err");
        statusEl.classList.remove("checkin__status--slide-out");
        statusEl.removeEventListener("transitionend", onEnd);
      };
      const onEnd = (ev) => {
        if (
          ev.target === statusEl &&
          (ev.propertyName === "transform" || ev.propertyName === "opacity")
        ) {
          cleanup();
        }
      };
      statusEl.addEventListener("transitionend", onEnd);
      // Fallback por si el evento no dispara
      window.clearTimeout(statusEl.__msgHideTimer);
      statusEl.__msgHideTimer = window.setTimeout(cleanup, 320);
    }, 4000);
  }
}

// Función que quieres ejecutar con el valor del input
async function handleCheckin(query) {
  console.log("Check-in con código:", query);
  // aquí haces lo que necesites

  if (query && (query.length < 4 || query.length > 6)) {
    applyCheckinUI({ ok: false, message: "El código no existe." });
    clean(true);
    return;
  }
  let user = null;
  try {
    showLoader("Registrando ingreso...");
    const queryParams = { code: query };
    const url = buildUrl(ENV_VARS.url_ingreso, queryParams);
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
    });
    console.log("Response!!!!", res);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    console.log("Data", data);

    const ok = !data.error;
    if (ok) {
      const u = data.user || {};
      const estado = String(u.estado || "")
        .trim()
        .toLowerCase();
      // Validación SIEMPRE: si no está activo, mostrar mensaje y no abrir modal
      if (u && estado && estado !== "activo") {
        const msg = buildNonActiveMsg(u);
        applyCheckinUI({ ok: false, message: msg });
        clean(true);
        hideLoader();
        return;
      }

      openModal(u);
      clean(); // ← limpia SOLO cuando fue éxito
    } else {
      user = data.user;
      throw new Error(data.reason);
    }
  } catch (error) {
    let error_message = error.message;
    let text = "El código no existe.";

    // Prioriza errores por estado cuando el backend responde error
    const estado = String(user?.estado || "")
      .trim()
      .toLowerCase();
    if (user && estado && estado !== "activo") {
      text = buildNonActiveMsg(user);
    } else {
      // Si el estado es activo (o desconocido), cae a razones específicas
      switch (error_message) {
        case "PLAN_VENCIDO":
          text = `El plan de ${user?.nombre || ""} ${
            user?.apellidos || ""
          } venció el ${formatDateDMY(user?.proxima_fecha_pago)}.`.trim();
          break;
        case "LIMITE_CLASES_SUPERADO":
          text = `Has usado todas tus clases disponibles (${user?.clases_tomadas} de ${user?.limite_clases}).`;
          break;
        default:
          // deja el mensaje por defecto si no matchea
          break;
      }
    }

    applyCheckinUI({ ok: false, message: text });
    clean(true);
  }
  hideLoader();
}

function clean(onlyForm) {
  const form = document.getElementById("checkinForm");
  const input = document.getElementById("checkinQuery");
  form.reset();
  if (!Is_Mobile) input.focus();
  updateSubmitState();

  if (!onlyForm) {
    const statusEl = document.getElementById("checkinStatus");
    const resultsEl = document.getElementById("checkinResults");
    const selEl = document.getElementById("checkinSelected");

    if (statusEl) statusEl.textContent = "";
    resultsEl?.setAttribute("hidden", ""); // esto sí puede usar ?. (no es asignación)
    if (selEl) {
      selEl.hidden = true;
      selEl.innerHTML = "";
    }
  }
}

// Wire minimal
function loadForm() {
  const form = document.getElementById("checkinForm");
  const input = document.getElementById("checkinQuery");
  const submit =
    document.getElementById("checkinSubmit") ||
    form?.querySelector('button[type="submit"]');

  if (!form || !input) return;

  // Estado inicial y escucha para habilitar/deshabilitar el submit
  updateSubmitState();
  input.addEventListener("input", updateSubmitState);

  // 1) Enter o click en el botón (porque es type="submit")
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const q = input.value.trim();
    if (!q) return; // opcional: no enviar vacío
    handleCheckin(q);
  });

  // 2) (Opcional) Enter directo en el input si el botón fuera type="button"
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (!Is_Modal_Open) {
        const q = input.value.trim();
        if (!q) return;
        handleCheckin(q);
      } else {
        closeModal();
        clean();
      }
    }

    if (e.key === "Escape") {
      e.preventDefault();
      clean();
    }
  });
}

// Teclado numérico: llena el input #checkinQuery
function initKeypad() {
  const keypad = document.querySelector(".checkin__keypad");
  const input = document.getElementById("checkinQuery");
  if (!keypad || !input) return;

  keypad.addEventListener("click", (e) => {
    const btn = e.target.closest(".checkin__key");
    if (!btn) return;
    const key = btn.dataset.key;

    if (key === "back") {
      input.value = input.value.slice(0, -1);
    } else if (key === "clear") {
      input.value = "";
    } else if (/^\d$/.test(key)) {
      input.value += key;
    }

    if (!Is_Mobile) input.focus();
    updateSubmitState();
  });
}

function closeModal() {
  const m = document.getElementById("userModal");
  if (!m) return;
  Is_Modal_Open = false;
  m.setAttribute("aria-hidden", "true");
}

function initModal() {
  const btn = document.getElementById("ok_modal");
  if (!btn) return;
  btn.addEventListener("click", () => {
    closeModal();
  });
  //BOTON X
  document.querySelectorAll("[data-close]").forEach((element) => {
    element.addEventListener("click", closeModal);
  });
}

function openModal(user) {
  const m = document.getElementById("userModal");
  if (!m) return;
  Is_Modal_Open = true;
  m.setAttribute("aria-hidden", "false");
  setField(m, "NumberOfClases", `${user.clases_tomadas}/${user.limite_clases}`);
  setField(m, "DateOfSubcription", formatDateDMY(user.fecha_inicio_plan));
  setField(m, "NextPaymentDay", formatDateDMY(user.proxima_fecha_pago));

  $("#userModalTitle").textContent = user.nombre + " " + user.apellidos;
}

document.addEventListener("DOMContentLoaded", () => {
  Is_Mobile = isMobile();
  loadForm();
  initModal();
  initKeypad();
});

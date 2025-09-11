let user_selected = null;

// UI helpers (visibles en global para reuso)
function setCheckInWarning(show, message = "") {
  const chip = document.getElementById("checkInStatusChip");
  const text = document.getElementById("checkInStatusChipText");
  if (!chip) return;
  if (text) text.textContent = show ? String(message) : "";
  chip.classList.toggle("hidden", !show);
}

function setCheckInButtonDisabled(disabled) {
  const btn = document.getElementById("btnCheckIn");
  if (btn) btn.disabled = !!disabled;
}

function openModal(user) {
  const m = $("#userModal");
  if (!m) return;

  // Resetear secciones visibles por defecto
  $("#btn-edit-clases").style.display = "";
  $("#btn-edit-status").style.display = "";
  $("#btn-edit-fecha_inicio_plan").style.display = "";
  $("#btn-edit-estado_pago").style.display = "";
  $("#userPartnerChipText").textContent = "";

  if (user?.is_plan_partner && !user?.is_plan_principal) {
    // Si es pareja, pero no el principal, ocultar solo botones de edición
    $("#btn-edit-clases").style.display = "none";
    $("#btn-edit-status").style.display = "none";
    $("#btn-edit-fecha_inicio_plan").style.display = "none";
    $("#btn-edit-estado_pago").style.display = "none";
  }

  m.setAttribute("aria-hidden", "false");
  setField(m, "UserID", user.id);
  setField(m, "UserCode", (user.codigo_ingreso || "").replace(/^c-/i, ""));
  setField(m, "UserName", user.nombre);
  setField(m, "UserLastName", user.apellidos);
  setField(m, "UserPhone", user.telefono);
  setField(m, "UserEmail", user.email);
  setField(m, "UserAddress", user.direccion);
  setField(m, "UserIdentificationNumber", user.identificacion);
  setField(m, "UserPlan", user.plan);
  setField(m, "UserIsOnTravel", user.de_viaje);
  setField(m, "PaymentAmount", user.monto); // ya viene formateado en tu tabla
  setField(m, "PaymentMethod", user.medio_de_pago);
  setField(m, "PlanStatus", user.estado);
  setField(m, "PaymentStatus", user.estado_pago);
  setField(m, "NumberOfClases", `${user.clases_tomadas}/${user.limite_clases}`);
  setField(m, "FreeDays", user.dias_de_gracia);
  setField(m, "DateOfSubcription", formatDateDMY(user.fecha_inicio_plan));
  setField(m, "NextPaymentDay", formatDateDMY(user.proxima_fecha_pago));
  setField(m, "UserBirthday", formatDateDMY(user.cumpleanos));
  setField(m, "UserNotificar", user.notificar || "No");
  setField(
    m,
    "UserPatologias",
    user?.patologias.length > 0 ? user.patologias : "-"
  );
  user_selected = user;

  $("#userModalTitle").textContent = `${user?.nombre || ""} ${
    user?.apellidos || ""
  }`.trim();
  $("#userPartnerChipText").textContent = "";

  if (user?.is_plan_partner && user.partner_nombre && user.partner_apellidos) {
    const rol = user.is_plan_principal ? "Principal" : "Secundario";
    $(
      "#userPartnerChipText"
    ).textContent = `Pareja (${rol}) de: ${user.partner_nombre} ${user.partner_apellidos}`;
  }

  // Actualiza estado del botón de Check-In y chip de límite
  try {
    const tomadas = Number(user.clases_tomadas) || 0;
    const limite = Number(user.limite_clases);
    const limiteValido = Number.isFinite(limite) && limite > 0; // aplica si hay límite positivo
    const atOrOver = limiteValido && tomadas >= limite; // alcanzó o superó el límite

    const estadoPlan = String(user.estado || "")
      .trim()
      .toLowerCase();
    const planActivo = estadoPlan === "activo";

    // El botón se deshabilita si el plan no está activo o ya no hay clases
    setCheckInButtonDisabled(!planActivo || atOrOver);

    // El chip amarillo SOLO se usa para el caso de límite de clases
    setCheckInWarning(
      atOrOver,
      atOrOver ? `Límite de clases alcanzado (${tomadas}/${limite})` : ""
    );
  } catch (_) {}
}

function closeModal() {
  const m = $("#userModal");
  if (!m) return;
  m.setAttribute("aria-hidden", "true");
  showUpdateForm(false);
  showSingleFormAside(false);
  setCheckInWarning(false);
}

function getUserSelected() {
  return user_selected;
}

// Actualiza el objeto seleccionado y refresca los campos del modal
function patchSelectedUser(patch = {}) {
  try {
    if (!user_selected || !patch) return;
    Object.assign(user_selected, patch);
    // Reaplicar datos al modal visible
    openModal(user_selected);
  } catch (_) {}
}

function showUpdateForm(show) {
  const updateForm = document.getElementById("updateForm");
  updateForm.hidden = !show;
}

function handleOnSelectPlanChange() {
  const planEl = document.getElementById("Plan");
  const montoEl = document.getElementById("Monto");

  planEl.addEventListener("change", () => {
    const plan = planEl.value;

    const plan_selected = PLANES.find((item) => item.value == plan);
    const amount = plan_selected.amount;

    if (typeof amount === "number") {
      montoEl.value = amount.toFixed(2);
      // Si es gratis, bloquea edición; si no, permite editar por si quieres ajustar
      montoEl.readOnly = !!plan_selected?.is_free;
    } else {
      montoEl.value = "";
      montoEl.readOnly = false;
    }
  });
}

function prefillUpdateForm() {
  try {
    const user = getUserSelected();
    if (!user) return;
    const setVal = (id, val) => {
      const el = document.getElementById(id);
      if (el && val != null) el.value = String(val);
      return el;
    };
    const planEl = setVal("Plan", user.plan);
    // Disparar change para sincronizar monto por plan
    if (planEl) planEl.dispatchEvent(new Event("change"));
    // Si backend trae monto, lo priorizamos
    setVal("Monto", user.monto);
    setVal("Dias_de_Gracia", user.dias_de_gracia);
    setVal("Medio_de_pago", user.medio_de_pago);
    setVal("PaymentStatus", user.estado_pago);
  } catch (_) {}
}

// =======================
// Init
// =======================
function initModal() {
  const btn = $("#btn-close");
  if (!btn) return;
  btn.addEventListener("click", () => {
    closeModal();
  });
}

// Agregar este código a tu archivo modal.js
document.addEventListener("DOMContentLoaded", () => {
  // Elementos del modal
  initModal();
  handleOnSelectPlanChange();

  const modal = document.getElementById("userModal");
  const btnToggleForm = document.getElementById("btnToggleForm");
  const btnCancelForm = document.getElementById("btnCancelForm");

  // Manejadores para cerrar el modal
  const closeUpdateForm = () => {
    modal.setAttribute("aria-hidden", "true");
    showUpdateForm(false);
    btnToggleForm.setAttribute("aria-expanded", "false");
  };

  // Cerrar con el botón X o click en overlay
  document.querySelectorAll("[data-close]").forEach((element) => {
    element.addEventListener("click", closeUpdateForm);
  });

  // Cerrar con la tecla Escape
  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      modal.getAttribute("aria-hidden") === "false"
    ) {
      // Si hay submodal abierto, ciérralo primero
      try {
        const sub = document.getElementById("userSubModal");
        if (
          sub &&
          sub.getAttribute("aria-hidden") === "false" &&
          window.__submodal
        ) {
          window.__submodal.closeSubModal();
          return;
        }
      } catch (_) {}
      closeModal();
    }
  });

  // Toggle del formulario
  btnToggleForm.addEventListener("click", () => {
    // En móvil: abrir submodal encima con el formulario
    try {
      if (window.__submodal && window.__submodal.isMobileViewport()) {
        window.__submodal.openPlanSubmodal();
        return;
      }
    } catch (_) {}
    // Desktop/tablet: panel lateral como antes
    showSingleFormAside(false);
    const updateForm = document.getElementById("updateForm");
    const isHidden = updateForm.hidden;
    showUpdateForm(isHidden);
    if (isHidden === true) {
      // Se acaba de mostrar
      prefillUpdateForm();
    }
  });

  // Cancelar actualización
  btnCancelForm.addEventListener("click", () => {
    showUpdateForm(false);
  });
});

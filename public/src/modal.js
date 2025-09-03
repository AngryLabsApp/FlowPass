let user_selected = null;

function openModal(user) {
  const m = $("#userModal");
  if (!m) return;

  m.setAttribute("aria-hidden", "false");
  setField(m, "UserID", user.ID);
  setField(m, "UserCode", (user.Codigo_ingreso || "").replace(/^c-/i, ""));
  setField(m, "UserName", user.Nombre);
  setField(m, "UserLastName", user.Apellidos);
  setField(m, "UserPhone", user.Telefono);
  setField(m, "UserEmail", user.Email);
  setField(m, "UserPlan", user.Plan);
  setField(m, "PaymentAmount", user.Monto); // ya viene formateado en tu tabla
  setField(m, "PaymentMethod", user.Medio_de_pago);
  setField(m, "PlanStatus", user.Estado);
  setField(m, "PaymentStatus", user.Estado_Pago);
  setField(m, "NumberOfClases", `${user.Clases_tomadas}/${user.Limite_clases}`);
  setField(m, "FreeDays", user.Dias_de_Gracia);
  setField(m, "DateOfSubcription", formatDate(user.Fecha_Alta));
  setField(m, "NextPaymentDay", formatDate(user.Proxima_Fecha_Pago));
  setField(m, "UserBirthday", formatDate(user.Cumpleaños));
  setField(m, "UserNotificar", user.Notificar || "No");
  setField(m, "UserPatologias", user?.Patologias.length > 0 ? user.Patologias : "-");
  user_selected = user;
  $("#userModalTitle").textContent = user.Nombre + " " + user.Apellidos;
}

function closeModal() {
  const m = $("#userModal");
  if (!m) return;
  m.setAttribute("aria-hidden", "true");
  showUpdateForm(false);
  showSingleFormAside(false);
}

function getUserSelected() {
  return user_selected;
}

function showUpdateForm(show) {
  const updateForm = document.getElementById("updateForm");
  updateForm.hidden = !show;
}

function handleOnSelectPlanChange() {
  const planEl = document.getElementById("Plan");
  const montoEl = document.getElementById("Monto");

  planEl.addEventListener("change", () => {
    const plan = planEl.value; // cuando no hay value en <option>, usa el texto
    const amount = planToAmount[plan];

    if (typeof amount === "number") {
      montoEl.value = amount.toFixed(2);
      // Si es gratis, bloquea edición; si no, permite editar por si quieres ajustar
      const esGratis = plan === "Clase Gratis";
      montoEl.readOnly = esGratis;
    } else {
      montoEl.value = "";
      montoEl.readOnly = false;
    }
  });
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
      closeModal();
    }
  });

  // Toggle del formulario
  btnToggleForm.addEventListener("click", () => {
    showSingleFormAside(false);
    const updateForm = document.getElementById("updateForm");
    const isHidden = updateForm.hidden;
    showUpdateForm(isHidden);
  });

  // Cancelar actualización
  btnCancelForm.addEventListener("click", () => {
      showUpdateForm(false);
  });
});

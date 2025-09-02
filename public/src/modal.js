let user_selected = null;



function openModal(user) {
  const m = $("#userModal");
  if (!m) return;


  m.setAttribute("aria-hidden", "false");
  setField(m, "UserID", user.ID);
  setField(m, "UserCode", (user.Codigo_ingreso || "").replace(/^c-/i, ''));
  setField(m, "UserName", user.Nombre);
  setField(m, "UserLastName", user.Apellidos);
  setField(m, "UserPhone", user.Telefono);
  setField(m, "UserEmail", user.Email);
  setField(m, "UserPlan", user.Plan);
  setField(m, "PaymentAmount", user.Monto); // ya viene formateado en tu tabla
  setField(m, "PaymentMethod", user.Medio_de_pago);
  setField(m, "PaymentStatus", user.Estado);
  setField(m, "NumberOfClases", `${user.Clases_tomadas}/${user.Limite_clases}`);
  setField(m, "FreeDays", user.Dias_de_Gracia);
  setField(m, "DateOfSubcription", formatDate(user.Fecha_Alta));
  setField(m, "NextPaymentDay", formatDate(user.Proxima_Fecha_Pago));
  setField(m, "UserBirthday", formatDate(user.Cumpleaños));
  user_selected = user;
  $("#userModalTitle").textContent = user.Nombre + " " + user.Apellidos;
}
function closeModal() {
  const m = $("#userModal");
  if (!m) return;
  m.setAttribute("aria-hidden", "true");
  showUpdateForm(false);
}
function initModal() {
  const btn = $("#btn-close");
  if (!btn) return;
  btn.addEventListener("click", () => {
    closeModal();
  });
}

function getUserSelected() {
  return user_selected;
}

function showUpdateForm(show) {
  const modal = document.getElementById("userModal");
  const body = modal.querySelector(".modal__body");
  const btnToggle = modal.querySelector("#btnToggleForm");
  body.classList.toggle("modal__body--form-open", !!show);
  btnToggle?.setAttribute("aria-expanded", show ? "true" : "false");
}

function openUpdateForm() {
  const modal = document.getElementById("userModal");
  if (!modal) return;

  const body = modal.querySelector(".modal__body");
  const btnToggle = modal.querySelector("#btnToggleForm");
  const btnCancel = modal.querySelector("#btnCancelForm");
  btnToggle?.addEventListener("click", () => {
    const isOpen = body.classList.contains("modal__body--form-open");
    showUpdateForm(!isOpen);
  });

  btnCancel?.addEventListener("click", () => showUpdateForm(false));
}



function handleOnSelectPlanChange(){
  const planEl = document.getElementById('Plan');
  const montoEl = document.getElementById('Monto');

  planEl.addEventListener('change', () => {
    const plan = planEl.value; // cuando no hay value en <option>, usa el texto
    const amount = planToAmount[plan];

    if (typeof amount === 'number') {
      montoEl.value = amount.toFixed(2);
      // Si es gratis, bloquea edición; si no, permite editar por si quieres ajustar
      const esGratis = plan === 'Clase Gratis';
      montoEl.readOnly = esGratis;
    } else {
      montoEl.value = '';
      montoEl.readOnly = false;
    }
  });
}


// =======================
// Init
// =======================

// Agregar este código a tu archivo modal.js
document.addEventListener("DOMContentLoaded", () => {
  // Elementos del modal
  initModal();
  openUpdateForm();
  handleOnSelectPlanChange();

  const modal = document.getElementById("userModal");
  const btnToggleForm = document.getElementById("btnToggleForm");
  const btnCancelForm = document.getElementById("btnCancelForm");
  const updateForm = document.getElementById("updateForm");

  // Manejadores para cerrar el modal
  const closeModal = () => {
    modal.setAttribute("aria-hidden", "true");
    // Resetear el estado del formulario al cerrar el modal
    updateForm.hidden = true;
    btnToggleForm.setAttribute("aria-expanded", "false");
  };

  // Cerrar con el botón X o click en overlay
  document.querySelectorAll("[data-close]").forEach((element) => {
    element.addEventListener("click", closeModal);
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
    const isHidden = updateForm.hidden;
    updateForm.hidden = !isHidden;
    btnToggleForm.setAttribute("aria-expanded", !isHidden);
  });

  // Cancelar actualización
  btnCancelForm.addEventListener("click", () => {
    updateForm.hidden = true;
    btnToggleForm.setAttribute("aria-expanded", "false");
  });
});

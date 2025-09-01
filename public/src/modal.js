
let user_selected = null;

function setField(modalEl, field, value) {
  const el = modalEl.querySelector(`[data-field="${field}"]`);
  if (el) el.textContent = value ?? '—';
}


function openModal(user) {
    const m =$("#userModal")
    if (!m) return;
    m.setAttribute('aria-hidden', 'false');
    setField(m, 'UserID',            user.ID);
    setField(m, 'UserName',          user.Nombre);
    setField(m, 'UserLastName',      user.Apellidos);
    setField(m, 'UserPhone',         user.Telefono);
    setField(m, 'UserEmail',         user.Email);
    setField(m, 'UserPlan',          user.Plan);
    setField(m, 'PaymentAmount',     user.Monto); // ya viene formateado en tu tabla
    setField(m, 'PaymentMethod',     user.Medio_de_pago);
    setField(m, 'PaymentStatus',     user.Estado);
    setField(m, 'NumberOfClases',    user.Clases_tomadas);
    setField(m, 'FreeDays',          user.Dias_de_Gracia);
    setField(m, 'DateOfSubcription', formatDate(user.Fecha_Alta));
    setField(m, 'NextPaymentDay',    formatDate(user.Proxima_Fecha_Pago));
    setField(m, 'UserBirthday',      formatDate(user.Cumpleaños));
    user_selected = user;
}
function closeModal(){
    const m =$("#userModal")
    if (!m) return;
    m.setAttribute('aria-hidden', 'true');
    showUpdateForm(false)
}
function initModal() {
  const btn = $("#btn-close");
  if (!btn) return;
  btn.addEventListener("click", () => {
        closeModal();
  });
}

function getUserSelected(){
    return user_selected;
}


function showUpdateForm(show) {
    const modal = document.getElementById('userModal');
    const body = modal.querySelector('.modal__body');
    const btnToggle = modal.querySelector('#btnToggleForm');
    body.classList.toggle('modal__body--form-open', !!show);
    btnToggle?.setAttribute('aria-expanded', show ? 'true' : 'false');
}

function openUpdateForm(){
   const modal = document.getElementById('userModal');
  if (!modal) return;

  const body = modal.querySelector('.modal__body');
  const btnToggle = modal.querySelector('#btnToggleForm');
  const btnCancel = modal.querySelector('#btnCancelForm');
  btnToggle?.addEventListener('click', () => {
    const isOpen = body.classList.contains('modal__body--form-open');
    showUpdateForm(!isOpen);
  });

  btnCancel?.addEventListener('click', () => showUpdateForm(false));
}

// =======================
// Init
// =======================
document.addEventListener("DOMContentLoaded", () => {
    initModal();
    openUpdateForm();
});



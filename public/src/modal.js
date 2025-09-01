
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
// =======================
// Init
// =======================
document.addEventListener("DOMContentLoaded", () => {
    initModal();
});



function update_form_submit () {
  const form = document.getElementById('updateUserForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
     showLoader('Actualizando los datos...');
    e.preventDefault();
    const formEl = e.currentTarget;

    const submitBtn = form.querySelector('[type="submit"]');
    submitBtn.disabled = true;

    let success = false;

    // Tomamos el ID de la ficha visible en el modal
 
    user = getUserSelected();
    // Leemos campos del form
    const payload = {
        id: user.id,
        dias_de_gracia: {value:document.getElementById('Dias_de_Gracia')?.value || 0},
        monto: {value:document.getElementById('Monto').value || 0},
        medio_de_pago: {value:document.getElementById('Medio_de_pago').value},
        estado_pago: {value:document.getElementById('PaymentStatus').value},
    };
    if ( document.getElementById('Plan').value)
        payload.plan = {value:document.getElementById('Plan').value};
    if ( document.getElementById('partner-code').value)//AGREGAR VALIDACIONES
        payload.partner_code = {value: document.getElementById('partner-code').value};

    try {
      const res = await update_users(payload);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      formEl.reset();
      success = true;
    } catch (err) {
      console.error(err);
      showToast("Hubo un problema al actualizar. Reintenta en unos segundos.");
      hideLoader();
    } finally {
        submitBtn.disabled = false;
        loadUsers();
        hideLoader();
        // Ocultar panel lateral (si existe) y mantener el modal abierto
        const aside = document.getElementById('updateForm');
        if (aside) aside.hidden = true;

        // Actualizar modal principal con los nuevos valores
        try {
          const patch = {
            dias_de_gracia: document.getElementById('Dias_de_Gracia').value || 0,
            monto: document.getElementById('Monto').value || 0,
            medio_de_pago: document.getElementById('Medio_de_pago').value || '',
            estado_pago: document.getElementById('PaymentStatus').value || '',
          };
          const planVal = document.getElementById('Plan').value;
          if (planVal) patch.plan = planVal;
          if (typeof patchSelectedUser === 'function') patchSelectedUser(patch);
        } catch (_) {}

        // Forzar recarga total en éxito
        if (success) {
          try { location.reload(); } catch (_) {}
        }
    }
  });
}

function planOnChange(sub_id = "", execute = false){
  console.log("entro", sub_id);
  const selectEl = document.getElementById(sub_id + "Plan");
  if (execute){
    execute_validation(selectEl.value);
  }

  function execute_validation(value){
    const partnerRow = document.getElementById(sub_id + "partner-row");
    const partnerInput = document.getElementById(sub_id + "partner-code");
    const plan_selected = PLANES.find(item => item.value == value);

    if (plan_selected && plan_selected?.partners){
      partnerRow.style.display = "block";
      partnerInput.required = true;
    } else{
      partnerRow.style.display = "none";
      partnerInput.required = false; // deja de ser obligatorio
      partnerInput.value = "";
    }   
  }
  selectEl.addEventListener("change", function () {
    execute_validation(this.value);
  });
}

// =======================
// Init
// =======================
document.addEventListener("DOMContentLoaded", () => {
    update_form_submit();
    planOnChange();
});

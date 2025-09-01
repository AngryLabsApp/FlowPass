function update_form_submit () {
  const form = document.getElementById('updateUserForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
     showLoader('Actualizando los datos...');
    e.preventDefault();
    const formEl = e.currentTarget;

    const submitBtn = form.querySelector('[type="submit"]');
    submitBtn.disabled = true;

    // Tomamos el ID de la ficha visible en el modal
 
    user = getUserSelected();
    // Leemos campos del form
    const payload = {
        ID: user.ID,
        Plan:{ value: document.getElementById('Plan').value},
        Dias_de_Gracia: {value:document.getElementById('Dias_de_Gracia').value || 0},
        Monto: {value:document.getElementById('Monto').value || 0},
        Medio_de_pago: {value:document.getElementById('Medio_de_pago').value},
        Estado: {value:document.getElementById('Estado').value},
    };

    try {
      const res = await fetch(ENV_VARS.url_update, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      formEl.reset();
    } catch (err) {
      console.error(err);
    } finally {
        submitBtn.disabled = false;
        loadUsers();
        hideLoader();
        closeModal();
    }
  });
}

// =======================
// Init
// =======================
document.addEventListener("DOMContentLoaded", () => {
    update_form_submit();
});


let FIELD_SELECTED = null;
function showSingleFormAside(show){
    const editForm = document.getElementById("edit-single-form-aside");
    editForm.hidden = !show;
}
function setFormRows(formId, rowsHTML) {
  const form = document.getElementById(formId);
  if (!form) return;

  // 1. Eliminar todos los .form__row existentes
  form.querySelectorAll(".form__row").forEach(el => el.remove());

  // 2. Buscar el bloque de acciones (para insertar antes de él)
  const actions = form.querySelector(".form__actions");

  // 3. Insertar los nuevos rows
  if (actions) {
    actions.insertAdjacentHTML("beforebegin", rowsHTML);
  } else {
    form.insertAdjacentHTML("beforeend", rowsHTML);
  }
}
function buildEditFormByField(field){
    const btnEdit = document.getElementById("btn-edit-"+ field);
    const form_id = "edit-single-form";

    btnEdit.addEventListener("click", () => {
        // En móvil: abrir submodal encima
        try {
          if (window.__submodal && window.__submodal.isMobileViewport()) {
            window.__submodal.openSingleFieldSubmodal(field);
            return;
          }
        } catch (_) {}
        // Desktop/tablet: panel lateral como antes
        showUpdateForm(false);
        FIELD_SELECTED = field;
        setFormRows(form_id, FIELD_VALUES[FIELD_SELECTED].html);
        const title = document.getElementById("edit-single-form-title");
        if (title) {
          title.textContent = FIELD_VALUES[FIELD_SELECTED].title;
        }
        showSingleFormAside(true);
        // Prefill valores actuales del usuario para el aside (desktop/tablet)
        try {
          const user = getUserSelected();
          console.log(FIELD_SELECTED);
          const meta = FIELD_VALUES[FIELD_SELECTED];
          if (user && meta) {
            const setVal = (id, val) => { const el = document.getElementById(id); if (el && val != null) el.value = String(val); };
            switch (FIELD_SELECTED) {
              case 'phone': setVal(meta.id, user.telefono); break;
              case 'email': setVal(meta.id, user.email); break;
              case 'notify': setVal(meta.id, user.notificar); break;
              case 'patologias': setVal(meta.id, (user.patologias || '').toString()); break;
              case 'status': setVal(meta.id, user.estado); setVal(meta.id2, user.dias_extra); break;
              case 'clases': setVal(meta.id, user.clases_tomadas); if (meta.id2) setVal(meta.id2, user.limite_clases); break;
              case 'viaje': setVal(meta.id, user.de_viaje); break;
              case 'direccion': setVal(meta.id, user.direccion); break;
              case 'estado_pago': setVal(meta.id, user.estado_pago); break;
            }
          }
        } catch (_) {}

        // Rellenar selects dinámicos (por ejemplo, estado del plan)
        try { if (typeof fillDynamicGeneratedSelect === 'function') fillDynamicGeneratedSelect(); } catch (_) {}
    });
}
document.addEventListener("DOMContentLoaded", () => {
  const btnCancelForm = document.getElementById("btnCancelForm-single");


  // Cancelar actualización
  btnCancelForm.addEventListener("click", () => {
    showSingleFormAside(false);
  });

  EDITABLE_FIELD.forEach( (field) =>{
    buildEditFormByField(field);
  });

    update_single_form_submit();
});



function update_single_form_submit () {
    const form_id = "edit-single-form";
    const form = document.getElementById(form_id);
    if (!form) return;

  form.addEventListener('submit', async (e) => {
    
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
        type: "SINGLE",
        [FIELD_VALUES[FIELD_SELECTED].sheet_name]: {value:document.getElementById( FIELD_VALUES[FIELD_SELECTED].id).value},
    };
    let valid = false;
    const value = document.getElementById( FIELD_VALUES[FIELD_SELECTED].id).value
    if (value){
      valid = true;
      payload[FIELD_VALUES[FIELD_SELECTED].sheet_name] = {value};
    }

    if (FIELD_VALUES[FIELD_SELECTED].id2){
      const value2 = document.getElementById(FIELD_VALUES[FIELD_SELECTED].id2).value;
      if (value2){
        valid = true;
        payload[FIELD_VALUES[FIELD_SELECTED].sheet_name2] = {value: value2};
      }
    }
    if (!valid){
      submitBtn.disabled = false;
      return;
    }

    showLoader('Actualizando los datos...');

    try {
     
      const res = await update_users(payload);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      formEl.reset();
      success = true;
    } catch (err) {
      hideLoader();
      console.error(err);
      showToast("Hubo un problema al actualizar. Reintenta en unos segundos.");
    } finally {
        submitBtn.disabled = false;
        loadUsers();
        hideLoader();
        // Ocultar panel lateral de edición de un solo campo
        const aside = document.getElementById('edit-single-form-aside');
        if (aside) aside.hidden = true;

        // Actualizar datos en el modal principal
        try {
          const meta = FIELD_VALUES[FIELD_SELECTED];
          const patch = {};
          const v1 = document.getElementById(meta.id)?.value;
          if (v1) patch[meta.sheet_name] = v1;
          if (meta.id2) {
            const v2 = document.getElementById(meta.id2)?.value;
            if (v2) patch[meta.sheet_name2] = v2;
          }

          // Campos compuestos o alias
          if (FIELD_SELECTED === 'clases') {
            // Nothing extra: clases_tomadas y limite_clases ya fueron seteados
          }

          if (typeof patchSelectedUser === 'function') patchSelectedUser(patch);
        } catch (_) {}

        // Forzar recarga total en éxito
        if (success) {
          try { location.reload(); } catch (_) {}
        }
    }

  });
}


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
        showUpdateForm(false);
        FIELD_SELECTED = field;
        setFormRows(form_id, FIELD_VALUES[FIELD_SELECTED].html);
        const title = document.getElementById("edit-single-form-title");
        if (title) {
          title.textContent = FIELD_VALUES[FIELD_SELECTED].title;
        }

        showSingleFormAside(true);




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
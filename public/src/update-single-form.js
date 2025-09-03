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
        setFormRows(form_id, FIELD_VALUES[field].html);
        const title = document.getElementById("edit-single-form-title");
        if (title) {
        title.textContent = FIELD_VALUES[field].title;
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
});
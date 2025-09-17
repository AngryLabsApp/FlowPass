

function update_viaje_form(){
  return `
         <div class="form__row">
              <label class="form__label" for="viaje"> </label>
              <select class="form__control" id="edit-viaje" name="edit-viaje" required>
                <option value="">Selecciona…</option>
                <option>Si</option>
                <option>No</option>
              </select>
            </div>
        `;
}
function update_notify_form(){
  return `
         <div class="form__row">
              <label class="form__label" for="Estado"> </label>
              <select class="form__control" id="edit-notify" name="edit-notify" required>
                <option value="">Selecciona…</option>
                <option>Si</option>
                <option>No</option>
              </select>
            </div>
        `;
}

function update_status_form(){
  return `
         <div class="form__row">
              <label class="form__label" for="Estado"> </label>
              <select class="form__control" id="edit-status" name="edit-status" required>
                <option value="">Selecciona…</option>
              </select>
            </div>
            <div class="form__row">
              <label class="form__label" for="dias_extra">Agregar días extra</label>
              <input class="form__control" id="dias_extra" name="clases-limite" type="number" step="1" min="0" />
            </div>
        `;
}
function update_estado_pago(){
  return `
         <div class="form__row">
              <label class="form__label" for="Estado"> </label>
              <select class="form__control" id="edit-estado_pago" name="edit-estado_pago" required>
                <option value="">Selecciona…</option>
              </select>
            </div>
        `;
}
function update_fecha_inicio_plan(){
  return `
         <div class="form__row">
          <label class="form__label" for="fecha-inicio">Fecha inicio</label>
          <input class="form__control" id="edit-fecha_inicio_plan" name="fecha-inicio" type="date" />
        </div>
        `;
}

function update_fecha_cumpleanos(){
  return `
         <div class="form__row">
          <label class="form__label" for="fecha-cumpleanos"></label>
          <input class="form__control" id="edit-cumpleanos" name="fecha-cumpleanos" type="date" />
        </div>
        `;
}

function update_phone_form(){
  return `
        <div class="form__row">
          <label class="form__phone" for="edit-phone"> </label>
          <input 
            class="form__control" 
            id="edit-phone" 
            name="edit-phone" 
            type="text" 
            required 
            placeholder="Escribe el telefono..." />
        </div>
        `;
}

function update_direccion_form(){
  return `
        <div class="form__row">
          <label class="form__label" for="edit-direccion"> </label>
          <input 
            class="form__control" 
            id="edit-direccion" 
            name="edit-direccion" 
            type="text" 
            required 
            placeholder="" />
        </div>
        `;
}

function update_identificacion_form(){
  return `
        <div class="form__row">
          <label class="form__label" for="edit-identificacion"> </label>
          <input 
            class="form__control" 
            id="edit-identificacion" 
            name="edit-identificacion" 
            type="text" 
            required 
            placeholder="" />
        </div>
        `;
}

function update_patologia_form(){
  return `
       <div class="form__row">
          <label class="form__label" for="Notes"> </label>
          <textarea
            class="form__control"
            id="edit-patologia"
            name="edit-patologia"
            rows="4"
            placeholder="Escribe tus notas aquí..."
            required
          ></textarea>
        </div>
        `;
}
function update_email_form(){
  return `
        <div class="form__row">
          <label class="form__label" for="Email"> </label>
          <input 
            class="form__control" 
            id="edit-email" 
            name="edit-email" 
            type="email" 
            required 
            placeholder="Escribe tu correo..." />
        </div>
        `;
}
function update_clases_form(){
  return `
            <div class="form__row">
              <label class="form__label" for="clases">Clases realizadas</label>
              <input class="form__control" id="clases" name="clases" type="number" step="1" min="0"  />
            </div>
             <div class="form__row">
              <label class="form__label" for="clases-limite">Limite de clases</label>
              <input class="form__control" id="clases-limite" name="clases-limite" type="number" step="1" min="0" />
            </div>
        `;
}

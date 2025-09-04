const ENV_VARS = {
  url_form:
    "https://n8n.angrylabs.app/form/54f40a75-b183-4483-9c51-82d281c6b504",
  url_get_users:
    "https://n8n.angrylabs.app/webhook/9ecc1791-c157-4084-8de6-6924235d95cd",
  url_update:
    "https://n8n.angrylabs.app/webhook/afd7e9b5-36c7-40de-956c-c23631d804b1",
  url_ingreso:"https://n8n.angrylabs.app/webhook/b9a49ebc-c1cc-4551-bca6-21832295b34c"
};

const planToAmount = {
    '12 Sesiones Mensuales': 150,
    '16 Sesiones Mensuales': 180,
    '20 Sesiones Mensuales': 200,
    'Clase Libre': 15,
    'Clase Gratis': 0,
    '12 Sesiones Personalizadas': 0,
    '16 Sesiones Personalizadas': 0,
    '20 Sesiones Personalizadas': 0,
};

const EDITABLE_FIELD = ["phone","email","notify","patologias","status","clases"];
const FIELD_VALUES ={
  "clases":{
    title:"Clases",
    html:update_clases_form(),
    id:"clases",
    id2:"clases-limite",
    sheet_name:"clases_tomadas",
    sheet_name2:"limite_clases"
  },
  "phone":{
    title: "Teléfono",
    html:update_phone_form(),
    id:"edit-phone",
    sheet_name:"telefono"
  },
  "email":{
    title: "E-mail",
    html:update_email_form(),
    id:"edit-email",
    sheet_name:"email"
  },
  "notify":{
    title: "Notificar",
    html:update_notify_form(),
    id:"edit-notify",
    sheet_name:"notificar"
  },
  "patologias":{
    title: "Enfermedad / Patología",
    html:update_patologia_form(),
    id:"edit-patologia",
    sheet_name:"patologias"
  },
  "status":{
    title: "Estado del Plan",
    html:update_status_form(),
    id:"edit-status",
    sheet_name:"estado"
  },
}


/** Atajo de querySelector */
const $ = (sel, ctx = document) => ctx.querySelector(sel);


/** Construye URL con query params de forma segura */
function buildUrl(base, params = {}) {
  const url = new URL(base, location.origin);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && String(v).trim() !== "") {
      url.searchParams.set(k, v);
    }
  });
  return url.toString();
}

/** Formatea fecha a YYYY-MM-DD si es posible */
function formatDate(value) {
  if (!value) return "-";
  const raw = String(value);
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;
  const d = new Date(raw);
  if (isNaN(d)) return raw;
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

/** Escapa texto para evitar inyecciones si renderizas con innerHTML */
function safe(text) {
  const span = document.createElement("span");
  span.textContent = text ?? "";
  return span.innerHTML;
}


function setField(modalEl, field, value) {
  const el = modalEl.querySelector(`[data-field="${field}"]`);
  if (el) el.textContent = value ?? "—";
}



function isMobile() {
  let check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};



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
                <option>Activo</option>
                <option>Inactivo</option>
                <option>Pausado</option>
              </select>
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


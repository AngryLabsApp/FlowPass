const BD_PUBLIC_URL = "https://nujwzmwnptrsqojdjyjl.supabase.co";
const BD_API_PUBLIC = "sb_publishable_xoykhydSmDArWUQydl_oLw_Ho0g1C64";
const LOGIN_PATH = "/login.html";

const SEND_CODE_VIA_WHATSAPP = true; 

const CHECKIN_ICON_KEY = "gym";

const IMAGES_PATH_CHECKIN = {
  gym: "/public/icons/animations/push-ups.webp",
  salsa: "/public/icons/animations/salsa.webp",
};

const ENV_VARS = {
  url_form:
    "https://n8n.angrylabs.app/form/3858af95-5038-4d61-ba84-4ee767accee2",
  url_get_users:
    "https://n8n.angrylabs.app/webhook/0768a235-0d92-41e5-93f8-fcb566c57d40",
  url_update:
    "https://n8n.angrylabs.app/webhook/e1b1b332-23b4-4a96-97a4-912ec7d73ffc",
  url_ingreso:"https://n8n.angrylabs.app/webhook/b9a49ebc-c1cc-4551-bca6-21832295b34c",
  url_form_historico:"https://n8n.angrylabs.app/form/1d2dd8b6-8778-4783-962f-71386411932b",

  url_send_code:"https://n8n.angrylabs.app/webhook/17c50d70-e48e-47a6-8f7d-4434759b4f73",
};

const TABLE_COLUMNS = [
  { key: 'nombre',              label: 'Nombre(s)',        headClass: 'table__head-cell table__col--first-name', cellClass: 'table__cell table__col--first-name',  visible: true,
    render: (u) =>u.nombre ? `${toTitleCase(u.nombre)}` : `${safe(u.nombre)}`
  },
  { key: 'apellidos',           label: 'Apellido(s)',      headClass: 'table__head-cell table__col--last-name',  cellClass: 'table__cell table__col--last-name',   visible: true,
    render: (u) =>u.apellidos ? `${toTitleCase(u.apellidos)}` : `${safe(u.apellidos)}`
  },
  { key: 'plan',                label: 'Plan',             headClass: 'table__head-cell table__col--plan',       cellClass: 'table__cell table__col--plan',        visible: true },
  { key: 'clases',              label: 'Clases realizadas',headClass: 'table__head-cell table__col--classes',    cellClass: 'table__cell table__col--classes',     visible: true,
    render: (u) =>u.limite_clases ? `${safe(u.clases_tomadas)}/${safe(u.limite_clases)}` : `${safe(u.clases_tomadas)}`
  },
  { key: 'dias_de_gracia',      label: 'Días de cortesía', headClass: 'table__head-cell table__col--grace',      cellClass: 'table__cell table__col--grace',       visible: true },
  { key: 'fecha_inicio_plan',   label: 'Inicio de plan',   headClass: 'table__head-cell table__col--start',      cellClass: 'table__cell table__col--start',       visible: true,
    render: (u) => formatDateDMY(u.fecha_inicio_plan)
  },
  { key: 'proxima_fecha_pago',  label: 'Fin de plan',      headClass: 'table__head-cell table__col--end',        cellClass: 'table__cell table__col--end',         visible: true,
    render: (u) => formatDateDMY(u.proxima_fecha_pago)
  },
  { key: 'estado',              label: 'Estado',           headClass: 'table__head-cell table__col--status',     cellClass: 'table__cell table__col--status',      visible: true,
    render: (u) => `<span class="badge ${statusBadgeClass(u.estado)}">${safe(u.estado)}</span>`
  },
  { key: 'estado_pago',         label: 'Estatus de pago',  headClass: 'table__head-cell table__col--status',     cellClass: 'table__cell table__col--status',      visible: true,
    render: (u) => u.estado_pago ? `<span class="badge ${statusBadgeClass(u.estado_pago)}">${safe(u.estado_pago)}</span>`: ""
  },
];

const PLANES = [
    { value: "12 Sesiones Mensuales", label: "12 Sesiones Mensuales", amount:150 },
    { value: "16 Sesiones Mensuales", label: "16 Sesiones Mensuales", amount:180  },
    { value: "20 Sesiones Mensuales", label: "20 Sesiones Mensuales", amount:200  },
    { value: "Clase Libre",        label: "Clase Libre", amount:15  },
    { value: "Clase Gratis",       label: "Clase Gratis", amount:0 , is_free:true },
    { value: "12 Sesiones Personalizadas",  label: "12 Sesiones Personalizadas",amount:150  },
    { value: "16 Sesiones Personalizadas",  label: "16 Sesiones Personalizadas",amount:180  },
    { value: "20 Sesiones Personalizadas",  label: "20 Sesiones Personalizadas",amount:200  },
    { value: "Parejas",  label: "Parejas",amount:200 , partners: true },
    { value: "Ilimitado",  label: "Ilimitado",amount:200 , ilimitado: true  },
  ];

  const ESTADO_PLAN = [
    { value: "Activo", label: "Activo"},
    { value: "Inactivo", label: "Inactivo"},
    { value: "Pausado", label: "Pausado"},
  ]; 

  const METODO_DE_PAGO = [
    { value: "Plin", label: "Plin"},
    { value: "Yape", label: "Yape"},
    { value: "Efectivo", label: "Efectivo"},
    { value: "Transferencia", label: "Transferencia"},
   
  ]; 
  const ESTADO_PAGO = [
    { value: "Pagado", label: "Pagado"},
    { value: "Pendiente", label: "Pendiente"},
  ]; 
//CAMPOR QUE SE PUEDEN EDITAR CON EL BOTON DE EDIT (LAPIZ)
const EDITABLE_FIELD = ["phone","email","notify","patologias","status","clases","viaje","direccion","estado_pago","fecha_inicio_plan","cumpleanos","identificacion"];
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
    sheet_name:"estado",
    id2:"dias_extra",
    sheet_name2:"dias_extra"
  }, 
    "viaje":{
    title: "¿Está de viaje?",
    html:update_viaje_form(),
    id:"edit-viaje",
    sheet_name:"de_viaje"
  },
  "direccion":{
    title: "Dirección",
    html:update_direccion_form(),
    id:"edit-direccion",
    sheet_name:"direccion"
  },
  "estado_pago":{
    title: "Estado pago",
    html:update_estado_pago(),
    id:"edit-estado_pago",
    sheet_name:"estado_pago"
  },
  "fecha_inicio_plan":{
    title: "Inicio de plan",
    html:update_fecha_inicio_plan(),
    id:"edit-fecha_inicio_plan",
    sheet_name:"fecha_inicio_plan"
  },
   "cumpleanos":{
    title: "Fecha de cumpleaños",
    html:update_fecha_cumpleanos(),
    id:"edit-cumpleanos",
    sheet_name:"cumpleanos"
  },
   "identificacion":{
    title: "DNI/Pasaporte/CE",
    html:update_identificacion_form(),
    id:"edit-identificacion",
    sheet_name:"identificacion"
  },
}

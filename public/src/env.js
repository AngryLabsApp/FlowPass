const BD_PUBLIC_URL = "https://nujwzmwnptrsqojdjyjl.supabase.co";
const BD_API_PUBLIC = "sb_publishable_xoykhydSmDArWUQydl_oLw_Ho0g1C64";
const LOGIN_PATH = "/login.html";

const CHECKIN_ICON_KEY = "salsa";
const SEND_CODE_VIA_WHATSAPP = false; 
const IMAGES_PATH_CHECKIN = {
  gym: "/public/icons/animations/push-ups.webp",
  salsa: "/public/icons/animations/salsa.webp",
};

const ENV_VARS = {
  url_form:
    "https://n8n.angrylabs.app/form/ddffe362-567a-497b-a17f-cf2522fec9bb",
  url_get_users:
    "https://n8n.angrylabs.app/webhook/0768a235-0d92-41e5-93f8-fcb566c57d40",
  url_update:
    "https://n8n.angrylabs.app/webhook/e1b1b332-23b4-4a96-97a4-912ec7d73ffc",
  url_ingreso:"https://n8n.angrylabs.app/webhook/5a728e05-a20a-4715-82af-dfeff5a21f5e",
  url_form_historico:"https://n8n.angrylabs.app/form/90e18c52-079d-4004-876b-89911d4f5ae0",
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
  //{ key: 'dias_de_gracia',      label: 'Días de cortesía', headClass: 'table__head-cell table__col--grace',      cellClass: 'table__cell table__col--grace',       visible: true },
  { key: 'fecha_inicio_plan',   label: 'Inicio de plan',   headClass: 'table__head-cell table__col--start',      cellClass: 'table__cell table__col--start',       visible: true,
    render: (u) => formatDateDMY(u.fecha_inicio_plan)
  },
  /*{ key: 'proxima_fecha_pago',  label: 'Fin de plan',      headClass: 'table__head-cell table__col--end',        cellClass: 'table__cell table__col--end',         visible: true,
    render: (u) => formatDateDMY(u.proxima_fecha_pago)
  },
  */
  { key: 'estado',              label: 'Estado',           headClass: 'table__head-cell table__col--status',     cellClass: 'table__cell table__col--status',      visible: true,
    render: (u) => `<span class="badge ${statusBadgeClass(u.estado)}">${safe(u.estado)}</span>`
  },
  { key: 'estado_pago',         label: 'Estatus de pago',  headClass: 'table__head-cell table__col--status',     cellClass: 'table__cell table__col--status',      visible: true,
    render: (u) => u.estado_pago ? `<span class="badge ${statusBadgeClass(u.estado_pago)}">${safe(u.estado_pago)}</span>`: ""
  },
];

const PLANES = [
    { value: "Plan 8 Horas", label: "Plan 8 Horas", amount:120 },
    { value: "Plan 16 Horas", label: "Plan 16 Horas", amount:220  },
    { value: "Plan personalizado", label: "Plan personalizado", amount: 0  },
    { value: "Plan 8 Horas Pareja", label: "Plan 8 Horas Pareja", amount:220, partners: true  },
    { value: "Plan 16 Horas Pareja", label: "Plan 16 Horas Pareja", amount:380, partners: true  },
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
const EDITABLE_FIELD = ["phone","email","patologias","status","clases","direccion","estado_pago","fecha_inicio_plan","cumpleanos","identificacion"];
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
    title: "Información Adicional",
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

function fillSelect(selectId, options, selectedValue = "") {
  const sel = document.getElementById(selectId);
  if (!sel) return;
  // conserva el primer option (placeholder)
  sel.length = 1;
  options.forEach((o) => {
    const opt = document.createElement("option");
    opt.value = o.value;
    opt.textContent = o.label;
    sel.appendChild(opt);
  });
  if (selectedValue) sel.value = selectedValue;
}

function fillDynamicGeneratedSelect() {
  fillSelect("edit-status", ESTADO_PLAN);
  fillSelect("edit-estado_pago", ESTADO_PAGO);
}

function renderHead(columns, theadId) {
  const thead = document.getElementById(theadId);
  if (!thead) return;
  const visibleCols = columns.filter((c) => c.visible !== false);
  const cells = visibleCols
    .map(
      (c) =>
        `<th class="${c.headClass || "table__head-cell"}"
         data-key="${c.key}"
         ${c.sortable ? 'data-sortable="true"' : ""}>
       ${c.label}
       ${c.sortable ? '<span class="sort-indicator"></span>' : ""}
     </th>`
    )
    .join("");
  thead.innerHTML = `<tr class="table__row">${cells}</tr>`;
}

// === NUEVO: render de una fila usando TABLE_COLUMNS
function renderUserRowDynamic(user, columns = TABLE_COLUMNS) {
  let final_user = { ...user };
  if (final_user?.is_plan_partner && !final_user?.is_plan_principal && final_user.partner_id) {
    final_user.clases_tomadas = final_user.partner_clases_tomadas;
    final_user.limite_clases = final_user.partner_limite_clases;
    final_user.estado_pago = final_user.partner_estado_pago;
    final_user.estado = final_user.partner_estado;
    final_user.dias_de_gracia = final_user.partner_dias_de_gracia;
    final_user.monto = final_user.partner_monto;
    final_user.fecha_inicio_plan = final_user.partner_fecha_inicio_plan;
    final_user.proxima_fecha_pago = final_user.partner_proxima_fecha_pago;
  }

  const payload = encodeURIComponent(JSON.stringify(final_user));
  const cells = columns
    .filter((c) => c.visible !== false)
    .map((c) => {
      const html = c.render ? c.render(final_user) : safe(final_user[c.key]);
      const cellClass = c.cellClass || "table__cell";

      if (final_user.is_plan_partner) {
        const emojiHtml = `<svg class="icon icon--sm">
                      <use href="/public/icons/sprites.svg#pair"></use>
                    </svg>`;

        if (c.key === "clases") {
          const emoji = final_user.is_plan_partner ? emojiHtml : "";
          return `<td class="${cellClass}">${html} ${emoji}</td>`;
        }
      }
      return `<td class="${cellClass}">${html}</td>`;
    })
    .join("");
  return `<tr class="table__row" role="button" tabindex="0" data-user="${payload}">${cells}</tr>`;
}

function renderLoading( tbodyId = "members-tbody", colspan = 14) {

  const tbody = document.getElementById(tbodyId);
    console.log(tbody);
  tbody.innerHTML = `<tr class="table__row"><td class="table__cell" colspan="${colspan}">Cargando...</td></tr>`;
}

function renderEmpty(tbodyId, msg = "Sin registros", colspan = 14) {
   const tbody = document.getElementById(tbodyId);
  tbody.innerHTML = `<tr class="table__row"><td class="table__cell" colspan="${colspan}">${safe(
    msg
  )}</td></tr>`;
}
function renderError(
  tbodyId,
  msg = "Error al cargar datos. Intenta nuevamente.",
   colspan = 14
) {
   const tbody = document.getElementById(tbodyId);
  tbody.innerHTML = `<tr class="table__row"><td class="table__cell" colspan="${colspan}">${safe(
    msg
  )}</td></tr>`;
}

// === render de muchas filas al tbody
function renderTableRows(
  users,
  tbodyId = "members-tbody",
  columns = TABLE_COLUMNS
) {
  const tbody = document.getElementById(tbodyId);
  if (!tbody) return;
  const html = users.map((u) => renderUserRowDynamic(u, columns)).join("");
  tbody.innerHTML = html;
}


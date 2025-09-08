  function fillSelect(selectId, options, selectedValue = "") {
    const sel = document.getElementById(selectId);
    if(!sel) return;
    // conserva el primer option (placeholder)
    sel.length = 1;
    options.forEach(o => {
      const opt = document.createElement("option");
      opt.value = o.value;
      opt.textContent = o.label;
      sel.appendChild(opt);
    });
    if (selectedValue) sel.value = selectedValue;
  }

  function fillDynamicGeneratedSelect(){
        fillSelect("edit-status", ESTADO_PLAN);
        fillSelect("edit-estado_pago", ESTADO_PAGO);
  }

function renderHead(columns, theadId) {
  const thead = document.getElementById(theadId);
  if (!thead) return;
  const visibleCols = columns.filter(c => c.visible !== false);
  const cells = visibleCols.map(c =>
    `<th class="${c.headClass || 'table__head-cell'}"
         data-key="${c.key}"
         ${c.sortable ? 'data-sortable="true"' : ''}>
       ${c.label}
       ${c.sortable ? '<span class="sort-indicator"></span>' : ''}
     </th>`
  ).join('');
  thead.innerHTML = `<tr class="table__row">${cells}</tr>`;
}


// === NUEVO: render de una fila usando TABLE_COLUMNS
function renderUserRowDynamic(user, columns = TABLE_COLUMNS) {
  const payload = encodeURIComponent(JSON.stringify(user));
  const cells = columns
    .filter(c => c.visible !== false)
    .map(c => {
      const html = c.render ? c.render(user) : safe(user[c.key]);
      const cellClass = c.cellClass || 'table__cell';
      return `<td class="${cellClass}">${html}</td>`;
    })
    .join('');
  return `<tr class="table__row" role="button" tabindex="0" data-user="${payload}">${cells}</tr>`;
}

// === render de muchas filas al tbody
function renderTableRows(users, tbodyId = 'members-tbody', columns = TABLE_COLUMNS) {
  const tbody = document.getElementById(tbodyId);
  if (!tbody) return;
  const html = users.map(u => renderUserRowDynamic(u, columns)).join('');
  tbody.innerHTML = html;
}


  document.addEventListener("DOMContentLoaded", () => {
    renderHead(TABLE_COLUMNS, "usersThead");
    fillSelect("Plan", PLANES);
    fillSelect("Medio_de_pago", METODO_DE_PAGO);
    fillSelect("PaymentStatus", ESTADO_PAGO);
});

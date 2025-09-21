const usersState = {
  page: 1,
  pageSize: 10,     // ajusta a tu preferencia
  total: 0,
};

// Construye el arreglo de páginas con “…” según sea necesario
function buildPageItems(totalPages, current, windowSize = 1) {
  // windowSize=1 => muestra [current-1, current, current+1]
  const pages = [];
  const add = (v) => pages.push(v);

  const first = 1, last = totalPages;
  const start = Math.max(first, current - windowSize);
  const end   = Math.min(last,  current + windowSize);

  add(first);
  if (start > first + 1) add('…');

  for (let p = start; p <= end; p++) if (p !== first && p !== last) add(p);

  if (end < last - 1) add('…');
  if (last > first) add(last);

  // De-dup (por si hay solapamientos)
  return pages.filter((v, i, a) => i === 0 || v !== a[i-1]);
}

function setPage(page){
    usersState.page = page;

}

function renderPagination(_total) {
    usersState.total = _total;

  const { page, pageSize, total } = usersState;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const nav = document.getElementById('pagination');
  const status = document.getElementById('pagerStatus');
  if (!nav || !status) return;

  // Status "Mostrando X–Y de N"
  const start = total ? (page - 1) * pageSize + 1 : 0;
  const end   = Math.min(page * pageSize, total);
  status.textContent = `Mostrando ${start}–${end} de ${total}`;

  // Chips
  const frag = document.createDocumentFragment();

  // Prev
  frag.append(
    makeChip('‹', Math.max(1, page - 1), { icon:true, disabled: page === 1, label:'Página anterior' })
  );

  // Pages
  const items = buildPageItems(totalPages, page, 1); // 1 = vecindad
  items.forEach(it => {
    if (it === '…') {
      const span = document.createElement('span');
      span.className = 'pager-ellipsis';
      span.textContent = '…';
      frag.append(span);
    } else {
      const chip = makeChip(String(it), it, {
        current: it === page,
        label: `Ir a la página ${it}`
      });
      frag.append(chip);
    }
  });

  // Next
  frag.append(
    makeChip('›', Math.min(totalPages, page + 1), { icon:true, disabled: page === totalPages, label:'Página siguiente' })
  );

  nav.innerHTML = '';
  nav.append(frag);
}


function makeChip(text, pageValue, opts = {}) {
  const a = document.createElement('button');
  a.type = 'button';
  a.className = 'pager-chip' + (opts.icon ? ' pager-chip--icon' : '');
  a.textContent = text;
  a.setAttribute('data-page', pageValue);
  a.setAttribute('aria-label', opts.label || `Ir a página ${pageValue}`);
  if (opts.current) a.setAttribute('aria-current', 'page');
  if (opts.disabled) a.setAttribute('aria-disabled', 'true');
  return a;
}

function execute_load_function(func,targetPage){
    const fn = func // window en browser, global en Node
    if (typeof fn === 'function') {
      fn(targetPage);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    // Delegación de clicks
    document.getElementById('pagination')?.addEventListener('click', (e) => {
        const btn = e.target.closest('.pager-chip');
        if (!btn) return;
        if (btn.getAttribute('aria-disabled') === 'true') return;

        const targetPage = Number(btn.getAttribute('data-page'));
        if (!Number.isFinite(targetPage) || targetPage === usersState.page) return;


        execute_load_function(globalThis.loadUsers, targetPage);
        execute_load_function(globalThis.getPagos, targetPage);

    });

});

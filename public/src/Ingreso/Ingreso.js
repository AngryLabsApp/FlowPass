let Is_Modal_Open = false;
function applyCheckinUI({ ok, user, message }) {
  const statusEl  = document.getElementById('checkinStatus');
  const resultsEl = document.getElementById('checkinResults');
  const selEl     = document.getElementById('checkinSelected');

  if (!statusEl) return;

  // Limpia clases previas
  statusEl.classList.remove('checkin__status--ok', 'checkin__status--err');

  if (ok) {
    // ✅ Éxito
    const fullName = [user?.Nombre, user?.Apellidos].filter(Boolean).join(' ');
    statusEl.textContent = message || `Ingreso registrado para ${fullName || 'usuario'} ✅`;
    statusEl.classList.add('checkin__status--ok');

    // Oculta lista de resultados
    resultsEl?.setAttribute('hidden', '');

    // (Opcional) Limpia selección y el form
    // Si quieres dejar seleccionado, comenta estas 2 líneas:
    if (selEl) { selEl.hidden = true; selEl.innerHTML = ''; }
    document.getElementById('checkinForm')?.reset();
    document.getElementById('checkinQuery')?.focus();
  } else {
    // ❌ Error
    statusEl.textContent = message || 'No se pudo registrar el ingreso. Intenta de nuevo.';
    statusEl.classList.add('checkin__status--err');

    // Mantén visible la selección y/o resultados para corregir/reintentar
    // (no escondemos nada aquí)
    // Si quieres volver a mostrar sugerencias:
    // resultsEl?.removeAttribute('hidden');
  }
}


// Función que quieres ejecutar con el valor del input
function handleCheckin(query) {
  // aquí haces lo que necesites
    const ok = true; // o true cuando sea éxito real

  if (ok) {
    applyCheckinUI({ ok: true, user: { Nombre: 'James', Apellidos: 'Brown' } });
    openModal();
    clean(true); // ← limpia SOLO cuando fue éxito
  } else {
    applyCheckinUI({ ok: false, message: 'El código no existe.' });
     clean()
    // NO limpies aquí; deja el mensaje visible
  }
}

function clean(onlyForm){
    
    const form  = document.getElementById('checkinForm');
    const input = document.getElementById('checkinQuery');
    form.reset();
    input.focus();

    if(!onlyForm ){
        const statusEl  = document.getElementById('checkinStatus');
        const resultsEl = document.getElementById('checkinResults');
        const selEl     = document.getElementById('checkinSelected');

        if (statusEl)  statusEl.textContent = '';
        resultsEl?.setAttribute('hidden', ''); // esto sí puede usar ?. (no es asignación)
        if (selEl) { selEl.hidden = true; selEl.innerHTML = ''; }
    }
}


// Wire minimal
function loadForm () {
  const form  = document.getElementById('checkinForm');
  const input = document.getElementById('checkinQuery');
  const clear  = document.getElementById('checkinClear'); 

  if (!form || !input) return;

  // 1) Enter o click en el botón (porque es type="submit")
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const q = input.value.trim();
    if (!q) return;         // opcional: no enviar vacío
    handleCheckin(q);

  });
  
  // 2) (Opcional) Enter directo en el input si el botón fuera type="button"
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {

      e.preventDefault();
      if (!Is_Modal_Open){
        const q = input.value.trim();
        if (!q) return;
        handleCheckin(q);
      } else{
        closeModal();
        clean();
      }
    }

    if (e.key === 'Escape') {
        e.preventDefault();
        clean();
    }

  });


    clear?.addEventListener('click', (e) => {
        e.preventDefault();
       clean();
    });


};

function closeModal() {
  const m = document.getElementById("userModal");
  if (!m) return;
  Is_Modal_Open = false;
  m.setAttribute("aria-hidden", "true");
}

function initModal() {
  const btn = document.getElementById("ok_modal");
  if (!btn) return;
  btn.addEventListener("click", () => {
    closeModal();
  });
//BOTON X
  document.querySelectorAll("[data-close]").forEach((element) => {
        element.addEventListener("click", closeModal);
  });
}


function openModal() {
  const m = document.getElementById("userModal");
  if (!m) return;
  Is_Modal_Open = true;
  m.setAttribute("aria-hidden", "false");
}

document.addEventListener("DOMContentLoaded", () => {
    loadForm();
    initModal();

});
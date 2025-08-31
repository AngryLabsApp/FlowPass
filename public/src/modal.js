

function openModal(user) {
  const m =$("#userModal")
  if (!m) return;
  m.setAttribute('aria-hidden', 'false');
    
  console.log(user);

}
function initAddNewUser() {
  const btn = $("#btn-close");
  if (!btn) return;
  btn.addEventListener("click", () => {
        const m =$("#userModal")
        if (!m) return;
        m.setAttribute('aria-hidden', 'true');
  });
}


// =======================
// Init
// =======================
document.addEventListener("DOMContentLoaded", () => {
    initAddNewUser();
});



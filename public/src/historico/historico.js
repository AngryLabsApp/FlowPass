function open_historico_form() {
  const btn = document.getElementById("downloadHistory");
  if (!btn) return;
  btn.addEventListener("click", () => {
  window.open(ENV_VARS.url_form_historico, "_other");
  });
}


document.addEventListener("DOMContentLoaded", () => {
    open_historico_form();
});
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
  }


  document.addEventListener("DOMContentLoaded", () => {
    fillSelect("Plan", PLANES);
    fillSelect("Medio_de_pago", METODO_DE_PAGO);
    fillSelect("PaymentStatus", ESTADO_PAGO);
});
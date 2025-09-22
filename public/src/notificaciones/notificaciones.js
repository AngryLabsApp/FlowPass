function send_user_code_submit() {
  const button = document.getElementById("btnSendCodeWhatsApp");
  if (!button) return;
  button.addEventListener("click", async () => {
    showLoader("Enviando codigo...");
    user = getUserSelected();
    const payload = {
      id: user.id,
    };
    try {
      const res = await send_user_code(payload);
      const data = await res.json();

      if (!res.ok) throw new Error(data.reason);
      FP.toast.show("El código de ingreso se envió con éxito.", "success");
    } catch (err) {
      let error_message = err.message;
      console.log("error", error_message);
      let text =
        "Hubo un problema al enviar el codigo. Reintenta en unos segundos.";
      switch (error_message) {
        case "USER_NOT_FOUND":
        case "ERROR_SENDING_MESSAGE":
          break;
        case "INVALID_PHONE":
          text = "El número de teléfono no es válido.";
          break;
      }
      FP.toast.show(text, "error");
    }
    hideLoader();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("btnSendCodeWhatsApp");
  const isEnabled =
    typeof SEND_CODE_VIA_WHATSAPP !== "undefined" && !!SEND_CODE_VIA_WHATSAPP;

  if (!button) return;

  if (isEnabled) {
    // Mostrar el botón y habilitar envío
    button.classList.remove("hidden");
    button.disabled = false;
    send_user_code_submit();
  } else {
    // Ocultar el botón y asegurar que no se pueda enviar
    button.classList.add("hidden");
    button.disabled = true;
    console.log("Envío por WhatsApp deshabilitado por configuración");
  }
});

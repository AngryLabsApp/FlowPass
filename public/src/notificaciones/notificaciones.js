function send_user_code_submit () {
  const button = document.getElementById('btnSendCodeWhatsApp');
  if (!button) return;
    button.addEventListener("click", async () => {
        showLoader('Enviando codigo...');
        user = getUserSelected();
        const payload = {
            id: user.id,
        };
        try {
            const res = await send_user_code(payload);
            const data = await res.json();

            if (!res.ok) throw new Error(data.reason);
            showToast("El código de ingreso se envió con éxito.","success");
            
        } catch (err) {   
             let error_message = err.message;
            console.log("error",error_message);
            let text = "Hubo un problema al enviar el codigo. Reintenta en unos segundos."
            switch(error_message){
                case "USER_NOT_FOUND":
                case "ERROR_SENDING_MESSAGE":
                    break;
                case "INVALID_PHONE":
                    text = "El número de teléfono no es válido.";
                    break;
            }
            showToast(text,"error");
        }
        hideLoader();

    });
}

document.addEventListener("DOMContentLoaded", () => {
    send_user_code_submit();
});

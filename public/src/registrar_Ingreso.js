document.addEventListener("DOMContentLoaded", () => {

    const btn = $("#btnCheckIn");
    if (!btn) return;

    btn.addEventListener("click", () => {
        const currentUser = getUserSelected();
        if (!currentUser) {
        console.warn("No hay usuario seleccionado");
        return;
    }

    // Aquí mandas el objeto user a tu función
    registrarIngreso(currentUser);
  });
});

async function registrarIngreso(user) {
    console.log(user);
    user.Clases_tomadas += 1;
  try {
     showLoader('Registrando ingreso...');
    const res = await fetch(ENV_VARS.url_update, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ID: user.ID,
        Clases_tomadas:{"value":user.Clases_tomadas},
      }),
    });
    loadUsers();
    hideLoader();
    closeModal();
    if (!res.ok) {
      throw new Error(`Error en la petición: ${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    // Aquí podrías mostrar un mensaje de éxito en la UI
  } catch (err) {
    console.error("Error al registrar ingreso:", err);
    // Aquí podrías mostrar un mensaje de error en la UI
  }
}
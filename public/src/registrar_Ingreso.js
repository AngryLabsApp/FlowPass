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
    const tomadas = Number(user.clases_tomadas) || 0;
    const limite = Number(user.limite_clases);
    const estadoPlan = String(user.estado || '').trim().toLowerCase();

    // Si el plan no está activo, no permitir registrar
    if (estadoPlan !== 'activo') {
      setCheckInButtonDisabled(true);
      return;
    }

    // Validación: bloquear y mostrar chip desde que llega al límite (>=)
    const limiteValido = Number.isFinite(limite) && limite > 0; // solo aplica si hay límite positivo
    if (limiteValido && tomadas >= limite) {
      setCheckInWarning(true, `El usuario llegó al máximo de clases que puede tomar (${tomadas}/${limite})`);
      setCheckInButtonDisabled(true);
      return;
    }

    const nuevasTomadas = tomadas + 1;
  try {
    showLoader('Registrando ingreso...');
    const res = await registrar_ingreso(user, nuevasTomadas);
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

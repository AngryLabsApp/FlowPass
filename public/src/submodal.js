// Submodal (mobile-only stacked modal) utilities
(function () {
  const $ = (sel, ctx = document) => ctx.querySelector(sel);

  function isMobileViewport() {
    return window.matchMedia && window.matchMedia("(max-width: 768px)").matches;
  }

  function getSubModal() {
    return $("#userSubModal");
  }

  function openSubModal(title, innerHTML) {
    const m = getSubModal();
    if (!m) return;
    const titleEl = $("#userSubModalTitle");
    const content = $("#subModalContent");
    if (titleEl) titleEl.textContent = title || "Editar";
    if (content) content.innerHTML = innerHTML || "";
    m.setAttribute("aria-hidden", "false");
  }

  function closeSubModal() {
    const m = getSubModal();
    if (!m) return;
    m.setAttribute("aria-hidden", "true");
    const content = $("#subModalContent");
    if (content) content.innerHTML = "";
  }

  // Build: Renovar Plan form (mobile)
  /* SE QUITO DIAS DE GRACIA: 
        <div class="form__row">
          <label class="form__label" for="sub-Dias_de_Gracia">Días de gracia</label>
          <input class="form__control" id="sub-Dias_de_Gracia" name="Dias_de_Gracia" type="number" step="1" min="0" />
        </div>
  */
  function buildPlanFormHTML() {
    return `
      <form class="form" id="sub-update-form">
        <div class="form__row">
          <label class="form__label" for="sub-Plan">Plan</label>
          <select class="form__control" id="sub-Plan" name="Plan">
            <option value="">Selecciona…</option>
            <!-- Opciones se llenan dinámicamente -->
          </select>
        </div>

        <div class="form__row">
          <label class="form__label" for="sub-Monto">Monto de pago</label>
          <input class="form__control" id="sub-Monto" name="Monto" type="number" step="0.01" min="0" />
        </div>



        <div class="form__row">
          <label class="form__label" for="sub-Medio_de_pago">Método de pago</label>
          <select class="form__control" id="sub-Medio_de_pago" name="Medio_de_pago">
            <option value="">Selecciona…</option>
            <!-- Opciones se llenan dinámicamente -->
          </select>
        </div>

        <div class="form__row">
          <label class="form__label" for="sub-PaymentStatus">Estado de pago</label>
          <select class="form__control" id="sub-PaymentStatus" name="PaymentStatus" required>
            <option value="">Selecciona…</option>
            <!-- Opciones se llenan dinámicamente -->
          </select>
        </div>

        <div class="form__actions">
          <button class="btn btn--secondary" type="button" id="subCancelForm">Cancelar</button>
          <button class="btn btn--primary" type="submit">Guardar cambios</button>
        </div>
      </form>
    `;
  }

  function attachPlanFormHandlers(scope) {
    const form = scope.querySelector("#sub-update-form");
    if (!form) return;

    // Prellenar monto según plan (usa PLANES para amount y is_free)
    const planEl = scope.querySelector("#sub-Plan");
    const montoEl = scope.querySelector("#sub-Monto");
    if (planEl && montoEl) {
      planEl.addEventListener("change", () => {
        const p = planEl.value;
        try {
          const planObj =
            typeof PLANES !== "undefined"
              ? PLANES.find((item) => item.value === p)
              : null;
          if (planObj && typeof planObj.amount === "number") {
            montoEl.value = planObj.amount.toFixed(2);
            montoEl.readOnly = !!planObj.is_free;
          } else {
            montoEl.value = "";
            montoEl.readOnly = false;
          }
        } catch (_) {
          montoEl.value = "";
          montoEl.readOnly = false;
        }
      });
    }

    // Llenar selects dinámicamente (Plan, Método de pago, Estado de pago)
    try {
      if (typeof fillSelect === "function") {
        fillSelect("sub-Plan", typeof PLANES !== "undefined" ? PLANES : []);
        fillSelect(
          "sub-Medio_de_pago",
          typeof METODO_DE_PAGO !== "undefined" ? METODO_DE_PAGO : []
        );
        fillSelect(
          "sub-PaymentStatus",
          typeof ESTADO_PAGO !== "undefined" ? ESTADO_PAGO : []
        );
      }
    } catch (_) {}

    // Prefill with current user values
    try {
      const user = window.getUserSelected ? window.getUserSelected() : null;
      if (user) {
        const setVal = (sel, val) => {
          const el = scope.querySelector(sel);
          if (el && val != null) el.value = String(val);
        };
        setVal("#sub-Plan", user.plan);
        // trigger plan change to sync amount
        if (planEl) planEl.dispatchEvent(new Event("change"));
        // if backend amount exists, prefer it
        setVal("#sub-Monto", user.monto);
        setVal("#sub-Dias_de_Gracia", user.dias_de_gracia);
        setVal("#sub-Medio_de_pago", user.medio_de_pago);
        setVal("#sub-PaymentStatus", user.estado_pago);
      }
    } catch (_) {}

    const cancelBtn = scope.querySelector("#subCancelForm");
    if (cancelBtn) cancelBtn.addEventListener("click", closeSubModal);

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('[type="submit"]');
      submitBtn.disabled = true;
      let success = false;
      try {
        const user = window.getUserSelected ? window.getUserSelected() : null;
        if (!user) throw new Error("No user selected");
        const payload = {
          id: user.id,
          dias_de_gracia: {
            value: scope.querySelector("#sub-Dias_de_Gracia")?.value || 0,
          },
          monto: { value: scope.querySelector("#sub-Monto")?.value || 0 },
          medio_de_pago: {
            value: scope.querySelector("#sub-Medio_de_pago")?.value,
          },
          estado_pago: {
            value: scope.querySelector("#sub-PaymentStatus")?.value,
          },
        };
        const planVal = scope.querySelector("#sub-Plan")?.value;
        if (planVal) payload.plan = { value: planVal };

        showLoader("Actualizando los datos...");
        const res = await update_users(payload);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        success = true;
      } catch (err) {
        console.error(err);
        showToast("Hubo un problema al actualizar. Reintenta en unos segundos.");
        hideLoader();
      } finally {
        if (typeof hideLoader === "function") hideLoader();
        if (typeof loadUsers === "function") loadUsers();
        // Actualizar modal principal con los nuevos valores
        try {
          const patch = {
            dias_de_gracia:
              scope.querySelector("#sub-Dias_de_Gracia")?.value || 0,
            monto: scope.querySelector("#sub-Monto")?.value || 0,
            medio_de_pago:
              scope.querySelector("#sub-Medio_de_pago")?.value || "",
            estado_pago: scope.querySelector("#sub-PaymentStatus")?.value || "",
          };
          const planVal = scope.querySelector("#sub-Plan")?.value;
          if (planVal) patch.plan = planVal;
          if (typeof patchSelectedUser === "function") patchSelectedUser(patch);
        } catch (_) {}
        closeSubModal();
        if (success) {
          try {
            location.reload();
          } catch (_) {}
        }
      }
    });
  }

  function openPlanSubmodal() {
    openSubModal("Renovar plan", buildPlanFormHTML());
    const scope = document.getElementById("subModalContent");
    attachPlanFormHandlers(scope);
  }

  // Build: Single-field edit form (mobile)
  function buildSingleFieldFormHTML(fieldKey) {
    const meta =
      typeof FIELD_VALUES !== "undefined" ? FIELD_VALUES[fieldKey] : undefined;
    if (!meta) return "<p>No disponible</p>";

    return `
      <form class="form" id="sub-single-form">
        ${meta.html}
        <div class="form__actions">
          <button class="btn btn--secondary" type="button" id="subCancelSingle">Cancelar</button>
          <button class="btn btn--primary" type="submit">Guardar cambios</button>
        </div>
      </form>
    `;
  }

  function attachSingleFieldHandlers(scope, fieldKey) {
    const meta =
      typeof FIELD_VALUES !== "undefined" ? FIELD_VALUES[fieldKey] : undefined;
    if (!meta) return;
    const form = scope.querySelector("#sub-single-form");
    if (!form) return;
    const cancelBtn = scope.querySelector("#subCancelSingle");
    if (cancelBtn) cancelBtn.addEventListener("click", closeSubModal);

    // Prefill with current user value when possible
    try {
      const user = window.getUserSelected ? window.getUserSelected() : null;
      if (user) {
        const setVal = (id, val) => {
          const el = scope.querySelector(`#${id}`);
          if (el && val != null) el.value = String(val);
        };
        switch (fieldKey) {
          case "phone":
            setVal(meta.id, user.telefono);
            break;
          case "email":
            setVal(meta.id, user.email);
            break;
          case "notify":
            setVal(meta.id, user.notificar);
            break;
          case "patologias":
            setVal(meta.id, (user.patologias || "").toString());
            break;
          case "status":
            setVal(meta.id, user.estado);
            if (meta.id2) setVal(meta.id2, user.dias_extra);
            break;
          case "clases":
            setVal(meta.id, user.clases_tomadas);
            if (meta.id2) setVal(meta.id2, user.limite_clases);
            break;
          case "viaje":
            setVal(meta.id, user.de_viaje);
            break;
          case "direccion":
            setVal(meta.id, user.direccion);
            break;
        }
      }
    } catch (_) {}

    // Rellenar selects dinámicos si existen (e.g., estado del plan)
    try {
      if (typeof fillDynamicGeneratedSelect === "function")
        fillDynamicGeneratedSelect();
    } catch (_) {}

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('[type="submit"]');
      submitBtn.disabled = true;
      let success = false;
      try {
        const user = window.getUserSelected ? window.getUserSelected() : null;
        if (!user) throw new Error("No user selected");

        const payload = {
          id: user.id,
          type: "SINGLE",
        };
        let valid = false;

        // Read primary field
        const v1 = scope.querySelector(`#${meta.id}`)?.value;
        if (v1) {
          valid = true;
          payload[meta.sheet_name] = { value: v1 };
        }
        // Optional second field
        if (meta.id2) {
          const v2 = scope.querySelector(`#${meta.id2}`)?.value;
          if (v2) {
            valid = true;
            payload[meta.sheet_name2] = { value: v2 };
          }
        }
        if (!valid) {
          submitBtn.disabled = false;
          return;
        }

        showLoader("Actualizando los datos...");
        const res = await update_users(payload);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        success = true;
      } catch (err) {
        console.error(err);
        showToast("Hubo un problema al actualizar. Reintenta en unos segundos.");
        hideLoader();
      } finally {
        if (typeof hideLoader === "function") hideLoader();
        if (typeof loadUsers === "function") loadUsers();
        // Refrescar modal principal con el nuevo valor
        try {
          const meta =
            typeof FIELD_VALUES !== "undefined"
              ? FIELD_VALUES[fieldKey]
              : undefined;
          if (meta) {
            const patch = {};
            const v1 = scope.querySelector(`#${meta.id}`)?.value;
            if (v1) patch[meta.sheet_name] = v1;
            if (meta.id2) {
              const v2 = scope.querySelector(`#${meta.id2}`)?.value;
              if (v2) patch[meta.sheet_name2] = v2;
            }
            if (typeof patchSelectedUser === "function")
              patchSelectedUser(patch);
          }
        } catch (_) {}
        closeSubModal();
        if (success) {
          try {
            location.reload();
          } catch (_) {}
        }
      }
    });
  }

  function openSingleFieldSubmodal(fieldKey) {
    const meta =
      typeof FIELD_VALUES !== "undefined" ? FIELD_VALUES[fieldKey] : undefined;
    const title = meta ? meta.title : "Editar";
    openSubModal(title, buildSingleFieldFormHTML(fieldKey));
    const scope = document.getElementById("subModalContent");
    attachSingleFieldHandlers(scope, fieldKey);
  }

  // Wire close/back buttons
  document.addEventListener("DOMContentLoaded", () => {
    const m = getSubModal();
    if (!m) return;
    m.querySelectorAll("[data-close-sub]").forEach((el) => {
      el.addEventListener("click", closeSubModal);
    });
    const back = document.getElementById("subModalBack");
    if (back) back.addEventListener("click", closeSubModal);

    // Fallback delegation: intercept edit buttons on mobile and open submodal
    try {
      const parent = document.getElementById("userModal");
      if (parent) {
        parent.addEventListener(
          "click",
          (ev) => {
            if (!isMobileViewport()) return; // solo en móvil
            const btn = ev.target.closest(".edit-btn");
            if (!btn) return;
            const id = btn.id || "";
            const m = id.match(/^btn-edit-(.+)$/);
            if (!m) return;
            ev.preventDefault();
            ev.stopImmediatePropagation();
            const fieldKey = m[1];
            openSingleFieldSubmodal(fieldKey);
          },
          true
        );
      }
    } catch (_) {}
  });

  // Expose helpers globally for other modules
  window.__submodal = {
    isMobileViewport,
    openPlanSubmodal,
    openSingleFieldSubmodal,
    closeSubModal,
  };
})();

 import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
  const BD_PUBLIC_URL = "https://nujwzmwnptrsqojdjyjl.supabase.co";
  const BD_API_PUBLIC = "sb_publishable_xoykhydSmDArWUQydl_oLw_Ho0g1C64";
    const supabase = createClient(BD_PUBLIC_URL, BD_API_PUBLIC);

    const stepMsg   = document.getElementById("step-msg");
    const form      = document.getElementById("reset-form");
    const passEl    = document.getElementById("password");
    const confEl    = document.getElementById("confirm");
    const submitBtn = document.getElementById("submit");
    const msg       = document.getElementById("msg");
    const nextSteps = document.getElementById("next-steps");
    const loginLink = document.getElementById("login-link");
    let verifiedEmail = null;

    const toggle1   = document.getElementById("toggle1");
    const toggle2   = document.getElementById("toggle2");

    function updateToggleIcon(btn, showing) {
      const use = btn.querySelector('use');
      if (use) {
        use.setAttribute('href', showing ? '/public/icons/sprites.svg#eye-close' : '/public/icons/sprites.svg#eye');
      }
      btn.setAttribute('aria-pressed', String(showing));
      btn.setAttribute('title', showing ? 'Ocultar contraseña' : 'Mostrar contraseña');
      btn.setAttribute('aria-label', showing ? 'Ocultar contraseña' : 'Mostrar contraseña');
    }

    // Mostrar/ocultar nueva contraseña
    toggle1.addEventListener("click", () => {
      const showing = passEl.type === "password";
      passEl.type = showing ? "text" : "password";
      updateToggleIcon(toggle1, showing);
    });
    // Mostrar/ocultar confirmación
    toggle2.addEventListener("click", () => {
      const showing = confEl.type === "password";
      confEl.type = showing ? "text" : "password";
      updateToggleIcon(toggle2, showing);
    });

    // Validación en tiempo real de confirmación
    function validateConfirmMatch() {
      const p1 = passEl.value;
      const p2 = confEl.value;

      // Limpiar si no hay nada que comparar todavía
      if (!p1 && !p2) { msg.textContent = ""; msg.className = "msg"; return; }
      if (!p2) { msg.textContent = ""; msg.className = "msg"; return; }

      if (p1 === p2) {
        msg.textContent = "Coinciden";
        msg.className = "msg ok";
      } else {
        msg.textContent = "Las contraseñas no coinciden.";
        msg.className = "msg error";
      }
    }

    passEl.addEventListener('input', validateConfirmMatch);
    confEl.addEventListener('input', validateConfirmMatch);

    // Intenta crear sesión desde la URL (PKCE o hash tokens)
    async function bootstrapSession() {
      const qs = new URLSearchParams(location.search);
      const hash = new URLSearchParams(location.hash.slice(1));

      const code = qs.get("code");
      const access_token = hash.get("access_token");
      const refresh_token = hash.get("refresh_token");

      if (code) {
        // Enlaces tipo ?code=... (PKCE)
        // OJO: el code_verifier se guarda en el mismo navegador donde inició el flujo.
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) throw error;
        return data.session;
      }

      if (access_token && refresh_token) {
        // Enlaces con #access_token=...&refresh_token=...
        const { data, error } = await supabase.auth.setSession({ access_token, refresh_token });
        if (error) throw error;
        return data.session;
      }

      // Último intento: si el SDK ya detectó la sesión automáticamente
      const { data: { session } } = await supabase.auth.getSession();
      if (session) return session;

      throw new Error("El enlace no contiene credenciales válidas (code o access/refresh token). Solicita otro correo de recuperación.");
    }

    // 1) Intercambia la URL por una sesión válida antes de mostrar el formulario
    try {
      const session = await bootstrapSession();

      const strong = document.createElement('strong');
      strong.textContent = 'Ingresa tu nueva contraseña:';
      if (session?.user?.email) {
        verifiedEmail = session.user.email;
        // Construye el mensaje y resalta el email en rojo
        stepMsg.textContent = 'Usuario verificado: ';
        const emailSpan = document.createElement('span');
        emailSpan.textContent = session.user.email;
        emailSpan.classList.add('text-rose');
        stepMsg.appendChild(emailSpan);
        stepMsg.appendChild(document.createTextNode('. '));
        stepMsg.appendChild(strong);
      } else {
        stepMsg.textContent = '';
        stepMsg.appendChild(strong);
      }
      form.classList.remove("hidden");
    } catch (err) {
      stepMsg.textContent = err?.message || "No pudimos validar el enlace. Pide otro desde 'Olvidé mi contraseña'.";
      form.classList.add("hidden");
    }

    // 2) Guardar nueva contraseña
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      msg.textContent = ""; msg.className = "msg";

      const p1 = passEl.value;
      const p2 = confEl.value;

      if (!p1 || p1.length < 8) {
        msg.textContent = "La contraseña debe tener al menos 8 caracteres.";
        msg.classList.add("error");
        return;
      }
      if (p1 !== p2) {
        msg.textContent = "Las contraseñas no coinciden.";
        msg.classList.add("error");
        return;
      }

      submitBtn.disabled = true; submitBtn.textContent = "Guardando…";
      try {
        const { error } = await supabase.auth.updateUser({ password: p1 });
        if (error) throw error;
        msg.textContent = "Contraseña actualizada ✅";
        msg.classList.add("ok");
        form.classList.add("hidden");
        // Actualiza el mensaje superior con el resultado y el email
        // Imagen de celebración (party.webp)
        stepMsg.textContent = '';
        const partyImg = document.createElement('img');
        partyImg.src = '/public/icons/animations/party.webp';
        partyImg.alt = 'Contraseña restablecida';
        partyImg.width = 150;
        partyImg.height = 150;
        partyImg.setAttribute('decoding', 'async');
        partyImg.style.display = 'block';
        partyImg.style.margin = '8px auto 12px';
        stepMsg.appendChild(partyImg);
        const successText = document.createElement('div');
        successText.className = 'reset-success-text';
        successText.style.textAlign = 'center';
        if (verifiedEmail) {
          successText.appendChild(document.createTextNode('La contraseña del usuario '));
          const strongEmail = document.createElement('strong');
          strongEmail.textContent = verifiedEmail;
          successText.appendChild(strongEmail);
          successText.appendChild(document.createTextNode(' ha sido restablecida exitosamente.'));
        } else {
          successText.textContent = 'La contraseña ha sido restablecida exitosamente.';
        }
        stepMsg.appendChild(successText);

        // Configura el botón de ir al login en rosa
        const loginHref = (typeof LOGIN_PATH !== 'undefined' && LOGIN_PATH) ? LOGIN_PATH : '/login.html';
        loginLink.href = loginHref;
        loginLink.textContent = 'Ir al login';
        loginLink.className = 'btn btn--primary btn--primary--large btn-login';
        // Muestra solo el botón en la sección de próximos pasos
        nextSteps.textContent = '';
        nextSteps.appendChild(loginLink);
        nextSteps.classList.remove("hidden");
      } catch (err) {
        msg.textContent = err?.message || "No pudimos actualizar la contraseña.";
        msg.classList.add("error");
      } finally {
        submitBtn.disabled = false; submitBtn.textContent = "Guardar contraseña";
      }
    });

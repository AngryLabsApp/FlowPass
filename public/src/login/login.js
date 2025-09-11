 import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
    const BD_PUBLIC_URL = "https://nujwzmwnptrsqojdjyjl.supabase.co";
    const BD_API_PUBLIC = "sb_publishable_xoykhydSmDArWUQydl_oLw_Ho0g1C64";
    const ADMIN_PATH = "/index.html";
    const supabase = createClient(BD_PUBLIC_URL, BD_API_PUBLIC, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });

    // Si ya hay sesión, pasa directo al panel
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      //console.log(session);
      if (session?.access_token) window.location.replace(ADMIN_PATH);


    })();

    // Referencias
    const form = document.getElementById("login-form");
    const emailEl = document.getElementById("email");
    const passEl  = document.getElementById("password");
    const btn     = document.getElementById("submit");
    const msg     = document.getElementById("msg");
    const toggle  = document.getElementById("toggle");
    const resetLink = document.getElementById("resetLink");

    // Mostrar/ocultar contraseña + cambiar icono accesible
    toggle.addEventListener("click", () => {
      const showing = passEl.type === "password";
      passEl.type = showing ? "text" : "password";
      // Actualiza icono y atributos accesibles
      const use = toggle.querySelector('use');
      if (use) {
        use.setAttribute('href', showing ? '/public/icons/sprites.svg#eye' : '/public/icons/sprites.svg#eye-close');
      }
      toggle.setAttribute('aria-pressed', String(showing));
      toggle.setAttribute('title', showing ? 'Ocultar contraseña' : 'Mostrar contraseña');
      toggle.setAttribute('aria-label', showing ? 'Ocultar contraseña' : 'Mostrar contraseña');
    });

    // Login email + password
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      msg.textContent = ""; msg.className = "msg";

      const email = emailEl.value.trim().toLowerCase();
      const password = passEl.value;

      if (!email || !password) {
        msg.textContent = "Completa correo y contraseña.";
        msg.classList.add("error");
        return;
      }

      btn.disabled = true; btn.textContent = "Entrando…";
      try {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;


        // opcional: confirma que hay sesión antes de redirigir
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          window.location.assign(ADMIN_PATH);
        } else {
          console.warn('Login aparente, pero sin sesión cargada aún.');
        }

      } catch (err) {
        // Mensajes más claros
        const text =
          err?.message?.includes("Invalid login")
            ? "Credenciales inválidas."
            : err?.message || "No pudimos iniciar sesión.";
        msg.textContent = text;
        msg.classList.add("error");
      } finally {
        btn.disabled = false; btn.textContent = "Entrar";
      }
    });

    // Flujo de reset de contraseña (opcional, simple)
    // Esto envía un email con enlace para restablecer.
    // IMPORTANTE: agrega la URL de destino a Auth → URL Configuration → Redirect URLs
    // y crea una página /reset.html que llame supabase.auth.updateUser({ password: '...' }).
    resetLink.addEventListener("click", async () => {
      const email = prompt("Escribe tu correo para restablecer contraseña:");
      if (!email) return;

     const redirectTo = `${location.origin}/reset.html`;
      console.log("redirect to", redirectTo);
      msg.textContent = "Enviando correo…"; msg.className = "msg";
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo
      });
      if (error) {
        msg.textContent = error.message; msg.classList.add("error");
      } else {
        msg.textContent = "Hemos enviado un enlace si el correo existe."; msg.classList.add("ok");
      }
    });

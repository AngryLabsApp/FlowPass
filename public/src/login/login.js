 import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
    
    const ADMIN_PATH = "/index.html";
    const supabase = createClient(BD_PUBLIC_URL, BD_API_PUBLIC);

    // Si ya hay sesión, pasa directo al panel
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) window.location.replace(ADMIN_PATH);
    })();

    // Referencias
    const form = document.getElementById("login-form");
    const emailEl = document.getElementById("email");
    const passEl  = document.getElementById("password");
    const btn     = document.getElementById("submit");
    const msg     = document.getElementById("msg");
    const toggle  = document.getElementById("toggle");
    const resetLink = document.getElementById("resetLink");

    // Mostrar/ocultar contraseña
    toggle.addEventListener("click", () => {
      passEl.type = passEl.type === "password" ? "text" : "password";
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
        window.location.assign(ADMIN_PATH);
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
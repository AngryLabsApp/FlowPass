import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
    
  const supabase = createClient(BD_PUBLIC_URL, BD_API_PUBLIC);

  document.getElementById("logout").addEventListener("click", async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error al cerrar sesión:", error.message);
      return;
    }
    // opcional: limpia algo propio de tu app aquí
    window.location.replace(LOGIN_PATH);
  });
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

  const BD_PUBLIC_URL = "https://nujwzmwnptrsqojdjyjl.supabase.co";
  const BD_API_PUBLIC = "sb_publishable_xoykhydSmDArWUQydl_oLw_Ho0g1C64";
  const LOGIN_PATH = "/login.html";
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
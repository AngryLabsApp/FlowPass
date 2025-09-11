import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const BD_PUBLIC_URL = "https://nujwzmwnptrsqojdjyjl.supabase.co";
const BD_API_PUBLIC = "sb_publishable_xoykhydSmDArWUQydl_oLw_Ho0g1C64";
const LOGIN_PATH = "/login.html";
const supabase = createClient(BD_PUBLIC_URL, BD_API_PUBLIC, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });

document.addEventListener('DOMContentLoaded', async () => {
  // 1) Carga real desde storage
  const { data: { session } } = await supabase.auth.getSession();

  // 2) Si hay sesión, intenta logout LOCAL (no global)
  if (session?.access_token) {
    const { error } = await supabase.auth.signOut({ scope: 'local' });
    if (error?.message === 'Auth session missing!') {
      // Fallback: limpia storage del proyecto
      clearSupabaseStorage(BD_PUBLIC_URL);
    }
  } else {
    // No hay sesión: asegúrate de limpiar posibles restos
    clearSupabaseStorage(BD_PUBLIC_URL);
  }

  // 3) Redirige cuando ya limpiaste
  window.location.replace(LOGIN_PATH);
});

function clearSupabaseStorage(url) {
  try {
    const projectRef = new URL(url).host.split('.')[0]; // ej: nujwzmwnptrsqojdjyjl
    const prefix = `sb-${projectRef}`;
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const k = localStorage.key(i);
      if (k && k.startsWith(prefix)) localStorage.removeItem(k);
    }
  } catch {}
}
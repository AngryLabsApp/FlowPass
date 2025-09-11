import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

let supabase = null;


try {

  supabase = createClient(BD_PUBLIC_URL, BD_API_PUBLIC, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      });

} catch (error) {
   window.location.replace("/login.html");
}



export async function ensureSessionOrRedirect() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      // no hay login → manda a tu página de login
      window.location.replace("/login.html");
      return null;
    }
    if (!session?.access_token) {
      window.location.replace("/login.html");
      return null;
    }
    return session; // tiene .access_token y .user
  } catch (error) {
     window.location.replace("/login.html");
  }
}

const session = await ensureSessionOrRedirect();
if (!session) throw new Error("Sin sesión");
//test();


  // (Opcional) reacciona a cambios (logout, refresh)
supabase.auth.onAuthStateChange((event, s) => {
  console.log("event",event);
    if (event === 'TOKEN_REFRESHED') {
    console.log('🔄 token renovado');
  }
  if (event === 'SIGNED_OUT') {
    window.location.replace('/login.html');
  }
});




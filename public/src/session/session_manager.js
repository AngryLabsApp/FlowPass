import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

let supabase = null;


try {
  supabase = createClient(BD_PUBLIC_URL, BD_API_PUBLIC);
} catch (error) {
   window.location.replace("/login.html");
}



export async function ensureSessionOrRedirect() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      // no hay login → manda a tu página de login
      window.location.replace("/login.html");
      return null;
    }
    return session; // tiene .access_token y .user
}

const session = await ensureSessionOrRedirect();
if (!session) throw new Error("Sin sesión");
//test();


  // (Opcional) reacciona a cambios (logout, refresh)
supabase.auth.onAuthStateChange((event, s) => {
    if (event === 'TOKEN_REFRESHED') {
    console.log('🔄 token renovado');
  }
  if (event === 'SIGNED_OUT') {
    window.location.replace('/login.html');
  }
});



async function test(){
    const local_session = await ensureSessionOrRedirect();
    const res = await fetch("https://n8n.angrylabs.app/webhook/f723d083-b927-4ef0-bdaf-0df2bde6399a", {
        signal: currentAbort.signal,
        headers: { Authorization: `Bearer ${local_session.access_token}`, 'Content-Type': 'application/json',Accept: "application/json" },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
  
    const data = await res.json();
    console.log("response",data);
}




async function load_users(url, currentAbort) {

    const local_session = await window.SessionManager.ensureSessionOrRedirect();
    if (!local_session) return; 
    
    return await fetch(url, {
      signal: currentAbort.signal,
      headers: { Authorization: `Bearer ${local_session.access_token}`, 'Content-Type': 'application/json',Accept: "application/json" },
    });
}

async function registrar_ingreso(user, nuevasTomadas) {
    const local_session = await window.SessionManager.ensureSessionOrRedirect();
    return await fetch(ENV_VARS.url_update, {
      method: "POST",
      headers: { Authorization: `Bearer ${local_session.access_token}`, 'Content-Type': 'application/json',Accept: "application/json" },
      body: JSON.stringify({
        id: user.id,
        type: "SINGLE",
        clases_tomadas: { value: nuevasTomadas },
      }),
    });
  
}

async function update_users(payload) {
    const local_session = await window.SessionManager.ensureSessionOrRedirect();
    return await fetch(ENV_VARS.url_update, {
          method: 'POST',
          headers: { Authorization: `Bearer ${local_session.access_token}`, 'Content-Type': 'application/json',Accept: "application/json" },
          body: JSON.stringify(payload),
    });
}
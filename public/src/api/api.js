async function load_users(url, currentAbort) {

    const local_session = await window.SessionManager.ensureSessionOrRedirect();
    if (!local_session) return; 
    
    return await fetch(url, {
      signal: currentAbort.signal,
      headers: { Authorization: `Bearer ${local_session.access_token}`, 'Content-Type': 'application/json',Accept: "application/json" },
    });
}

async function get_planes() {

    const local_session = await window.SessionManager.ensureSessionOrRedirect();
    if (!local_session) return; 
    
    return await fetch(ENV_VARS.url_get_planes, {
      headers: { Authorization: `Bearer ${local_session.access_token}`, 'Content-Type': 'application/json',Accept: "application/json" },
    });
}

async function ingreso_by_code(url) {
   const local_session = await window.SessionManager.ensureSessionOrRedirect();
   if (!local_session) return; 
   
    return await fetch(url, {
      headers: { Authorization: `Bearer ${local_session.access_token}`, 'Content-Type': 'application/json',Accept: "application/json" },
    });
}

async function get_pagos(url, currentAbort) {

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
        method:"MANUAL"
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

async function delete_users(payload) {
    const local_session = await window.SessionManager.ensureSessionOrRedirect();
    return await fetch(ENV_VARS.url_delete_user, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${local_session.access_token}`, 'Content-Type': 'application/json',Accept: "application/json" },
          body: JSON.stringify(payload),
    });
}


async function send_user_code(payload) {
    const local_session = await window.SessionManager.ensureSessionOrRedirect();
    return await fetch(ENV_VARS.url_send_code, {
          method: 'POST',
          headers: { Authorization: `Bearer ${local_session.access_token}`, 'Content-Type': 'application/json',Accept: "application/json" },
          body: JSON.stringify(payload),
    });
}
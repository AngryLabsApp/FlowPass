async function load_users() {
    return await fetch(url, {
      signal: currentAbort.signal,
      headers: { Accept: "application/json" },
    });
}

async function registrar_ingreso(user, nuevasTomadas) {
    return await fetch(ENV_VARS.url_update, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: user.id,
        type: "SINGLE",
        clases_tomadas: { value: nuevasTomadas },
      }),
    });
  
}



async function update_users(payload) {
    return await fetch(ENV_VARS.url_update, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
    });
}
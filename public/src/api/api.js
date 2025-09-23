async function load_users(url, currentAbort) {

    const local_session = await window.SessionManager.ensureSessionOrRedirect();
    if (!local_session) return; 
    
    return await fetch(url, {
      signal: currentAbort.signal,
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


async function get_planes({ force = false, maxAgeMs = 60 * 60 * 1000 } = {}) {
  const keyData = 'plans:data';
  const keyEtag = 'plans:etag';
  const keyTs   = 'plans:ts';

  const session = await window.SessionManager.ensureSessionOrRedirect();
  if (!session) return;

  const cached = getCached({ keyData, keyEtag, keyTs });
  console.log("cached", cached);
  const headers = {
    Authorization: `Bearer ${session.access_token}`,
    Accept: 'application/json',
  };
  if (cached?.etag) headers['If-None-Match'] = cached.etag;

    console.log("cached headers", headers);
  // Cache-first si está fresco y no forzaste
  if (!force && isFresh(cached, maxAgeMs)) {
    // Revalidación en segundo plano (opcional)
    fetch(ENV_VARS.url_get_planes, { headers })
      .then(async (res) => {
        if (res.status === 200) {
          const data = await res.json();
          const planes = data.planes;
          const etag = data.etag;
          setCached({ keyData, keyEtag, keyTs, planes, etag });
        }
      })
      .catch(() => {});
    console.log("EL CACHADO",cached.data);
    return cached.data;
  }

  // Descarga/revalida
  const res = await fetch(ENV_VARS.url_get_planes, { headers });
  if (res.status === 304 && cached) return cached.data;
  if (!res.ok) {
    if (cached) return cached.data;
    throw new Error(`Fetch plans failed: ${res.status}`);
  }

  const data = await res.json();
  const planes = data.planes;
  const etag = data.etag;
  setCached({ keyData, keyEtag, keyTs, data:planes, etag });
  console.log("EL ULTIMO",data.planes);
  return data.planes;
}



function getCached({
  storage = localStorage,
  keyData,
  keyEtag,
  keyTs,
  reviver,
}) {
  try {
    const raw = storage.getItem(keyData);
    if (!raw) return null;
    return {
      data: JSON.parse(raw, reviver),
      etag: storage.getItem(keyEtag) || '',
      ts: Number(storage.getItem(keyTs) || 0),
    };
  } catch {
    return null;
  }
}

function setCached({
  storage = localStorage,
  keyData,
  keyEtag,
  keyTs,
  data,
  etag,
  replacer,
}) {
  storage.setItem(keyData, JSON.stringify(data, replacer));
  if (etag) storage.setItem(keyEtag, etag);
  storage.setItem(keyTs, String(Date.now()));
}

function isFresh(cached, maxAgeMs) {
  if (!cached) return false;
  return (Date.now() - (cached.ts || 0)) < maxAgeMs;
}
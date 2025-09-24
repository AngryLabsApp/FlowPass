import { ensureSessionOrRedirect } from "/public/src/session/session_manager.js";
//ESTE ARCHIVO SE USA PARA CARGAR TODOS LOS ENDPOINTS INCIIALES

window.SessionManager = { ensureSessionOrRedirect };



async function load_apis(){
    const planes  = await get_planes();
    ENV_SET_PLANES(planes);


    window.dispatchEvent(new Event("info_loaded"));
}

window.addEventListener("session-ready",async  () => {
    await load_apis();
}, { once: true });






//Dejarlo al final
window.dispatchEvent(new Event("session-ready"));

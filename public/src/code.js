const ENV_VARS = {
    url_form:"https://n8n.angrylabs.app/form/54f40a75-b183-4483-9c51-82d281c6b504"
}

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("nuevoUsuario");

  btn.addEventListener("click", () => {
    const url = ENV_VARS.url_form; 
    window.open(url, "_blank"); 
  });
});

function mapTableBody(user){
    return `
    <tr class="table__row">
        <td class="table__cell table__col--user-id">${user.ID}</td>
        <td class="table__cell table__col--first-name">${user.Nombre}</td>
        <td class="table__cell table__col--last-name">${user.Apellidos}</td>
        <td class="table__cell table__col--phone">${user.Telefono}</td>
        <td class="table__cell table__col--email">${user.Email}</td>
        <td class="table__cell table__col--plan">${user.Plan}</td>
        <td class="table__cell table__col--amount">${user.Monto}</td>
        <td class="table__cell table__col--method">
            <span class="badge badge--method">${user.Medio_de_pago}</span>
        </td>
        <td class="table__cell table__col--status">
            <span class="badge badge--paid">${user.Estado}</span>
        </td>
        <td class="table__cell table__col--classes">${user.Clases_tomadas}</td>
        <td class="table__cell table__col--grace">${user.Dias_de_Gracia}</td>
        <td class="table__cell table__col--start">${user.Fecha_Alta}</td>
        <td class="table__cell table__col--end">${user.Proxima_Fecha_Pago}</td>
        <td class="table__cell table__col--birth">${user.Cumpleaños}</td>
    </tr>
    `
}

async function loadUsers() {
    const tbody =  document.getElementById("usersTbody");

    if (!tbody) return;

    tbody.innerHTML = `
        <tr class="table__row"><td class="table__cell" colspan="14">Cargando...</td></tr>
    `;

    try {
        const res = await fetch("https://n8n.angrylabs.app/webhook/9ecc1791-c157-4084-8de6-6924235d95cd");
        if (!res.ok) throw new Error("Error en la respuesta del servidor");

        const data = await res.json();

        // ⚡ Ajusta según cómo responda tu webhook
        const items = Array.isArray(data) ? data : data?.data || [];


        if (!items.length || items.length<= 0) {
            tbody.innerHTML = `<tr><td colspan="14">Sin registros</td></tr>`;
            return;
        }
        let total =items[0].total;
        let users = items[0].data;
        let tableBody = "";
        users.forEach(user => {
            tableBody+= mapTableBody(user);
        });
        tbody.innerHTML = tableBody;
        
        console.log(total, users);

    }catch(error){

    }

}


// ===== Init =====
document.addEventListener("DOMContentLoaded", loadUsers);
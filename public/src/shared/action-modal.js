let usersMenu = null;
let usersMenuTrigger = null;
let usersMenuRow = null;

let confirmDialog = null;
let confirmTitleEl = null;
let confirmCancelBtn = null;
let confirmConfirmBtn = null;
let confirmOverlay = null;

function createUsersMenu() {
  const menu = document.createElement("div");
  menu.className = "users-menu";
  menu.setAttribute("role", "menu");
  menu.hidden = true;
  menu.innerHTML = `
    <button
      type="button"
      class="users-menu__item users-menu__item--danger"
      role="menuitem"
      data-action="delete"
    >
      <svg class="icon users-menu__icon" aria-hidden="true">
        <use href="/public/icons/sprites.svg#trash"></use>
      </svg>
      Eliminar alumno
    </button>
  `;

  menu.addEventListener("click", (event) => {
    const item = event.target.closest("[data-action]");
    if (!item) return;
    event.preventDefault();
    handleUsersMenuAction(item.dataset.action);
  });

  document.body.append(menu);
  return menu;
}

function getUsersMenu() {
  if (!usersMenu) usersMenu = createUsersMenu();
  return usersMenu;
}

function hideUsersMenu() {
  if (!usersMenu || usersMenu.hidden) return;
  usersMenu.classList.remove("is-open");
  usersMenu.hidden = true;
  usersMenu.style.top = "";
  usersMenu.style.left = "";

  if (usersMenuTrigger) {
    usersMenuTrigger.setAttribute("aria-expanded", "false");
  }

  usersMenuTrigger = null;
  usersMenuRow = null;
}

function showUsersMenu(trigger) {
  const menu = getUsersMenu();
  if (usersMenuTrigger && usersMenuTrigger !== trigger) {
    usersMenuTrigger.setAttribute("aria-expanded", "false");
  }

  menu.hidden = false;
  menu.style.visibility = "hidden";
  menu.style.top = "0px";
  menu.style.left = "0px";

  const triggerRect = trigger.getBoundingClientRect();
  const menuRect = menu.getBoundingClientRect();
  const margin = 8;
  const top = triggerRect.bottom + window.scrollY + 4;
  let left = triggerRect.right + window.scrollX - menuRect.width;
  const maxLeft = window.scrollX + window.innerWidth - menuRect.width - margin;
  const minLeft = window.scrollX + margin;
  left = Math.min(Math.max(left, minLeft), maxLeft);

  menu.style.top = `${Math.max(top, window.scrollY + margin)}px`;
  menu.style.left = `${left}px`;
  menu.style.visibility = "";
  menu.classList.add("is-open");

  trigger.setAttribute("aria-expanded", "true");
  usersMenuTrigger = trigger;
  usersMenuRow = trigger.closest(".table__row");
}

function toggleUsersMenu(trigger) {
  const menu = getUsersMenu();
  if (!menu.hidden && trigger === usersMenuTrigger) {
    hideUsersMenu();
  } else {
    showUsersMenu(trigger);
  }
}

function handleUsersMenuDocumentClick(event) {
  if (event.target.closest("[data-users-menu-trigger]")) return;
  if (usersMenu && usersMenu.contains(event.target)) return;
  hideUsersMenu();
}

function handleUsersMenuKeydown(event) {
  if (event.key === "Escape") hideUsersMenu();
}

function initUsersMenu() {
  getUsersMenu();
  document.addEventListener("click", handleUsersMenuDocumentClick);
  document.addEventListener("keydown", handleUsersMenuKeydown);
  window.addEventListener("resize", hideUsersMenu);
  window.addEventListener("scroll", hideUsersMenu, true);
}

function handleUsersMenuAction(action) {
  if (action === "delete") {
    openConfirmDeleteDialog(usersMenuRow);
  }
  hideUsersMenu();
}

function cacheConfirmDialogElements() {
  if (confirmDialog) {
    return {
      dialog: confirmDialog,
      title: confirmTitleEl,
      cancelBtn: confirmCancelBtn,
      confirmBtn: confirmConfirmBtn,
      overlay: confirmOverlay,
    };
  }

  const dialog = document.getElementById("confirmDeleteDialog");
  if (!dialog) return {};

  confirmDialog = dialog;
  confirmTitleEl = dialog.querySelector("#confirmDeleteTitle");
  confirmCancelBtn = dialog.querySelector("[data-dialog-cancel]");
  confirmConfirmBtn = dialog.querySelector("[data-dialog-confirm]");
  confirmOverlay = dialog.querySelector("[data-dialog-close]");

  return {
    dialog: confirmDialog,
    title: confirmTitleEl,
    cancelBtn: confirmCancelBtn,
    confirmBtn: confirmConfirmBtn,
    overlay: confirmOverlay,
  };
}

function openConfirmDeleteDialog(row) {
  const { dialog, title, cancelBtn } = cacheConfirmDialogElements();
  if (!dialog) return;

  let fullName = "este alumno";
  if (row) {
    const raw = row.dataset.user || "";
    try {
      const user = raw ? JSON.parse(decodeURIComponent(raw)) : null;
      const nameParts = [user?.nombre, user?.apellidos]
        .map((part) => (part ? toTitleCase(String(part)) : ""))
        .filter(Boolean);
      if (nameParts.length) fullName = nameParts.join(" ");
    } catch (error) {
      console.warn("No se pudo preparar el nombre del alumno", error);
    }
  }

  if (title) {
    title.textContent = `¿Seguro que quieres eliminar al alumno ${fullName}?`;
  }

  dialog.dataset.userId = row?.dataset.userId || "";
  dialog.dataset.userPayload = row?.dataset.user || "";

  dialog.setAttribute("aria-hidden", "false");
  requestAnimationFrame(() => {
    cancelBtn?.focus({ preventScroll: true });
  });
}

function closeConfirmDeleteDialog() {
  if (!confirmDialog || confirmDialog.getAttribute("aria-hidden") === "true") return;
  confirmDialog.setAttribute("aria-hidden", "true");
  confirmDialog.dataset.userId = "";
  confirmDialog.dataset.userPayload = "";
}

function handleConfirmDialogKeydown(event) {
  if (event.key === "Escape" && confirmDialog?.getAttribute("aria-hidden") === "false") {
    closeConfirmDeleteDialog();
  }
}

function initConfirmDeleteDialog() {
  const { dialog, cancelBtn, confirmBtn, overlay } = cacheConfirmDialogElements();
  if (!dialog) return;

  cancelBtn?.addEventListener("click", () => {
    closeConfirmDeleteDialog();
  });

  overlay?.addEventListener("click", () => {
    closeConfirmDeleteDialog();
  });

  confirmBtn?.addEventListener("click", () => {
    // TODO: Conectar con la API real de eliminación.
  });

  document.addEventListener("keydown", handleConfirmDialogKeydown);
}

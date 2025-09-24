// Helpers compartidos para la tabla de usuarios.
(function () {
  function renderUserActionsCell(user) {
    const userId = user.id;

    return `
      <button
        type="button"
        class="users-table__menu-trigger"
        aria-haspopup="true"
        aria-expanded="false"
        aria-label="Más acciones"
        data-users-menu-trigger
        data-user-id="${safe(userId)}"
      >
        <svg class="icon users-menu__icon" aria-hidden="true">
          <use href="/public/icons/sprites.svg#menu-dots-vertical"></use>
        </svg>
      </button>
    `;
  }

  window.renderUserActionsCell = renderUserActionsCell;
})();

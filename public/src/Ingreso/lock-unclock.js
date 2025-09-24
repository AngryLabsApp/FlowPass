const NAVIGABLE_SELECTOR = 'a[href], [data-navigates="true"]';
const LOCK_ICON = '/public/icons/sprites.svg#lock-code';
const UNLOCK_ICON = '/public/icons/sprites.svg#unlock-code';

/**
 * Inicializa el botón de bloqueo/desbloqueo de navegación.
 * Exportada para poder reutilizarla o testearla en otros contextos.
 */
export function initLockUnclockButton() {
  const container = document.getElementById('block-button');
  if (!container) return;

  const button = container.matches('button')
    ? container
    : container.querySelector('button');
  if (!button) return;

  if (container.dataset.lockUnclockInitialized === 'true') return;
  container.dataset.lockUnclockInitialized = 'true';

  const iconUse =
    container.querySelector('.lock-unclock-btn__icon use') ||
    container.querySelector('svg use');
  const messageEl = container.querySelector('.lock-unclock-msg');

  let isLocked = false;
  let hideMessageTimeoutId = null;
  let hideMessageCleanupId = null;

  button.type = 'button';
  button.setAttribute('aria-pressed', 'false');

  const setIcon = (href) => {
    if (iconUse) {
      iconUse.setAttribute('href', href);
    }
  };

  const syncAriaLabel = () => {
    button.setAttribute('aria-label', isLocked ? 'Bloqueado' : 'Desbloqueado');
  };

  syncAriaLabel();

  const showMessage = () => {
    if (!messageEl) return;

    window.clearTimeout(hideMessageTimeoutId);
    window.clearTimeout(hideMessageCleanupId);
    hideMessageTimeoutId = null;
    hideMessageCleanupId = null;

    messageEl.textContent = isLocked ? 'Bloqueado' : 'Desbloqueado';
    messageEl.hidden = false;

    messageEl.classList.remove('lock-unclock-msg--show');
    void messageEl.offsetWidth; // fuerza reflow para reiniciar animación
    messageEl.classList.add('lock-unclock-msg--show');

    hideMessageTimeoutId = window.setTimeout(() => {
      messageEl.classList.remove('lock-unclock-msg--show');
      hideMessageCleanupId = window.setTimeout(() => {
        messageEl.hidden = true;
      }, 220);
    }, 2000);
  };

  const navBlocker = (event) => {
    if (!isLocked) return;

    const candidate = event.target.closest(NAVIGABLE_SELECTOR);
    if (!candidate) return;

    const tagName = candidate.tagName.toLowerCase();
    const isAnchor = tagName === 'a';
    const isDataNavigateTrue =
      candidate instanceof HTMLElement &&
      candidate.dataset?.navigates === 'true';

    if (!isAnchor && !isDataNavigateTrue) return;

    event.preventDefault();
    event.stopPropagation();
    if (typeof event.stopImmediatePropagation === 'function') {
      event.stopImmediatePropagation();
    }
  };

  const lockNavigation = () => {
    if (isLocked) return;

    isLocked = true;
    container.classList.add('lock-unclock-btn--active');
    button.setAttribute('aria-pressed', 'true');
    syncAriaLabel();
    setIcon(LOCK_ICON);
    showMessage();
    document.addEventListener('click', navBlocker, true);
  };

  const unlockNavigation = () => {
    if (!isLocked) return;

    isLocked = false;
    container.classList.remove('lock-unclock-btn--active');
    button.setAttribute('aria-pressed', 'false');
    syncAriaLabel();
    setIcon(UNLOCK_ICON);
    showMessage();
    document.removeEventListener('click', navBlocker, true);
  };

  button.addEventListener('click', () => {
    if (isLocked) {
      unlockNavigation();
    } else {
      lockNavigation();
    }
  });
}

// Auto-inicializa cuando el módulo se carga como script principal.
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLockUnclockButton, {
    once: true,
  });
} else {
  initLockUnclockButton();
}

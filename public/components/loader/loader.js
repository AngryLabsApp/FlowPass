class FPLoader extends HTMLElement {
  static get observedAttributes() {
    return ['open', 'message'];
  }

  constructor() {
    super();
    this._raf = null;
    this._angle = 0;
  }

  connectedCallback() {
    if (!this._hasInnerStructure()) {
      this.innerHTML = `
        <div class="modal__overlay"></div>
        <div class="modal__dialog card loader__dialog">
          <div class="loader__spinner"></div>
          <p class="loader__text">Procesando...</p>
        </div>
      `;
    }
    this.classList.add('modal');
    this.setAttribute('role', 'alert');
    this.setAttribute('aria-modal', 'true');

    // Estado inicial
    this._applyOpen(this.hasAttribute('open'));
    // Inicializa mensaje desde atributo si existe
    if (this.hasAttribute('message')) {
      this._updateMessageDOM(this.getAttribute('message'));
    }
  }

  disconnectedCallback() {
    this._stopSpin();
  }

  attributeChangedCallback(name, _old, value) {
    if (name === 'open') {
      this._applyOpen(this.hasAttribute('open'));
    }
    if (name === 'message') {
      // ⚠️ Solo actualiza DOM, NO vuelvas a setAttribute aquí
      this._updateMessageDOM(value ?? 'Procesando...');
    }
  }

  // ---- API pública ----
  show(msg = 'Procesando...') {
    // setea el atributo; attributeChangedCallback actualiza el DOM
    if (this.getAttribute('message') !== msg) this.setAttribute('message', msg);
    this.setAttribute('open', '');
  }

  hide() {
    this.removeAttribute('open');
  }

  setMessage(msg = 'Procesando...') {
    if (this.getAttribute('message') !== msg) {
      this.setAttribute('message', msg);
      // attributeChangedCallback se encargará del DOM
    }
  }

  // ---- Internos ----
  _hasInnerStructure() {
    return (
      this.querySelector('.loader__spinner') &&
      this.querySelector('.loader__text') &&
      this.querySelector('.modal__dialog')
    );
  }

  _applyOpen(isOpen) {
    this.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
    if (isOpen) this._startSpin();
    else this._stopSpin();
  }

  _updateMessageDOM(msg) {
    const el = this.querySelector('.loader__text');
    if (el) el.textContent = msg;
  }

  _startSpin() {
    const spinner = this.querySelector('.loader__spinner');
    if (!spinner) return;
    cancelAnimationFrame(this._raf);
    const step = () => {
      this._angle = (this._angle + 6) % 360;
      spinner.style.transform = `rotate(${this._angle}deg)`;
      this._raf = requestAnimationFrame(step);
    };
    this._raf = requestAnimationFrame(step);
  }

  _stopSpin() {
    cancelAnimationFrame(this._raf);
    this._raf = null;
    const spinner = this.querySelector('.loader__spinner');
    if (spinner) spinner.style.transform = '';
    this._angle = 0;
  }
}

customElements.define('fp-loader', FPLoader);

// ===== Export plano estilo "React" (idéntico a fp-toast) =====
window.FP ??= {};
document.addEventListener('DOMContentLoaded', () => {
  customElements.whenDefined('fp-loader').then(() => {
    const el = document.getElementById('loader') || document.querySelector('fp-loader');
    FP.loader = {
      show: (msg = 'Procesando...') => el?.show(msg),
      hide: () => el?.hide(),
      setMessage: (msg) => el?.setMessage(msg),
      el, // por si quieres manipular el nodo directamente
    };
  });
});

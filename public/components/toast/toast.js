// /public/components/fp-toast.js
// Simple, framework-free, no Shadow DOM so your existing .toast CSS keeps working.

class Toast extends HTMLElement {
  constructor() {
    super();
    this._timer = null;
    this._colors = {
      error:   "#ef4444",
      success: "#22c55e",
      info:    "#3b82f6",
      warning: "#f59e0b",
    };
  }

//Se ejecuta cuando se carga el componente
  connectedCallback() {
    this.setAttribute("role", "status");
    this.setAttribute("aria-live", this.getAttribute("aria-live") || "assertive");
    this.setAttribute("aria-atomic", this.getAttribute("aria-atomic") || "true");
    if (!this.classList.contains("toast")) this.classList.add("toast");

    // Click to dismiss
    this.addEventListener("click", () => this.hide());
  }

  show(message, { type = "error", duration = 3000 } = {}) {
    const bg = this._colors[type] || this._colors.error;
    
    this.style.background = bg;
    this.textContent = message;
    this.classList.add("show");
    this.setAttribute("aria-hidden", "false");

    clearTimeout(this._timer);
    this._timer = setTimeout(() => this.hide(), duration);
  }

  hide() {
    this.classList.remove("show");
    this.setAttribute("aria-hidden", "true");
  }
}

customElements.define("fp-toast", Toast);
//EXPORT
window.FP ??= {};
document.addEventListener('DOMContentLoaded', () => {
  customElements.whenDefined('fp-toast').then(() => {
    const el = document.getElementById('toast') || document.querySelector('fp-toast');
    FP.toast = {
      show: (message, type = 'error', duration = 3000) => el?.show(message, { type, duration }),
      hide: () => el?.hide(),
    };
  });
});

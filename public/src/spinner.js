let __loaderRaf = null;

function __startSpinnerJS() {
  const el = document.querySelector('#loaderModal .loader__spinner');
  if (!el) return;

  let angle = 0;
  cancelAnimationFrame(__loaderRaf);
  const step = () => {
    angle = (angle + 6) % 360; // ~60fps → 6° por frame ≈ 1 vuelta/seg
    el.style.transform = `rotate(${angle}deg)`;
    __loaderRaf = requestAnimationFrame(step);
  };
  __loaderRaf = requestAnimationFrame(step);
}

function __stopSpinnerJS() {
  cancelAnimationFrame(__loaderRaf);
  __loaderRaf = null;
  const el = document.querySelector('#loaderModal .loader__spinner');
  if (el) el.style.transform = '';
}

function showLoader(msg = 'Procesando...') {
  const loader = document.getElementById('loaderModal');
  if (!loader) return;
  const text = loader.querySelector('.loader__text');
  if (text) text.textContent = msg;
  loader.setAttribute('aria-hidden', 'false');
  __startSpinnerJS();
}

function hideLoader() {
  const loader = document.getElementById('loaderModal');
  if (!loader) return;
  __stopSpinnerJS();
  loader.setAttribute('aria-hidden', 'true');
}


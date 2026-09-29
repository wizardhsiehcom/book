(() => {
  'use strict';
  const background = document.querySelector('.eclipse-background');
  const buttons = document.querySelectorAll('[data-background-choice]');
  const modes = ['animated', 'static', 'off'];

  function apply(mode) {
    if (!modes.includes(mode)) mode = 'animated';
    document.body.dataset.background = mode;
    buttons.forEach(button => {
      const selected = button.dataset.backgroundChoice === mode;
      button.classList.toggle('active', selected);
      button.setAttribute('aria-pressed', selected);
    });
    savePreference('bookBackground', mode);
  }
  function syncVisibility() {
    background.dataset.suspended = String(document.hidden);
  }
  buttons.forEach(button => {
    button.addEventListener('click', () => apply(button.dataset.backgroundChoice));
  });
  document.addEventListener('visibilitychange', syncVisibility);
  window.addEventListener('pagehide', () => { background.dataset.suspended = 'true'; });
  window.addEventListener('pageshow', syncVisibility);
  syncVisibility();
  apply(readPreference('bookBackground', 'animated'));
})();

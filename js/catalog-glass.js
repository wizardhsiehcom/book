(() => {
  'use strict';
  const catalog = document.querySelector('.catalog');
  const grid = document.getElementById('grid');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const properties = ['--glass-x', '--glass-y', '--glass-opposite-x', '--glass-angle'];
  let active = null;
  let bounds = null;
  let point = null;
  let frame = 0;

  function reset() {
    cancelAnimationFrame(frame);
    if (active) properties.forEach(name => active.style.removeProperty(name));
    active = null;
    bounds = null;
    point = null;
    frame = 0;
  }

  function move(event) {
    if (!fine.matches || reduced.matches || event.pointerType === 'touch') return;
    const target = event.target.closest('.card, .category');
    if (active !== target) {
      reset();
      if (!target) return;
      active = target;
      bounds = target.getBoundingClientRect();
    }
    if (!active) return;
    point = { x: event.clientX, y: event.clientY };
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      if (!active?.isConnected || !bounds || !point) {
        reset();
        return;
      }
      const x = Math.max(0, Math.min(1, (point.x - bounds.left) / bounds.width));
      const y = Math.max(0, Math.min(1, (point.y - bounds.top) / bounds.height));
      active.style.setProperty('--glass-x', `${(x * 100).toFixed(2)}%`);
      active.style.setProperty('--glass-y', `${(y * 100).toFixed(2)}%`);
      active.style.setProperty('--glass-opposite-x', `${((1 - x) * 100).toFixed(2)}%`);
      active.style.setProperty('--glass-angle', `${(105 + x * 28).toFixed(2)}deg`);
    });
  }

  catalog.addEventListener('pointerover', move);
  catalog.addEventListener('pointermove', move);
  catalog.addEventListener('pointerout', event => {
    if (active && !active.contains(event.relatedTarget)) reset();
  });
  // 篩選只替換書目；分類按鈕未變時保留它正在使用的追光座標。
  new MutationObserver(() => {
    if (active && !active.isConnected) reset();
  }).observe(grid, { childList: true });
  window.addEventListener('scroll', reset, { passive: true });
  window.addEventListener('resize', reset);
  window.addEventListener('blur', reset);
  window.addEventListener('pagehide', reset);
  window.addEventListener('pageshow', reset);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) reset();
  });
  reduced.addEventListener('change', reset);
  fine.addEventListener('change', reset);
})();

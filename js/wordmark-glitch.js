// 「書庫」字標殘訊：每 4～12 秒閃一次輕微訊號干擾，0.15～0.4 秒後恢復；減少動態時不啟用。
(() => {
  const wm = document.querySelector('.library-wordmark');
  if (!wm || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const imgs = [...wm.querySelectorAll('img')];
  const rand = (a, b) => a + Math.random() * (b - a);
  const slices = [0, 1].map(() => {
    const d = document.createElement('div');
    d.className = 'glitch-slice'; d.setAttribute('aria-hidden', 'true');
    imgs.forEach(i => { const c = i.cloneNode(); c.alt = ''; c.removeAttribute('fetchpriority'); d.append(c); });
    return wm.appendChild(d);
  });
  function frame() {
    wm.style.setProperty('--gx', rand(-3, 3).toFixed(1) + 'px');
    wm.style.setProperty('--jx', (Math.random() < .2 ? rand(-4, 4) : 0).toFixed(1) + 'px');
    wm.style.setProperty('--gb', rand(.9, 1.25).toFixed(2));
    wm.style.setProperty('--band', rand(0, 90).toFixed(0) + '%');
    slices.forEach(s => {
      const top = rand(0, 90), h = rand(2, 8);
      s.style.clipPath = `inset(${top}% 0 ${Math.max(0, 100 - top - h)}% 0)`;
      s.style.transform = `translateX(${rand(-8, 8).toFixed(0)}px)`;
    });
  }
  function burst() {
    if (document.hidden) return setTimeout(burst, 4000);
    const end = performance.now() + rand(150, 400);
    wm.classList.add('glitch');
    (function tick() {
      if (performance.now() > end) { wm.classList.remove('glitch'); return setTimeout(burst, rand(4000, 12000)); }
      frame(); setTimeout(tick, rand(40, 90));
    })();
  }
  setTimeout(burst, 2000);
})();

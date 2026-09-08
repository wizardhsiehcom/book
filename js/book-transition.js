// 動畫只提供回饋；導覽完全交給原生 <a>，不攔截、不計時等待。
const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
const samurai = document.getElementById('samuraiWrap');
const blade = document.getElementById('blade');
let selectedBook = null;

function resetBookTransition() {
  for (const element of [samurai, blade]) {
    element.getAnimations().forEach(animation => animation.cancel());
    element.style.viewTransitionName = '';
  }
  blade.classList.remove('blade-local');
  selectedBook = null;
}

// 使用當前版面定位，避免縮放／捲動後沿用點擊時的座標。
function positionBlade() {
  if (!selectedBook) return false;
  samurai.getAnimations().forEach(animation => animation.cancel());
  const rect = selectedBook.getBoundingClientRect();
  const actor = samurai.getBoundingClientRect();
  const x = actor.left + actor.width * 0.64;
  const y = actor.top + actor.height * 0.35;
  const dx = rect.left + rect.width / 2 - x;
  const dy = rect.top + rect.height / 2 - y;
  const distance = Math.hypot(dx, dy);
  if (distance < 1) return false;
  const ux = dx / distance, uy = dy / distance;
  const edgeX = ux > 0 ? (innerWidth - 8 - x) / ux : ux < 0 ? (8 - x) / ux : Infinity;
  const edgeY = uy > 0 ? (innerHeight - 8 - y) / uy : uy < 0 ? (8 - y) / uy : Infinity;
  Object.assign(blade.style, {
    left: `${x}px`, top: `${y - 5}px`,
    width: `${Math.max(0, Math.min(distance + rect.width / 2, edgeX, edgeY))}px`,
    rotate: `${Math.atan2(dy, dx)}rad`,
  });
  return true;
}

document.getElementById('grid').addEventListener('click', event => {
  const card = event.target.closest('a.card');
  if (!card || event.defaultPrevented || event.button !== 0 ||
      event.metaKey || event.ctrlKey || event.shiftKey || event.altKey ||
      card.hasAttribute('download') || (card.target && card.target !== '_self')) return;

  resetBookTransition();
  if (motionPreference.matches || document.body.classList.contains('variant-none')) return;
  selectedBook = card;
  if (!positionBlade()) return;

  const crossPage = 'onpageswap' in window && 'onpagereveal' in window &&
    /^https?:$/.test(location.protocol);
  // ponytail: 沿用整張角色做蓄勢；關節動作需要分層素材。
  if (crossPage) {
    samurai.animate([
      { transform: 'translateX(0)' },
      { transform: 'translateX(-2px)' },
    ], { duration: 90, easing: 'ease-out' });
  } else {
    // 不支援跨頁快照／file:// 時，只在本頁出刀一次，仍不阻擋連結。
    blade.classList.add('blade-local');
    samurai.animate([
      { transform: 'rotate(0deg)' },
      { transform: 'translateX(6px) skewX(-1deg)', offset: 0.4 },
      { transform: 'rotate(0deg)' },
    ], { duration: 240, easing: 'ease-out' });
  }
});

// 只捕捉透明的刀光定位框；刀光由目的頁快照的背景繪製，載入時不會凍結。
window.addEventListener('pageswap', event => {
  if (!event.viewTransition || !selectedBook || motionPreference.matches ||
      event.activation?.entry?.url !== selectedBook.href) return;
  for (const element of [samurai, blade]) {
    element.getAnimations().forEach(animation => animation.cancel());
  }
  if (!positionBlade()) return;
  samurai.style.viewTransitionName = 'book-samurai';
  blade.style.viewTransitionName = 'book-blade';
  // 離頁後不排清理回呼：返回快取可能延後執行，誤清下一次選書。
  // 統一在 pageshow／下一次點擊時重設。
});

// 返回快取頁面或中途更改動畫偏好時，清掉快照狀態。
window.addEventListener('pageshow', resetBookTransition);
motionPreference.addEventListener('change', resetBookTransition);

window.addEventListener('resize', positionBlade, { passive: true });
window.addEventListener('scroll', positionBlade, { passive: true });

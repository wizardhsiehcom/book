// Derived state (depends on BOOKS from books-data.js)
const allTags = [...new Set(BOOKS.flatMap(b => b.tags))].sort();
let activeTag = null;
let query = "";
let isTransitioning = false;

// Spotlight
document.addEventListener("mousemove", e => {
  document.getElementById("spotlight").style.setProperty("--mx", e.clientX + "px");
  document.getElementById("spotlight").style.setProperty("--my", e.clientY + "px");
});

function renderStats() {
  document.getElementById("stats").innerHTML = `
    <div class="stat">
      <div class="stat-num">${BOOKS.length}</div>
      <div class="stat-label">本書籍</div>
    </div>
    <div class="stat">
      <div class="stat-num">${allTags.length}</div>
      <div class="stat-label">個主題</div>
    </div>
    <div class="stat">
      <div class="stat-num">${new Set(BOOKS.flatMap(b => b.tags.filter(t => t.includes("AI")))).size > 0 ? "AI" : "—"}</div>
      <div class="stat-label">重點領域</div>
    </div>`;
}

function renderFilters() {
  const el = document.getElementById("filters");
  const btns = [
    `<button class="filter-btn ${activeTag === null ? 'active' : ''}" data-tag="__all">全部 (${BOOKS.length})</button>`,
    ...allTags.map(t => {
      const count = BOOKS.filter(b => b.tags.includes(t)).length;
      return `<button class="filter-btn ${activeTag === t ? 'active' : ''}" data-tag="${t}">${t} (${count})</button>`;
    })
  ];
  el.innerHTML = btns.join("");
  el.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      activeTag = btn.dataset.tag === "__all" ? null : btn.dataset.tag;
      renderFilters();
      renderGrid();
    });
  });
}

function renderGrid() {
  const grid = document.getElementById("grid");
  const q = query.toLowerCase();
  const visible = BOOKS.filter(b => {
    const matchTag = activeTag === null || b.tags.includes(activeTag);
    const matchQ = !q || b.title.toLowerCase().includes(q) || b.desc.toLowerCase().includes(q) || b.tags.some(t => t.toLowerCase().includes(q));
    return matchTag && matchQ;
  });

  if (visible.length === 0) {
    grid.innerHTML = `
      <div class="empty">
        <div class="empty-icon">🔍</div>
        <div class="empty-text">找不到符合「${query || activeTag}」的書籍</div>
      </div>`;
    return;
  }

  grid.innerHTML = visible.map((b, i) => {
    const tagsHtml = b.tags.map(t => {
      const s = TAG_COLOR[t] || TAG_DEFAULT;
      return `<span class="card-tag" style="--tc:${s.tc};--tb:${s.tb};--te:${s.te}">${t}</span>`;
    }).join("");

    return `<a class="card" href="${b.href}"
      style="--accent-color:${b.accent};--glow-color:${b.glow};animation-delay:${i * 55}ms">
      <span class="card-icon">${b.icon}</span>
      <span class="card-title">${b.title}</span>
      <span class="card-desc">${b.desc}</span>
      <div class="card-footer">${tagsHtml}</div>
    </a>`;
  }).join("");

  grid.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', e => {
      e.preventDefault();
      if (isTransitioning) return;
      isTransitioning = true;
      slashWithSamurai(() => sliceAndGo(card, card.getAttribute('href')));
    });
  });

  document.getElementById("footer").textContent = `共 ${BOOKS.length} 本 · 先執行 build-books.sh 建置後開啟`;
}

document.getElementById("search").addEventListener("input", e => {
  query = e.target.value;
  renderGrid();
});

// ── Slice-and-navigate ──────────────────────────────────
function slashWithSamurai(onDone) {
  const wrap = document.getElementById('samuraiWrap');
  if (wrap) {
    document.body.classList.add('slashing');
    setTimeout(() => onDone(), 185);
    setTimeout(() => document.body.classList.remove('slashing'), 520);
  } else {
    onDone();
  }
}

function sliceAndGo(card, href) {
  const rect = card.getBoundingClientRect();
  const W = rect.width, H = rect.height;

  const tan30 = Math.tan(Math.PI / 6);
  const leftY  = H / 2 - tan30 * (W / 2);
  const rightY = H / 2 + tan30 * (W / 2);
  const lp = (leftY  / H * 100).toFixed(2) + '%';
  const rp = (rightY / H * 100).toFixed(2) + '%';
  const accent = card.style.getPropertyValue('--accent-color') || '#6366f1';

  const dimmer = document.createElement('div');
  Object.assign(dimmer.style, {
    position: 'fixed', inset: '0', zIndex: '9990',
    background: 'rgba(5,6,15,0)', pointerEvents: 'none',
    transition: 'background 0.2s ease',
  });
  document.body.appendChild(dimmer);

  const lineLen = (W / Math.cos(Math.PI / 6)) + 20;
  const slash = document.createElement('div');
  Object.assign(slash.style, {
    position: 'fixed',
    left:  `${rect.left + W / 2 - lineLen / 2}px`,
    top:   `${rect.top  + H / 2 - 1.5}px`,
    width: `${lineLen}px`, height: '3px',
    background: `linear-gradient(90deg, transparent, #fff 25%, ${accent} 50%, #fff 75%, transparent)`,
    boxShadow: `0 0 10px 3px ${accent}, 0 0 24px 6px ${accent}44`,
    transform: 'rotate(30deg)', transformOrigin: 'center center',
    zIndex: '10001', pointerEvents: 'none',
    opacity: '0', transition: 'opacity 0.04s',
  });
  document.body.appendChild(slash);

  const sharedBase = { left: `${rect.left}px`, top: `${rect.top}px`, width: `${W}px`, height: `${H}px` };
  function makeHalf(clipPath) {
    const el = document.createElement('div');
    el.className = 'slice-half';
    el.innerHTML = card.innerHTML;
    Object.assign(el.style, sharedBase, { clipPath });
    el.style.setProperty('--accent-color', accent);
    el.style.setProperty('--glow-color', card.style.getPropertyValue('--glow-color'));
    document.body.appendChild(el);
    return el;
  }
  const topHalf = makeHalf(`polygon(0 0, 100% 0, 100% ${rp}, 0 ${lp})`);
  const botHalf = makeHalf(`polygon(0 ${lp}, 100% ${rp}, 100% 100%, 0 100%)`);

  card.style.visibility = 'hidden';

  requestAnimationFrame(() => {
    dimmer.style.background = 'rgba(5,6,15,0.78)';
    slash.style.opacity = '1';
    requestAnimationFrame(() => {
      slash.style.transition = 'opacity 0.18s ease 0.04s';
      slash.style.opacity = '0';
      const tx = W * 0.62, ty = 14, rot = 2.8;
      const t = 'transform 0.44s cubic-bezier(0.4,0,0.15,1), opacity 0.36s ease 0.06s';
      topHalf.style.transition = t;
      botHalf.style.transition = t;
      topHalf.style.transform = `translateX(-${tx}px) translateY(-${ty}px) rotate(-${rot}deg)`;
      botHalf.style.transform = `translateX(${tx}px)  translateY(${ty}px)  rotate(${rot}deg)`;
      topHalf.style.opacity = '0';
      botHalf.style.opacity = '0';
    });
  });

  setTimeout(() => { window.location.href = href; }, 100);
}

// ── Init ────────────────────────────────────────────────
renderStats();
renderFilters();
renderGrid();

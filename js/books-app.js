// Derived state (depends on BOOKS from books-data.js)
const allTags = [...new Set(BOOKS.flatMap(b => b.tags))].sort();
let activeTag = null;
let query = "";
function renderStats() {
  document.getElementById("stats").textContent = `${String(BOOKS.length).padStart(2, '0')} 冊藏書　／　${allTags.length} 個主題`;
}

function renderFilters() {
  const el = document.getElementById("filters");
  el.replaceChildren(new Option('全部主題', ''), ...allTags.map(tag => new Option(tag, tag)));
  el.addEventListener('change', () => {
    activeTag = el.value || null;
    renderGrid();
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

  document.getElementById("result-count").textContent = `${visible.length} 冊`;
  if (visible.length === 0) {
    grid.innerHTML = `
      <div class="empty">
        <div class="empty-text"></div>
      </div>`;
    grid.querySelector(".empty-text").textContent = `找不到符合「${query || activeTag}」的書籍`;
    return;
  }

  grid.innerHTML = visible.map(b => `<a class="card" href="${b.href}">
    <span class="card-number">${String(BOOKS.indexOf(b) + 1).padStart(2, '0')}</span>
    <div class="card-body"><h3 class="card-title">${b.title}</h3>
      <p class="card-desc">${b.desc}</p>
      <div class="card-footer">${b.tags.map(t => `<span class="card-tag">${t}</span>`).join('')}</div>
    </div><span class="card-arrow" aria-hidden="true">↗</span>
  </a>`).join("");
}

document.getElementById("search").addEventListener("input", e => {
  query = e.target.value;
  renderGrid();
});

// ── Init ────────────────────────────────────────────────
renderStats();
renderFilters();
renderGrid();

// 手機海報捲離畫面後縮小人物，保留可見的出刀起點。
new IntersectionObserver(([entry]) => {
  document.body.classList.toggle('catalog-scrolled', !entry.isIntersecting);
}, { threshold: 0.25 }).observe(document.querySelector('.poster'));

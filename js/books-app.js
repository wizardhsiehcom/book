// Derived state (depends on BOOKS from books-data.js)
let activeCategory = null;
let query = "";
function renderStats() {
  document.getElementById("stats").textContent = `${String(BOOKS.length).padStart(2, '0')} 冊藏書　／　${CATEGORIES.length} 個分類`;
}

// ponytail: 大寫數字只備到拾，分類超過十個再改成阿拉伯數字。
const NUMERALS = ['壹', '貳', '參', '肆', '伍', '陸', '柒', '捌', '玖', '拾'];

function renderFilters() {
  const el = document.getElementById("categories");
  const all = document.getElementById("category-all");
  all.innerHTML = `全部<span>${BOOKS.length}</span>`;
  el.innerHTML = CATEGORIES.map((c, i) => `<button type="button" class="category" data-category="${c}" aria-pressed="false">
    <span class="catalog-glass" aria-hidden="true"><span class="catalog-glint"></span></span>
    <span class="cat-no">${NUMERALS[i] ?? i + 1}</span><span class="cat-count">${BOOKS.filter(b => b.category === c).length}<small>冊</small></span>
    <span class="cat-name">${c}</span></button>`).join('');
  const select = value => {
    activeCategory = value || null;
    el.querySelectorAll('[data-category]').forEach(b => b.setAttribute('aria-pressed', b.dataset.category === activeCategory));
    all.setAttribute('aria-pressed', activeCategory === null);
    renderGrid();
  };
  // 再點一次已選的分類＝回到全部。
  el.onclick = e => { const b = e.target.closest('[data-category]'); if (b) select(b.dataset.category === activeCategory ? null : b.dataset.category); };
  all.onclick = () => select(null);
}

function renderGrid() {
  const grid = document.getElementById("grid");
  const q = query.toLowerCase();
  const visible = BOOKS.filter(b => {
    const matchCategory = activeCategory === null || b.category === activeCategory;
    const matchQ = !q || b.title.toLowerCase().includes(q) || b.desc.toLowerCase().includes(q) || b.tags.some(t => t.toLowerCase().includes(q));
    return matchCategory && matchQ;
  });

  document.getElementById("result-count").textContent = `${visible.length} 冊`;
  if (visible.length === 0) {
    grid.innerHTML = `
      <div class="empty">
        <div class="empty-text"></div>
      </div>`;
    grid.querySelector(".empty-text").textContent = `找不到符合「${query || activeCategory}」的書籍`;
    return;
  }

  const card = b => `<a class="card" href="${b.href}">
    <span class="catalog-glass" aria-hidden="true"></span>
    <span class="card-hover-art" aria-hidden="true"></span>
    <span class="card-number">${String(BOOKS.indexOf(b) + 1).padStart(2, '0')}</span>
    <div class="card-body"><h3 class="card-title">${b.title}</h3>
      <p class="card-desc">${b.desc}</p>
      <div class="card-footer">${b.tags.map(t => `<span class="card-tag">${t}</span>`).join('')}</div>
    </div><span class="card-arrow" aria-hidden="true">↗</span>
  </a>`;
  // 依分類分卷列出；卷首標示卷次與本卷冊數。
  grid.innerHTML = CATEGORIES.map((c, i) => {
    const books = visible.filter(b => b.category === c);
    return books.length ? `<section class="volume"><h3 class="volume-head"><span class="volume-no">卷${NUMERALS[i] ?? i + 1}</span><span class="volume-name">${c}</span><span class="volume-count">${books.length} 冊</span></h3>${books.map(card).join('')}</section>` : '';
  }).join('');
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

// font-init.js — 頁面載入時讀取 localStorage 字型選擇並套用
(function () {
  var font = localStorage.getItem('bookFont') || 'mingti';
  // 預設 mingti 不需加 class（custom.css 已套用）
  if (font !== 'mingti') {
    document.documentElement.classList.add('font-' + font);
    // Material theme 在 DOMContentLoaded 後才加 body，保險起見兩者都加
    document.addEventListener('DOMContentLoaded', function () {
      document.body.classList.add('font-' + font);
    });
  }
})();

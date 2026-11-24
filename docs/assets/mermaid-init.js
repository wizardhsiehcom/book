(function () {
  function currentScheme() {
    var attr = (document.body && document.body.getAttribute("data-md-color-scheme")) ||
               document.documentElement.getAttribute("data-md-color-scheme");
    if (attr) return attr;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches ? "default" : "slate";
  }

  function mermaidTheme(scheme) {
    return scheme === "default" ? "default" : "dark";
  }

  function renderMermaid() {
    if (typeof mermaid === "undefined") return;
    var nodes = document.querySelectorAll(".mermaid");
    nodes.forEach(function (el) {
      if (!el.hasAttribute("data-mermaid-src")) {
        el.setAttribute("data-mermaid-src", el.textContent || "");
      } else {
        el.removeAttribute("data-processed");
        el.textContent = el.getAttribute("data-mermaid-src");
      }
    });
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: "loose",
      theme: mermaidTheme(currentScheme())
    });
    if (nodes.length > 0) {
      if (typeof mermaid.run === "function") {
        mermaid.run({ nodes: nodes });
      } else if (typeof mermaid.init === "function") {
        mermaid.init(undefined, nodes);
      }
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (typeof mermaid === "undefined") return;
    renderMermaid();
    if (document.body && typeof MutationObserver !== "undefined") {
      var lastScheme = currentScheme();
      new MutationObserver(function () {
        var nextScheme = currentScheme();
        if (nextScheme !== lastScheme) {
          lastScheme = nextScheme;
          renderMermaid();
        }
      }).observe(document.body, { attributes: true, attributeFilter: ["data-md-color-scheme"] });
    }
  });
})();

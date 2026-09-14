// A dedicated selector keeps Material's automatic Mermaid renderer from
// initializing the same diagram a second time. Use the shared Mermaid 10 CDN.
document.addEventListener("DOMContentLoaded", async function () {
  if (typeof mermaid === "undefined") return;
  // SuperFences emits <pre><code>; Mermaid 10 expects diagram text, not
  // that code wrapper. textContent also restores escaped arrow characters.
  document.querySelectorAll(".v5-mermaid").forEach(function (block) {
    const code = block.querySelector("code");
    if (code) block.textContent = code.textContent;
  });
  mermaid.initialize({ startOnLoad: false, securityLevel: "loose", theme: "default" });
  try {
    await mermaid.run({ querySelector: ".v5-mermaid" });
    document.querySelectorAll(".v5-mermaid svg").forEach(function (svg) {
      const width = svg.viewBox.baseVal.width;
      if (width > 0) svg.style.width = width + "px";
      svg.style.maxWidth = "none";
    });
  } catch (error) {
    console.error("V5 diagram rendering failed", error);
  }
});

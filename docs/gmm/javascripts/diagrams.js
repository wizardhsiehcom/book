document.addEventListener("DOMContentLoaded", async function () {
  // Keep Material's automatic Mermaid loader from rendering these diagrams again.
  const nodes = document.querySelectorAll(".gmm-mermaid");
  for (const node of nodes) {
    node.textContent = node.textContent;
  }
  mermaid.initialize({
    startOnLoad: false,
    securityLevel: "loose",
    theme: "default",
  });
  await mermaid.run({ nodes });
});

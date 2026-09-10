document.addEventListener("DOMContentLoaded", async function () {
  // Use a separate class so Material does not start a second Mermaid renderer.
  const nodes = document.querySelectorAll(".csun-mermaid");
  for (const node of nodes) {
    node.textContent = node.textContent;
  }
  mermaid.initialize({
    startOnLoad: false,
    securityLevel: "loose",
    theme: "default",
  });
  await mermaid.run({ nodes });
  for (const node of nodes) {
    const svg = node.querySelector("svg");
    // Scroll wide diagrams instead of shrinking their labels on small screens.
    svg.style.minWidth = `${svg.viewBox.baseVal.width}px`;
  }
});

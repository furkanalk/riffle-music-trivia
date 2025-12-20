document.addEventListener("DOMContentLoaded", initMenuNavigation);

function initMenuNavigation() {
  const menuBtn = document.getElementById("mainMenuBtn");
  if (!menuBtn) {
    console.error("Main menu link not found");
    return;
  }

  const menuPanel = document.getElementById("menu-panel");
  if (menuPanel) {
    enablePanelInteraction(menuPanel);
  }

  normalizeZIndex();
  console.log("Menu navigation system initialized");
}

function enablePanelInteraction(panel) {
  panel.style.pointerEvents = "auto";
  panel.style.cursor = "default";

  panel.addEventListener("mouseenter", () =>
    panel.classList.add("ring-2", "ring-purple-500", "ring-opacity-50")
  );

  panel.addEventListener("mouseleave", () =>
    panel.classList.remove("ring-2", "ring-purple-500", "ring-opacity-50")
  );
}

function normalizeZIndex() {
  document.querySelectorAll(".fixed").forEach(el => {
    if (el.id === "menu-panel") return;
    const z = parseInt(getComputedStyle(el).zIndex || "0");
    el.style.zIndex = Math.min(z, 9000);
  });
}

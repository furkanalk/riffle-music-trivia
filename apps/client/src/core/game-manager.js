// Game mode selector - Now redirects directly to the categories.html page

// Random user name generator for TEST purposes
import { getUser } from "./user-manager.js";

const currentUser = getUser();

console.log(`Rock on! Welcome back, ${currentUser.username}`);
console.log("User Context:", currentUser);

// TEST ends

export function startMode(mode) {
  // Navigate to the categories page with selected mode
  window.location.href = `categories.html?mode=${mode}`;
}

// Game settings utilities
export function saveGameSettings(settings) {
  localStorage.setItem("riffleGameSettings", JSON.stringify(settings));
}

export function loadGameSettings() {
  const saved = localStorage.getItem("riffleGameSettings");
  return saved ? JSON.parse(saved) : null;
}

// Redirect methods for different game modes
export function redirectToGame(mode) {
  window.location.href = `game.html?mode=${mode}`;
}

// Game mode hover effects for videos
document.addEventListener("DOMContentLoaded", () => {
  const gameModesWithVideos = ["marathon", "coop", "versus", "custom"];

  gameModesWithVideos.forEach((mode) => {
    const image = document.querySelector(`.${mode}-image`);
    const video = document.querySelector(`.${mode}`);

    if (image && video) {
      const parent = image.closest("a");

      parent.addEventListener("mouseenter", () => {
        image.style.opacity = "0";
        video.style.opacity = "1";
        video.classList.remove("hidden");
        video.play();
      });

      parent.addEventListener("mouseleave", () => {
        image.style.opacity = "1";
        video.style.opacity = "0";
        video.pause();
        setTimeout(() => {
          if (document.querySelector(":hover") !== parent) {
            video.classList.add("hidden");
          }
        }, 300);
      });
    }
  });
});

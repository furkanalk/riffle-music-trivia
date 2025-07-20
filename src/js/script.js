// src/js/script.js

// This file manages game modes

// Game mode selector - Now redirects directly to the categories.html page
export function startMode(mode) {
  // Navigate to the categories page with selected mode
  window.location.href = `categories.html?mode=${mode}`;
}

// Game settings utilities
export function saveGameSettings(settings) {
  localStorage.setItem('riffleGameSettings', JSON.stringify(settings));
}

export function loadGameSettings() {
  const saved = localStorage.getItem('riffleGameSettings');
  return saved ? JSON.parse(saved) : null;
}

// Redirect methods for different game modes
export function redirectToGame(mode) {
  window.location.href = `game.html?mode=${mode}`;
}

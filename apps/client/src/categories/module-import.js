import { setupGameModeSettings, updateSelectionsSummary, switchTab } from "./category-settings.js";
import { loadCategories, filterCategories, debugCategories } from "./category-filters.js";
import { sendChatMessage } from "./category-chat.js";
import { startGame } from "./category-game.js";
import "./menu-navigation.js";
import { selectedCategories } from "./state.js";

// Init DOM
document.addEventListener("DOMContentLoaded", init);

function init() {
  initGameSettings();
  initStartButton();
  initScrollButtons();
  initAvatarSelection();
  initSettingsListeners();
  initInviteCopy();
  initChat();
  initCategoryFilters();
  initTabs();
}

// Section Initializers
function initGameSettings() {
  setupGameModeSettings();
  updateSelectionsSummary();
  loadCategories();
}

function initStartButton() {
  const btn = document.getElementById("start-game");
  if (!btn) return;
  btn.addEventListener("click", startGame);
  btn.disabled = selectedCategories.length === 0;
}

function initScrollButtons() {
  const container = document.querySelector(".overflow-x-auto");
  document.getElementById("scroll-left")
    ?.addEventListener("click", () => container?.scrollBy({ left: -400, behavior: "smooth" }));
  document.getElementById("scroll-right")
    ?.addEventListener("click", () => container?.scrollBy({ left: 400, behavior: "smooth" }));
}

function initAvatarSelection() {
  const avatars = document.querySelectorAll(".avatar-option");

  avatars.forEach(avatar => {
    avatar.addEventListener("click", () => {
      avatars.forEach(resetAvatar);
      selectAvatar(avatar);
    });
  });
}

function resetAvatar(avatar) {
  avatar.classList.remove("selected", "border-purple-500");
  avatar.classList.add("border-purple-900", "border-opacity-30");
  avatar.querySelector(".checkmark")?.classList.add("hidden");
}

function selectAvatar(avatar) {
  avatar.classList.add("selected", "border-purple-500", "animate-pulse");
  avatar.classList.remove("border-purple-900", "border-opacity-30");
  avatar.querySelector(".checkmark")?.classList.remove("hidden");

  setTimeout(() => avatar.classList.remove("animate-pulse"), 500);
  localStorage.setItem("selectedAvatar", avatar.dataset.avatar);
}

function initSettingsListeners() {
  ["round-count", "question-type", "time-limit", "answer-visibility", "lives-count"]
    .forEach(id =>
      document.getElementById(id)
        ?.addEventListener("change", updateSelectionsSummary)
    );
}

function initInviteCopy() {
  document.getElementById("copy-invite")?.addEventListener("click", () => {
    const link = document.getElementById("invite-link");
    link.select();
    document.execCommand("copy");
    alert("Copy!");
  });
}

function initChat() {
  document.getElementById("send-message")?.addEventListener("click", sendChatMessage);
  document.getElementById("chat-input")
    ?.addEventListener("keypress", e => e.key === "Enter" && sendChatMessage());
}

function initCategoryFilters() {
  const buttons = document.querySelectorAll(".category-filter");

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      buttons.forEach(resetFilterButton);
      activateFilterButton(btn);
      filterCategories(btn.dataset.filter);
    });
  });
}

function resetFilterButton(btn) {
  btn.classList.remove("bg-purple-800", "bg-opacity-80");
  btn.classList.add("bg-purple-600", "bg-opacity-40");
}

function activateFilterButton(btn) {
  btn.classList.remove("bg-purple-600", "bg-opacity-40");
  btn.classList.add("bg-purple-800", "bg-opacity-80");
}

function initTabs() {
  const settingsTab = document.getElementById('tab-settings');
  const chatTab = document.getElementById('tab-chat');

  if (settingsTab) {
    settingsTab.addEventListener('click', () => switchTab('settings'));
  }
  
  if (chatTab) {
    chatTab.addEventListener('click', () => switchTab('chat'));
  }
}

// Debug
window.debugRiffleCategories = debugCategories;

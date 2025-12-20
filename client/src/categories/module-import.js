import { getAllGenres } from "../core/music.js";
import { setupGameModeSettings, switchTab, updateSelectionsSummary } from "./category-settings.js";
import { loadCategories, filterCategories, debugCategories } from "./category-filters.js";
import { sendChatMessage } from "./category-chat.js";
import { startGame } from "./category-game.js";
import "./menu-navigation.js"; 
import { selectedCategories, gameMode } from "./state.js";

// Init
document.addEventListener('DOMContentLoaded', () => {
  setupGameModeSettings();
  updateSelectionsSummary();
  loadCategories();
  
  // Start Button Listener
  const startGameButton = document.getElementById('start-game');
  if (startGameButton) {
      startGameButton.addEventListener('click', startGame);
      startGameButton.disabled = selectedCategories.length === 0;
  }
  
  // UI Event Listeners (Scroll, Avatar, Chat vb...)
  document.getElementById('scroll-left')?.addEventListener('click', () => {
    document.querySelector('.overflow-x-auto')?.scrollBy({ left: -400, behavior: 'smooth' });
  });
  
  document.getElementById('scroll-right')?.addEventListener('click', () => {
    document.querySelector('.overflow-x-auto')?.scrollBy({ left: 400, behavior: 'smooth' });
  });
  
  // Avatar
  document.querySelectorAll('.avatar-option').forEach(avatar => {
    avatar.addEventListener('click', function() {
      document.querySelectorAll('.avatar-option').forEach(opt => {
        opt.classList.remove('selected', 'border-purple-500');
        opt.classList.add('border-purple-900', 'border-opacity-30');
        opt.querySelector('.checkmark')?.classList.add('hidden');
      });
      
      this.classList.add('selected', 'border-purple-500');
      this.classList.remove('border-purple-900', 'border-opacity-30');
      this.querySelector('.checkmark')?.classList.remove('hidden');
      
      this.classList.add('animate-pulse');
      setTimeout(() => this.classList.remove('animate-pulse'), 500);
      
      localStorage.setItem('selectedAvatar', this.getAttribute('data-avatar'));
    });
  });
  
  // Settings Change
  ['round-count', 'question-type', 'time-limit', 'answer-visibility', 'lives-count'].forEach(id => {
    document.getElementById(id)?.addEventListener('change', updateSelectionsSummary);
  });
  
  // Copy Invite
  document.getElementById('copy-invite')?.addEventListener('click', () => {
    const link = document.getElementById('invite-link');
    link.select();
    document.execCommand('copy');
    alert('Copy!');
  });
  
  // Chat
  document.getElementById('send-message')?.addEventListener('click', sendChatMessage);
  document.getElementById('chat-input')?.addEventListener('keypress', (e) => { if(e.key==='Enter') sendChatMessage() });

  // Filters
  document.querySelectorAll('.category-filter').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.category-filter').forEach(b => {
        b.classList.remove('bg-purple-800', 'bg-opacity-80');
        b.classList.add('bg-purple-600', 'bg-opacity-40');
      });
      btn.classList.remove('bg-purple-600', 'bg-opacity-40');
      btn.classList.add('bg-purple-800', 'bg-opacity-80');
      filterCategories(btn.dataset.filter);
    });
  });
});

window.debugRiffleCategories = debugCategories;
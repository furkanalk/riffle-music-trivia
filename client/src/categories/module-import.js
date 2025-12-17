// Import file for category page
import { getAllGenres, getRandomTrackFromGenre } from "../core/music.js";
import { startMode } from "../core/game-manager.js";

// Import category selection and settings from other modules
import { setupGameModeSettings, loadSavedModeSettings, switchTab, updateSelectionsSummary } from "./category-settings.js";
import { loadCategories, toggleCategory, filterCategories, debugCategories } from "./category-filters.js";
import { sendChatMessage, escapeHTML } from "./category-chat.js";
import { startGame } from "./category-game.js";

// Get mode parameter from URL
// Create URLSearchParams object
const urlParams = new URLSearchParams(window.location.search);

// Get 'mode' parameter
const modeParam = urlParams.get('mode');

// Marathon/solo eşleştirmesi ve son gameMode değerini belirle
// NOTE: Marathon is 'marathon' in URL, but 'solo' in code
let gameMode = modeParam || 'solo';

// If URL has 'marathon', use 'solo' in our code
if (modeParam === 'marathon') {
    gameMode = 'solo';
}

// Game mode title function removed as the element is no longer displayed

// Game mode title has been removed from UI per request
// But we'll keep track of the mode internally
export const modeTitles = {
  'solo': 'Marathon Mode',
  'coop': 'Cooperative Mode',
  'versus': 'Solo VS Mode',
  'team': 'Team VS Mode',
  'chaos': 'Chaos Mode',
  'custom': 'Custom Mode'
};

// Current game mode title is tracked internally

// Variables to track categories
let selectedCategories = [];

// Update selections panel when mode changes
// Call updateSelectionsSummary() function after selectedCategories is defined

// Şu anki filtreyi takip et
let currentFilter = 'all';

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
  // Set up for the current game mode
  
  // Configure UI based on game mode - setup all game mode settings in one place
  setupGameModeSettings();
  
  // Update selections
  updateSelectionsSummary();
  
  // Check again after 500ms for late-loaded elements
  setTimeout(() => {
    // Verify UI elements are properly displayed
  }, 500);
  
  // Tab switching
  document.getElementById('tab-settings').addEventListener('click', () => switchTab('settings'));
  document.getElementById('tab-chat').addEventListener('click', () => switchTab('chat'));
  
  // Load categories
  loadCategories();
  
  // Start button event
  const startGameButton = document.getElementById('start-game');
  startGameButton.addEventListener('click', startGame);
  
  // Start button should be disabled initially until a category is selected
  startGameButton.disabled = true;
  
  // Category horizontal scroll buttons
  document.getElementById('scroll-left').addEventListener('click', () => {
    const container = document.querySelector('.overflow-x-auto');
    container.scrollBy({ left: -400, behavior: 'smooth' });
  });
  
  document.getElementById('scroll-right').addEventListener('click', () => {
    const container = document.querySelector('.overflow-x-auto');
    container.scrollBy({ left: 400, behavior: 'smooth' });
  });
  
  // Avatar selection
  document.querySelectorAll('.avatar-option').forEach(avatar => {
    avatar.addEventListener('click', function() {
      // Remove selection from all avatars
      document.querySelectorAll('.avatar-option').forEach(opt => {
        opt.classList.remove('selected', 'border-purple-500');
        opt.classList.add('border-purple-900', 'border-opacity-30');
        // Hide checkmark
        const checkmark = opt.querySelector('.checkmark');
        if (checkmark) checkmark.classList.add('hidden');
      });
      
      // Add selection to clicked avatar
      this.classList.add('selected', 'border-purple-500');
      this.classList.remove('border-purple-900', 'border-opacity-30');
      // Show checkmark
      const checkmark = this.querySelector('.checkmark');
      if (checkmark) checkmark.classList.remove('hidden');
      
      // Visual feedback animation
      this.classList.add('animate-pulse');
      setTimeout(() => {
        this.classList.remove('animate-pulse');
      }, 500);
      
      // Store selection in localStorage
      const selectedAvatar = this.getAttribute('data-avatar');
      localStorage.setItem('selectedAvatar', selectedAvatar);
    });
  });
  
  // Update selections panel when settings change
  const settingsFields = ['round-count', 'question-type', 'time-limit', 'answer-visibility', 'lives-count'];
  settingsFields.forEach(fieldId => {
    const element = document.getElementById(fieldId);
    if (element) {
      element.addEventListener('change', updateSelectionsSummary);
    }
  });
  
  // Initialize the copy invite link functionality
  document.getElementById('copy-invite').addEventListener('click', () => {
    const inviteLink = document.getElementById('invite-link');
    inviteLink.select();
    document.execCommand('copy');
    alert('Invite link copied!');
  });
  
  // Initialize chat
  document.getElementById('send-message').addEventListener('click', sendChatMessage);
  document.getElementById('chat-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendChatMessage();
  });

  // Filter categories
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

// Global hata ayıklama fonksiyonu
window.debugRiffleCategories = debugCategories;

// Global değişkenleri export edelim
export { gameMode, selectedCategories, currentFilter };

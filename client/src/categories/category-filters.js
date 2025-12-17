// Category filtering and management
import { gameMode, selectedCategories, currentFilter } from './module-import.js';
import { getAllGenres } from '../core/music.js';
import { updateSelectionsSummary } from './category-settings.js';

// Load music categories
function loadCategories() {
  const categoriesGrid = document.getElementById('categories-grid');
  const genres = getAllGenres();
  
  genres.forEach(genre => {
    const card = document.createElement('div');
    card.className = `category-card fade-in bg-black bg-opacity-60 border border-purple-600 rounded-xl p-5 cursor-pointer transition-all duration-300`;
    card.style.width = '200px';
    card.style.height = '160px';
    // Set proper data attribute for filtering
    card.setAttribute('data-type', genre.type);
    card.dataset.id = genre.id;
    
    // Create icon based on genre type
    let icon = '';
    if (genre.type === 'rock') {
      icon = '<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mb-2 mx-auto text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg>';
    } else if (genre.type === 'metal') {
      icon = '<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mb-2 mx-auto text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>';
    } else if (genre.type === 'turkish') {
      icon = '<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mb-2 mx-auto text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" /></svg>';
    } else if (genre.type === 'artist') {
      icon = '<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mb-2 mx-auto text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>';
    } else {
      icon = '<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mb-2 mx-auto text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg>';
    }
    
    card.innerHTML = `
      <div class="h-full flex flex-col">
        <div class="text-center mb-3 relative">
          <span class="category-check inline-block w-6 h-6 rounded-full border-2 border-purple-500 absolute top-0 right-0"></span>
          ${icon}
        </div>
        <h3 class="text-white text-center font-bold text-lg mb-1">${genre.name}</h3>
        <div class="mt-auto pt-2">
          <div class="text-xs text-purple-300 text-center px-2 py-1 bg-purple-900 bg-opacity-30 rounded-full inline-block mx-auto">${genre.type === 'artist' ? 'Artist' : genre.era.toUpperCase()}</div>
        </div>
      </div>
    `;
    
    card.addEventListener('click', () => toggleCategory(card, genre.id));
    categoriesGrid.appendChild(card);
    
    // Pre-select if it was in saved settings
    if (selectedCategories && selectedCategories.includes(genre.id)) {
      toggleCategory(card, genre.id);
    }
  });
}

// Toggle category selection
function toggleCategory(card, id) {
  const index = selectedCategories.indexOf(id);
  if (index > -1) {
    selectedCategories.splice(index, 1);
    card.classList.remove('bg-purple-900', 'bg-opacity-30');
    card.querySelector('.category-check').classList.remove('bg-purple-500');
  } else {
    selectedCategories.push(id);
    card.classList.add('bg-purple-900', 'bg-opacity-30');
    card.querySelector('.category-check').classList.add('bg-purple-500');
  }
  
  // Enable/disable start button based on selection
  document.getElementById('start-game').disabled = selectedCategories.length === 0;
  
  // Update the selections panel
  updateSelectionsSummary();
  
  // Add a subtle animation to the selections panel to draw attention
  const selectionsPanel = document.getElementById('selections-panel');
  selectionsPanel.classList.add('scale-105', 'shadow-xl');
  setTimeout(() => {
    selectionsPanel.classList.remove('scale-105', 'shadow-xl');
  }, 300);
}

// Filter categories by type with staggered animations
function filterCategories(filter) {
  const cards = document.querySelectorAll('.category-card');
  const cardsArray = Array.from(cards);
  
  // Update the filter state
  window.currentFilter = filter;
  console.log(`Filtering by: ${filter}`);
  
  // Debug - show all category types
  if (filter === 'debug') {
    cards.forEach(card => {
      const type = card.getAttribute('data-type');
      console.log(`Card ID: ${card.dataset.id}, Type: ${type}`);
      card.classList.add('fade-in');
      card.classList.remove('fade-out');
      setTimeout(() => { card.style.display = 'block'; }, 50);
    });
    return;
  }
  
  // Create arrays to track which cards will be shown vs hidden
  const cardsToShow = [];
  const cardsToHide = [];
  
  // Separate cards into show/hide groups
  cardsArray.forEach(card => {
    const categoryType = card.getAttribute('data-type');
    if (filter === 'all' || categoryType === filter) {
      cardsToShow.push(card);
    } else {
      cardsToHide.push(card);
    }
  });
  
  // First, animate out all cards that need to be hidden (staggered)
  cardsToHide.forEach((card, index) => {
    setTimeout(() => {
      card.classList.add('fade-out');
      card.classList.remove('fade-in');
      
      // Hide after animation completes
      setTimeout(() => {
        card.style.display = 'none';
      }, 500);
    }, index * 50); // 50ms staggered delay
  });
  
  // Then, animate in all cards that should be shown (staggered)
  cardsToShow.forEach((card, index) => {
    setTimeout(() => {
      // Make sure it's displayed
      card.style.display = 'block';
      
      // Trigger the animation
      setTimeout(() => {
        card.classList.add('fade-in');
        card.classList.remove('fade-out');
      }, 20);
    }, 300 + (index * 70)); // Delay by 300ms + staggered 70ms
  });
  
  // Log for debugging
  console.log(`Filtering complete. Visible categories: ${cardsToShow.length}`);
}

// Debug function to show all category cards with their attributes
function debugCategories() {
  const cards = document.querySelectorAll('.category-card');
  console.log(`Total categories: ${cards.length}`);
  
  cards.forEach(card => {
    console.log({
      id: card.dataset.id,
      type: card.getAttribute('data-type'),
      display: card.style.display,
      classList: Array.from(card.classList)
    });
  });
}

export { loadCategories, toggleCategory, filterCategories, debugCategories };

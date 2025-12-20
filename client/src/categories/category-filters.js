// Category filtering and management
import { selectedCategories } from './module-import.js';
import { getAllGenres } from '../core/music.js';

// Load music categories
export function loadCategories() {
  const categoriesGrid = document.getElementById('categories-grid');
  const genres = getAllGenres();
  
  if (!categoriesGrid) return;

  // Clear grid first
  categoriesGrid.innerHTML = '';
  
  genres.forEach((genre, index) => {
    // Veri yapısındaki 'category' alanını kullanıyoruz
    const categoryType = (genre.category || genre.type || 'mixed').toLowerCase();
    
    const card = document.createElement('div');
    card.className = `category-card bg-black bg-opacity-60 border border-purple-600 rounded-xl p-5 cursor-pointer transition-all duration-300 transform hover:scale-105 opacity-0`; 
    card.style.width = '200px';
    card.style.height = '160px';
    
    // Set proper data attribute
    card.dataset.id = genre.id;
    card.dataset.category = categoryType;
    
    // Icon Logic
    let icon = '';
    if (categoryType.includes('rock')) {
      icon = '<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mb-2 mx-auto text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg>';
    } else if (categoryType.includes('metal')) {
      icon = '<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mb-2 mx-auto text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>';
    } else if (categoryType.includes('turkish')) {
      icon = '<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mb-2 mx-auto text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" /></svg>';
    } else if (categoryType.includes('artist')) {
      icon = '<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mb-2 mx-auto text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>';
    } else {
      icon = '<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mb-2 mx-auto text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg>';
    }
    
    card.innerHTML = `
      <div class="h-full flex flex-col pointer-events-none">
        <div class="text-center mb-3 relative">
          <span class="category-check inline-block w-6 h-6 rounded-full border-2 border-purple-500 absolute top-0 right-0 transition-colors duration-300"></span>
          ${icon}
        </div>
        <h3 class="text-white text-center font-bold text-lg mb-1">${genre.name}</h3>
        <div class="mt-auto pt-2">
          <div class="text-xs text-purple-300 text-center px-2 py-1 bg-purple-900 bg-opacity-30 rounded-full inline-block mx-auto">
            ${categoryType === 'artist' ? 'Artist' : (genre.era || categoryType).toUpperCase()}
          </div>
        </div>
      </div>
    `;
        
    categoriesGrid.appendChild(card);
    
    // Entrance Animation
    setTimeout(() => {
        card.classList.remove('opacity-0');
    }, 100 + (index * 50));
    
    // Pre-select check
    if (selectedCategories && selectedCategories.includes(genre.id)) {
      toggleCategory(genre.id);
    }
  });
}

// Toggle category selection
export function toggleCategory(id) {
  const card = document.querySelector(`.category-card[data-id="${id}"]`);
  if (!card) return;

  const index = selectedCategories.indexOf(id);
  
  if (index > -1) {
    // Remove
    selectedCategories.splice(index, 1);
    card.classList.remove('bg-purple-900', 'bg-opacity-30');
    card.querySelector('.category-check').classList.remove('bg-purple-500');
  } else {
    // Add
    selectedCategories.push(id);
    card.classList.add('bg-purple-900', 'bg-opacity-30');
    card.querySelector('.category-check').classList.add('bg-purple-500');
  }
  
  // Animation for panel
  const selectionsPanel = document.getElementById('selections-panel');
  if (selectionsPanel) {
    selectionsPanel.classList.add('scale-105', 'shadow-xl');
    setTimeout(() => {
        selectionsPanel.classList.remove('scale-105', 'shadow-xl');
    }, 300);
  }
}

// Filter categories by type
export function filterCategories(filter) {
  const cards = document.querySelectorAll('.category-card');
  const cardsArray = Array.from(cards);
  
  window.currentFilter = filter;
  console.log(`Filtering by: ${filter}`);
  
  const cardsToShow = [];
  const cardsToHide = [];
  
  cardsArray.forEach(card => {
    // Safe access to data attribute
    const categoryType = card.dataset.category;
    
    if (filter === 'all' || (categoryType && categoryType.includes(filter))) {
      cardsToShow.push(card);
    } else {
      cardsToHide.push(card);
    }
  });
  
  // Hide Animation
  cardsToHide.forEach((card, index) => {
    setTimeout(() => {
      card.classList.add('opacity-0', 'scale-95'); // Fade out
      setTimeout(() => {
        card.style.display = 'none';
      }, 300);
    }, index * 30);
  });
  
  // Show Animation
  cardsToShow.forEach((card, index) => {
    setTimeout(() => {
      card.style.display = 'block';
      // Trigger reflow
      void card.offsetWidth; 
      
      card.classList.remove('opacity-0', 'scale-95'); // Fade in
      card.classList.add('opacity-100', 'scale-100');
    }, 300 + (index * 50));
  });
}

// Debug function  (can be removed later)
export function debugCategories() {
  const cards = document.querySelectorAll('.category-card');
  console.log(`Total categories: ${cards.length}`);
  console.log('Selected:', selectedCategories);
}
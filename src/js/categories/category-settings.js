// Category settings and UI control
import { gameMode, selectedCategories } from './module-import.js';
import { getAllGenres } from '../core/music.js';

// Configure UI settings based on game mode
function setupGameModeSettings() {
  // Setup game mode settings for current mode
  
  // Let's read the URL parameter again for validation
  const currentUrlMode = new URLSearchParams(window.location.search).get('mode');
  // URL parameter check
  
  const answerVisibilityContainer = document.getElementById('answer-visibility-container');
  const livesContainer          = document.getElementById('lives-container');
  const roundCountSelect        = document.getElementById('round-count');
  const marathonDisplay         = document.getElementById('marathon-unlimited-display');
  const marathonBadge           = document.getElementById('marathon-badge');
  const marathonBadgeLives      = document.getElementById('marathon-badge-lives');
  
  // Check if elements exist

  // Mode check
  
  if (gameMode === 'solo' || gameMode === 'marathon') {   // ====== MARATHON ======
    /* 1. Select'i devre dışı bırak */
    if (roundCountSelect) {
      roundCountSelect.value    = 'unlimited';
      roundCountSelect.disabled = true;
      roundCountSelect.classList.add('disabled-select');   // görsel
      roundCountSelect.style.display = 'none';  // Açıkça gizle
      roundCountSelect.removeEventListener('change', updateSelectionsSummary);
    }

    /* 2. Visibility controls */
    if (marathonDisplay) {
      marathonDisplay.classList.remove('hidden');
      marathonDisplay.style.display = 'block';  // Açıkça göster
      marathonDisplay.style.visibility = 'visible';
    }
    if (marathonBadge)      marathonBadge.classList.remove('hidden');
    if (marathonBadgeLives) marathonBadgeLives.classList.remove('hidden');

    if (answerVisibilityContainer) {
      answerVisibilityContainer.classList.add('hidden');
      answerVisibilityContainer.style.display = 'none';
      answerVisibilityContainer.style.visibility = 'hidden';
      answerVisibilityContainer.style.position = 'absolute';
      answerVisibilityContainer.style.pointerEvents = 'none';
      answerVisibilityContainer.style.opacity = '0';
      // MARATHON MODE: Answer visibility successfully hidden
    } else {
      console.error("✗ HATA: answerVisibilityContainer bulunamadı!");
    }
    
    // Can hakkını göster
    if (livesContainer) {
      livesContainer.classList.remove('hidden');
      livesContainer.style.display = 'block';
      livesContainer.style.visibility = 'visible';
      livesContainer.style.opacity = '1';
      livesContainer.style.pointerEvents = 'auto';
      // MARATHON MODE: Lives successfully displayed
      
      // Lives için marathon badge'i göster
      if (marathonBadgeLives) {
        marathonBadgeLives.classList.remove('hidden');
        // MARATHON MODE: Marathon badge displayed for lives
      }
    } else {
      console.error("✗ HATA: livesContainer bulunamadı!");
    }

  } else {                   // ====== DİĞER MODLAR ======
    /* 3. Select'i tekrar etkinleştir */
    if (roundCountSelect) {
      roundCountSelect.disabled = false;
      roundCountSelect.classList.remove('disabled-select');
      roundCountSelect.style.display = 'block';  // Açıkça göster
      // Varsayılan değere dönsün (10) veya sakladığınız ayar neyse onu bırakın
      if (roundCountSelect.value === 'unlimited') {
        roundCountSelect.value = '10';
      }
      // Re-add the listener (add once check!)
      if (!roundCountSelect.hasAttribute('data-listener')) {
        roundCountSelect.addEventListener('change', updateSelectionsSummary);
        roundCountSelect.setAttribute('data-listener', 'true');
      }
    }

    if (marathonDisplay) {
      marathonDisplay.classList.add('hidden');
      marathonDisplay.style.display = 'none';
      marathonDisplay.style.visibility = 'hidden';
    }
    if (marathonBadge)      marathonBadge.classList.add('hidden');
    if (marathonBadgeLives) marathonBadgeLives.classList.add('hidden');

    // Cevap görünürlük ayarını göster
    if (answerVisibilityContainer) {
      answerVisibilityContainer.classList.remove('hidden');
      answerVisibilityContainer.style.display = 'block';
      answerVisibilityContainer.style.visibility = 'visible';
      answerVisibilityContainer.style.position = 'static';
      answerVisibilityContainer.style.pointerEvents = 'auto';
      answerVisibilityContainer.style.opacity = '1';
      // OTHER MODES: Answer visibility successfully displayed
    } else {
      console.error("✗ HATA: answerVisibilityContainer bulunamadı!");
    }
    
    // Lives ayarını gizle
    if (livesContainer) {
      livesContainer.classList.add('hidden');
      livesContainer.style.display = 'none';
      livesContainer.style.visibility = 'hidden';
      // OTHER MODES: Lives successfully hidden
    } else {
      console.error("✗ HATA: livesContainer bulunamadı!");
    }
  }

  loadSavedModeSettings();
}

// Load saved settings for the current game mode
function loadSavedModeSettings() {
  const savedSettings = localStorage.getItem(`riffleSettings_${gameMode}`);
  if (savedSettings) {
    try {
      const settings = JSON.parse(savedSettings);
      
      // Apply saved settings to form
      if (settings.rounds) {
        // For Marathon mode (solo), always use unlimited questions
        if (gameMode === 'solo') {
          // Set the hidden input instead of the dropdown
          document.getElementById('marathon-round-count-hidden').value = 'unlimited';
          // Make sure the marathon display is shown and dropdown is hidden
          const roundCountSelect = document.getElementById('round-count');
          const marathonDisplay = document.getElementById('marathon-unlimited-display');
          if (roundCountSelect) roundCountSelect.classList.add('hidden');
          if (marathonDisplay) marathonDisplay.classList.remove('hidden');
        } else {
          document.getElementById('round-count').value = settings.rounds;
        }
      }
      
      if (settings.questionType) {
        document.getElementById('question-type').value = settings.questionType;
      }
      
      if (settings.timeLimit) {
        document.getElementById('time-limit').value = settings.timeLimit;
      }
      
      // Load lives setting for marathon mode
      if (settings.lives && gameMode === 'solo' && document.getElementById('lives-count')) {
        document.getElementById('lives-count').value = settings.lives;
      }
      
      // Load avatar if saved
      const savedAvatar = localStorage.getItem('selectedAvatar');
      if (savedAvatar) {
        document.querySelectorAll('.avatar-option').forEach(option => {
          if (option.getAttribute('data-avatar') === savedAvatar) {
            // Remove selected from all options first
            document.querySelectorAll('.avatar-option').forEach(opt => {
              opt.classList.remove('selected', 'border-purple-500');
              opt.classList.add('border-purple-900', 'border-opacity-30');
              // Hide all checkmarks
              const checkmark = opt.querySelector('.checkmark');
              if (checkmark) checkmark.classList.add('hidden');
            });
            
            // Add selected to this option
            option.classList.add('selected', 'border-purple-500');
            option.classList.remove('border-purple-900', 'border-opacity-30');
            // Show this checkmark
            const checkmark = option.querySelector('.checkmark');
            if (checkmark) checkmark.classList.remove('hidden');
          }
        });
      }
      
      // If categories were saved, pre-select them
      if (settings.categories && settings.categories.length > 0) {
        window.selectedCategories = settings.categories;
        // Note: Categories will be selected visually after they are loaded
      }
    } catch (e) {
      console.error('Failed to load saved settings:', e);
    }
  }
}

// Switch between settings and chat tabs
function switchTab(tab) {
  const settingsPanel = document.getElementById('settings-panel');
  const chatPanel = document.getElementById('chat-panel');
  const settingsTab = document.getElementById('tab-settings');
  const chatTab = document.getElementById('tab-chat');
  
  if (tab === 'settings') {
    settingsPanel.classList.remove('hidden');
    chatPanel.classList.add('hidden');
    settingsTab.classList.add('bg-purple-800', 'bg-opacity-80');
    settingsTab.classList.remove('bg-purple-600', 'bg-opacity-40');
    chatTab.classList.add('bg-purple-600', 'bg-opacity-40');
    chatTab.classList.remove('bg-purple-800', 'bg-opacity-80');
  } else {
    settingsPanel.classList.add('hidden');
    chatPanel.classList.remove('hidden');
    chatTab.classList.add('bg-purple-800', 'bg-opacity-80');
    chatTab.classList.remove('bg-purple-600', 'bg-opacity-40');
    settingsTab.classList.add('bg-purple-600', 'bg-opacity-40');
    settingsTab.classList.remove('bg-purple-800', 'bg-opacity-80');
  }
}

// Update the selections panel with current game mode and category selections
function updateSelectionsSummary() {
  // Security check - is selectedCategories defined?
  if (typeof selectedCategories === 'undefined') {
    console.warn('updateSelectionsSummary: selectedCategories henüz tanımlanmamış, güncelleme atlanıyor');
    return;
  }
  
  // Get the currently selected game mode
  const modeDisplay = document.getElementById('selection-game-mode');
  if (modeDisplay) {
    const modeName = {
      'solo': 'Marathon',
      'coop': 'Cooperative',
      'versus': 'Versus',
      'team': 'Team',
      'chaos': 'Chaos',
      'custom': 'Custom'
    }[gameMode] || 'Marathon';
    
    modeDisplay.textContent = modeName + ' Mode';
  }
  
  // Update the categories list
  const categoriesList = document.getElementById('selected-categories-list');
  if (categoriesList) {
    // Clear existing categories
    categoriesList.innerHTML = '';
    
    if (selectedCategories.length === 0) {
      // No categories selected yet
      const noCategories = document.createElement('li');
      noCategories.className = 'text-purple-300 text-sm italic';
      noCategories.textContent = 'No categories selected';
      categoriesList.appendChild(noCategories);
    } else {
      // Get all genre data
      const allGenres = getAllGenres();
      
      // Add each selected category
      selectedCategories.forEach(id => {
        const genre = allGenres.find(g => g.id === id);
        if (genre) {
          const item = document.createElement('li');
          item.className = 'mb-2 flex items-center rounded-full bg-purple-900 bg-opacity-50 px-3 py-1 text-white text-sm';
          item.innerHTML = `
            <span class="w-2 h-2 rounded-full bg-purple-400 mr-2"></span>
            ${genre.name}
          `;
          categoriesList.appendChild(item);
        }
      });
    }
  }
  
  // Update the question count
  const questionsDisplay = document.getElementById('selection-questions');
  if (questionsDisplay) {
    // Always show Unlimited Questions for Marathon mode, otherwise use the selected value
    if (gameMode === 'solo') {
      questionsDisplay.textContent = 'Unlimited Questions (Marathon Mode)';
    } else {
      const roundCount = document.getElementById('round-count').value;
      questionsDisplay.textContent = roundCount === 'unlimited' ? 'Unlimited Questions' : `${roundCount} Questions`;
    }
  }
  
  // Update answer time
  const timeDisplay = document.getElementById('selection-time');
  if (timeDisplay) {
    const timeLimit = document.getElementById('time-limit').value;
    timeDisplay.textContent = `${timeLimit} seconds per answer`;
  }
  
  // Update question type
  const questionTypeDisplay = document.getElementById('selection-question-type');
  if (questionTypeDisplay) {
    const questionType = document.getElementById('question-type').value;
    const questionTypeLabels = {
      'song': 'Song Title Questions',
      'artist': 'Artist/Band Questions',
      'mixed': 'Mixed Questions',
      'guitarist': 'Guitarist Questions (Hard!)'
    };
    questionTypeDisplay.textContent = questionTypeLabels[questionType] || 'Mixed Questions';
  }
  
  // Update answer visibility (only for multiplayer modes)
  const visibilityContainer = document.getElementById('selection-visibility-container');
  const visibilityDisplay = document.getElementById('selection-visibility');
  
  if (visibilityContainer && visibilityDisplay) {
    // Only show visibility for multiplayer modes, not for Marathon mode
    if (gameMode !== 'solo') {
      visibilityContainer.style.display = 'flex';
      visibilityContainer.style.visibility = 'visible';
      visibilityContainer.style.opacity = '1';
      // Check if answer-visibility element exists and get its value
      const answerVisibilityElement = document.getElementById('answer-visibility');
      if (answerVisibilityElement) {
        const visibility = answerVisibilityElement.value;
        const visibilityLabels = {
          'visible': 'Answers Visible to All',
          'hidden': 'Answers Hidden Until Round End',
          'individual': 'Answers Only Visible to Answerer'
        };
        visibilityDisplay.textContent = visibilityLabels[visibility] || 'Answers Visible to All';
      }
    } else {
      // Hide answer visibility for Marathon mode
      visibilityContainer.style.display = 'none';
      visibilityContainer.style.visibility = 'hidden';
      visibilityContainer.style.opacity = '0';
    }
  }
  
  // Update lives (only for marathon mode)
  const livesContainer = document.getElementById('selection-lives-container');
  const livesDisplay = document.getElementById('selection-lives');
  
  if (livesContainer && livesDisplay) {
    // Only show lives for marathon mode
    if (gameMode === 'solo') {
      livesContainer.style.display = 'flex';
      livesContainer.style.visibility = 'visible';
      livesContainer.style.opacity = '1';
      const livesCount = document.getElementById('lives-count').value;
      
      if (livesCount === '0') {
        livesDisplay.textContent = 'No Lives - One Strike Out';
      } else if (livesCount === 'unlimited') {
        livesDisplay.textContent = 'Unlimited Lives (Practice)';
      } else {
        livesDisplay.textContent = `${livesCount} Lives`;
      }
    } else {
      livesContainer.style.display = 'none';
      livesContainer.style.visibility = 'hidden';
      livesContainer.style.opacity = '0';
    }
  }
}

// Listen for changes that affect the selections panel
document.addEventListener('DOMContentLoaded', () => {
  // Initial update
  updateSelectionsSummary();
  
  // Update when categories change
  const observer = new MutationObserver(updateSelectionsSummary);
  const categoriesGrid = document.getElementById('categories-grid');
  
  // Update when game settings change
  document.getElementById('round-count').addEventListener('change', updateSelectionsSummary);
  document.getElementById('time-limit').addEventListener('change', updateSelectionsSummary);
  document.getElementById('question-type').addEventListener('change', updateSelectionsSummary);
  document.getElementById('lives-count').addEventListener('change', updateSelectionsSummary);
  
  // Also update when game mode changes
  document.querySelectorAll('.mode-option').forEach(option => {
    option.addEventListener('click', updateSelectionsSummary);
  });
  if (categoriesGrid) {
    observer.observe(categoriesGrid, { childList: true, subtree: true, attributes: true });
  }
  
  // Update when settings change
  document.getElementById('round-count').addEventListener('change', updateSelectionsSummary);
  document.getElementById('time-limit').addEventListener('change', updateSelectionsSummary);
  
  // Update when any category is clicked
  document.addEventListener('click', event => {
    if (event.target.closest('.category-card')) {
      // Need a small delay to allow toggleCategory to complete first
      setTimeout(updateSelectionsSummary, 100);
    }
  });
});

export { setupGameModeSettings, loadSavedModeSettings, switchTab, updateSelectionsSummary };

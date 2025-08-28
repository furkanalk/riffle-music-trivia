// Direct event listener for the main menu button
    document.addEventListener('DOMContentLoaded', function() {
      const mainMenuBtn = document.getElementById('mainMenuBtn');
      if (mainMenuBtn) {
        mainMenuBtn.addEventListener('click', function() {
          // Main menu button clicked handler
          window.location.href = '../index.html';
        });
        // Main menu button handler initialized
      } else {
        console.error('Main menu button not found');
      }
    });
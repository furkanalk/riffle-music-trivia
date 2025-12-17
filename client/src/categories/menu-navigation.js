// Menü yönlendirme ve navigasyon

// Enhanced event listener for the main menu link with multiple approaches
document.addEventListener('DOMContentLoaded', function() {
  // Get the main menu link
  const mainMenuLink = document.getElementById('mainMenuBtn');
  
  if (mainMenuLink) {
    // No need for click handler, the anchor tag already works
    
    // Make sure all parent elements are clickable
    const menuPanel = document.getElementById('menu-panel');
    if (menuPanel) {
      // Apply specific styles to ensure clickability
      menuPanel.style.pointerEvents = 'auto';
      menuPanel.style.cursor = 'default';
      
      // Add visual feedback on hover
      menuPanel.addEventListener('mouseenter', function() {
        this.classList.add('ring-2', 'ring-purple-500', 'ring-opacity-50');
      });
      
      menuPanel.addEventListener('mouseleave', function() {
        this.classList.remove('ring-2', 'ring-purple-500', 'ring-opacity-50');
      });
    }
    
    // Force reset any potential interference
    document.querySelectorAll('.fixed').forEach(el => {
      if (el.id !== 'menu-panel') {
        el.style.zIndex = Math.min(parseInt(window.getComputedStyle(el).zIndex || '0'), 9000);
      }
    });
    
    console.log('Menu navigation system initialized');
  } else {
    console.error('Main menu link not found');
  }
});

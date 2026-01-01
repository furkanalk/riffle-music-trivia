// STATE MANAGEMENT FOR CATEGORIES
const urlParams = new URLSearchParams(window.location.search);
const modeParam = urlParams.get('mode');

export let gameMode = (modeParam === 'marathon' ? 'solo' : (modeParam || 'solo'));
export const selectedCategories = [];

// Debugging purpose - expose to global window object
window.riffleState = {
    selectedCategories,
    gameMode
};
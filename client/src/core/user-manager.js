// GUEST & USER MANAGEMENT

// Rock & Metal Theme Adjectives
const adjectives = [
  "Heavy", "Dark", "Neon", "Thunder", "Iron", "Electric", "Crazy", "Holy",
  "Unholy", "Rusty", "Broken", "Twisted", "Screaming", "Silent", "Loud",
  "Wild", "Rebel", "Mad", "Vicious", "Grim", "Savage", "Wicked", "Fuzz",
  "Doom", "Speed", "Thrash", "Acid", "Black", "Crimson", "Sonic", "Solar",
  "Lunar", "Cyber", "Retro", "Epic", "Fatal", "Brutal", "Toxic", "Rapid",
  "Steel", "Golden", "Silver", "Ghost", "Phantom", "Raging", "Stormy"
];

// Rock & Metal Theme Nouns
const nouns = [
  "Slayer", "Rocker", "Head", "Wolf", "Tiger", "Bear", "Skull", "Bone",
  "Riff", "Chord", "Amp", "Pick", "King", "Queen", "Lord", "God", "Devil",
  "Beast", "Snake", "Viper", "Cobra", "Spider", "Witch", "Wizard", "Druid",
  "Vandal", "Punk", "Drifter", "Rider", "Pilot", "Gunner", "Drummer", "Bass",
  "Singer", "Star", "Legend", "Hero", "Villain", "Ghost", "Soul", "Spirit",
  "Machine", "Engine", "Hammer", "Axe", "Blade", "Warrior", "Knight"
];

// Random "Guest" name creator (E.g.: IronRiff#42)
// Ensures a fun and thematic identity for guest users
// Can be modified to include more adjectives/nouns for variety later on
function generateGuestId() {
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const number = Math.floor(Math.random() * 90) + 10; // 10-99
  return `${adj}${noun}#${number}`;
}

// Get current user (registered or guest)
export function getUser() {
  // Check if registered user info is stored
  const token = localStorage.getItem('auth_token');
  const userStr = localStorage.getItem('user_profile');
  
  if (token && userStr) {
    try {
      const user = JSON.parse(userStr);
      return { ...user, type: 'registered' };
    } catch (e) {
      console.error("User profile parse error", e);
    }
  }

  // Check for existing Guest ID
  let guestName = localStorage.getItem('guest_name');

  // If none exists, create and save a new Guest ID
  if (!guestName) {
    guestName = generateGuestId();
    localStorage.setItem('guest_name', guestName);
  }

  return { 
    username: guestName, 
    type: 'guest',
    avatar: localStorage.getItem('selectedAvatar') || 'avatar1' // Remember selected avatar
  };
}

// Logout user
export function logoutUser() {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user_profile');
  // Don't remove Guest ID so that the same Guest remains after logout (preference)
  window.location.reload();
}
// src/js/music.js

// Track IDs that have already been played in the current game session
let playedTrackIds = [];

// Reset played tracks history (call this when starting a new game)
export function resetPlayedTracks() {
  playedTrackIds = [];
  console.log('Track history reset');
}

// Get a random track from playlist (avoiding already played tracks)
export async function getRandomTrackFromPlaylist(playlistId) {
  // **Always** use relative path, don't hard-code the port!
  const res = await fetch(`/api/playlist/${playlistId}/tracks`);
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to fetch playlist tracks');
  }
  
  const tracks = await res.json();
  if (!tracks.length) throw new Error('No previewable tracks found');
  
  // Filter out tracks that have already been played
  const availableTracks = tracks.filter(track => !playedTrackIds.includes(track.id));
  
  // If all tracks have been played or very few remain, reset the history
  if (availableTracks.length < 3) {
    console.log('Running out of new tracks, resetting play history');
    playedTrackIds = [];
    return tracks[Math.floor(Math.random() * tracks.length)];
  }
  
  // Get a random track from the available ones
  const randomTrack = availableTracks[Math.floor(Math.random() * availableTracks.length)];
  
  // Add the track ID to played tracks
  playedTrackIds.push(randomTrack.id);
  
  return randomTrack;
}

// Playlist IDs by category - Real playlist IDs from Deezer
const GENRE_PLAYLISTS = {
  // Rock categories (by decade)
  'rock_60s': '1109890291', // 60's Rock
  'rock_70s': '1950507922', // 70's Rock
  'rock_80s': '1283499905', // 80's Rock
  'rock_90s': '1291471565', // 90's Rock
  'rock_00s': '1082556351', // 2000's Rock
  
  // Metal categories (by decade)
  'metal_60s': '7276244344', // 60's Metal & Hard Rock
  'metal_70s': '9504053062', // 70's Metal
  'metal_80s': '1362516565', // 80's Metal
  'metal_90s': '1266971131', // 90's Metal
  'metal_00s': '1256268491', // 2000's Metal
  
  // Mixed categories (by decade)
  'mixed_60s': '1109890291', // 60's Rock & Metal Mix
  'mixed_70s': '1950507922', // 70's Rock & Metal Mix
  'mixed_80s': '1283499905', // 80's Rock & Metal Mix
  'mixed_90s': '1291471565', // 90's Rock & Metal Mix
  'mixed_00s': '1082556351', // 2000's Rock & Metal Mix
  
  // Turkish Rock & Metal
  'turkish_rock': '1121135381',      // Turkish Rock Classics
  'turkish_rock_new': '3173547266',  // New Turkish Rock
  'turkish_metal': '9270303122',     // Turkish Metal
  
  // Artist/Group Specific Categories
  'turkish_anatolian': '1496273595', // Anatolian Rock (Erkin Koray, Barış Manço, Cem Karaca, 3 Hürel, Hardal etc.)
  'pentagram': '10581252702',       // Pentagram/Mezarkabul
  'mor_ve_otesi': '1155523471',     // Mor ve Ötesi
};

// Metadata information for categories
const GENRE_INFO = {
  // Rock categories
  'rock_60s': { name: "60's Rock", type: "rock", era: "60s" },
  'rock_70s': { name: "70's Rock", type: "rock", era: "70s" },
  'rock_80s': { name: "80's Rock", type: "rock", era: "80s" },
  'rock_90s': { name: "90's Rock", type: "rock", era: "90s" },
  'rock_00s': { name: "2000's Rock", type: "rock", era: "00s" },
  
  // Metal categories
  'metal_60s': { name: "60's Metal", type: "metal", era: "60s" },
  'metal_70s': { name: "70's Metal", type: "metal", era: "70s" },
  'metal_80s': { name: "80's Metal", type: "metal", era: "80s" },
  'metal_90s': { name: "90's Metal", type: "metal", era: "90s" },
  'metal_00s': { name: "2000's Metal", type: "metal", era: "00s" },
  
  // Mixed categories
  'mixed_60s': { name: "60's Mix", type: "mixed", era: "60s" },
  'mixed_70s': { name: "70's Mix", type: "mixed", era: "70s" },
  'mixed_80s': { name: "80's Mix", type: "mixed", era: "80s" },
  'mixed_90s': { name: "90's Mix", type: "mixed", era: "90s" },
  'mixed_00s': { name: "2000's Mix", type: "mixed", era: "00s" },
  
  // Turkish Rock & Metal
  'turkish_rock': { name: "Turkish Rock Classics", type: "turkish", era: "classic" },
  'turkish_rock_new': { name: "Modern Turkish Rock", type: "turkish", era: "modern" },
  'turkish_metal': { name: "Turkish Metal", type: "turkish", era: "metal" },
  
  // Artist/Group Specific Categories
  'turkish_anatolian': { name: "Anatolian Rock", type: "turkish", era: "anatolian" },
  'pentagram': { name: "Pentagram/Mezarkabul", type: "artist", era: "turkish" },
  'mor_ve_otesi': { name: "Mor ve Ötesi", type: "artist", era: "turkish" },
};

// Returns the list of all categories
export function getAllGenres() {
  return Object.keys(GENRE_PLAYLISTS).map(key => ({
    id: key,
    ...GENRE_INFO[key]
  }));
}

// Get a random track from a specific genre
export async function getRandomTrackFromGenre(genreId) {
  const playlistId = GENRE_PLAYLISTS[genreId];
  if (!playlistId) throw new Error(`Unknown genre: ${genreId}`);
  
  const track = await getRandomTrackFromPlaylist(playlistId);
  return { 
    ...track, 
    genre: genreId,
    genreName: GENRE_INFO[genreId]?.name || genreId
  };
}

// Get a random track from a random category
export async function getRandomTrackFromRandomGenre() {
  const genres = Object.keys(GENRE_PLAYLISTS);
  const genre = genres[Math.floor(Math.random() * genres.length)];
  return getRandomTrackFromGenre(genre);
}

// Legacy function - for backward compatibility
export async function getRandomTrackFromRandomEra() {
  const track = await getRandomTrackFromRandomGenre();
  const genreInfo = GENRE_INFO[track.genre];
  return { 
    ...track,
    era: genreInfo?.era || '??s' 
  };
}

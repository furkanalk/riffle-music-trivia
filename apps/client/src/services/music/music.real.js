const BASE_URL = "/api";

async function handleResponse(response, errorContext) {
  const contentType = response.headers.get("content-type");
  if (contentType?.includes("text/html")) {
    throw new Error(`HTML returned rather than JSON. Is Backend working? (${errorContext})`);
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || `API Hatası: ${response.status} (${errorContext})`);
  }

  return data;
}

// Get a list of tracks from a playlist
export async function getPlaylistTracks(playlistId) {
  try {
    const res = await fetch(`${BASE_URL}/playlist/${playlistId}/tracks`);
    const data = await handleResponse(res, `Playlist: ${playlistId}`);

    const tracks = Array.isArray(data) ? data : data.data;

    if (!tracks || tracks.length === 0) {
      throw new Error("No playable tracks found in this playlist.");
    }

    return tracks;
  } catch (error) {
    console.error("RealService Error:", error);
    throw error;
  }
}

// Get a list of tracks from an album
export async function getAlbumTracks(albumId) {
  try {
    const res = await fetch(`${BASE_URL}/album/${albumId}/tracks`);
    const data = await handleResponse(res, `Album: ${albumId}`);

    const tracks = Array.isArray(data) ? data : data.data;

    if (!tracks || tracks.length === 0) {
      throw new Error("No playable tracks found in this album.");
    }

    return tracks;
  } catch (error) {
    console.error("RealService Error:", error);
    throw error;
  }
}

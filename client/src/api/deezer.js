// src/deezer.js

// Random track info from a given album ID
export async function getRandomTrackFromAlbum(albumId) {
  try {
    // Fetching tracks for album

    // album songs
    const tracksRes = await fetch(`/api/album/${albumId}/tracks`);
    
    // Check if response is HTML
    const contentType = tracksRes.headers.get('content-type');
    if (contentType && contentType.includes('text/html')) {
      throw new Error('Sunucu başlatılmamış olabilir. Lütfen "node server.js" komutu ile sunucuyu başlatın.');
    }

    const tracksData = await tracksRes.json();
    
    if (!tracksRes.ok) {
      throw new Error(tracksData.error || `Albüm track'leri alınamadı: ${tracksRes.status}`);
    }

    if (!tracksData.data?.length) {
      throw new Error('Albümden şarkı alınamadı.');
    }

    // Rastgele bir parça seç
    const track = tracksData.data[Math.floor(Math.random() * tracksData.data.length)];
    if (!track || !track.id) {
      throw new Error('Geçersiz track verisi.');
    }

    // Track selected with ID, name and artist

    // Preview URL
    try {
      const previewRes = await fetch(`/api/preview/${track.id}`);
      
      // Check if response is HTML
      const previewContentType = previewRes.headers.get('content-type');
      if (previewContentType && previewContentType.includes('text/html')) {
        throw new Error('Preview endpoint not responding. Check the server.');
      }

      const previewData = await previewRes.json();
      
      if (!previewRes.ok) {
        throw new Error(previewData.error || `Preview URL alınamadı: ${previewRes.status}`);
      }
      
      if (!previewData.previewUrl) {
        throw new Error(`Bu şarkı için preview URL'i mevcut değil: ${track.title}`);
      }

      return {
        id: track.id,
        name: previewData.name,
        artists: previewData.artists,
        preview_url: previewData.previewUrl
      };
    } catch (error) {
      console.error('Preview error:', error);
      throw error;
    }
  } catch (error) {
    console.error('getRandomTrackFromAlbum error:', error);
    throw error;
  }
}

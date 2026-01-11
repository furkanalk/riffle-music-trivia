import axios from "axios";

export const getPlaylistTracks = async (req, res) => {
  const { playlistId } = req.params;
  try {
    const { data } = await axios.get(`https://api.deezer.com/playlist/${playlistId}/tracks`);
    if (!data?.data) throw new Error("Invalid Deezer playlist response");
    const tracks = data.data
      .filter((t) => t.preview)
      .map((t) => ({
        id: t.id,
        title: t.title,
        artist: t.artist.name,
        preview: t.preview,
        album: {
          title: t.album.title,
          cover_small: t.album.cover_small,
          cover_medium: t.album.cover_medium,
          cover_big: t.album.cover_big || t.album.cover,
        },
      }));
    return res.json(tracks);
  } catch (err) {
    console.error("Deezer playlist error:", err.message);
    return res.status(502).json({ error: "Failed to fetch playlist tracks" });
  }
};

export const getTrack = async (req, res) => {
  const { trackId } = req.params;
  try {
    const { data: t } = await axios.get(`https://api.deezer.com/track/${trackId}`);
    if (!t?.preview) throw new Error("No preview for this track");
    return res.json({
      id: t.id,
      title: t.title,
      artist: t.artist.name,
      album: {
        title: t.album.title,
        cover_small: t.album.cover_small,
        cover_medium: t.album.cover_medium,
        cover_big: t.album.cover_big || t.album.cover,
      },
      preview: t.preview,
    });
  } catch (err) {
    console.error("Deezer track error:", err.message);
    return res.status(502).json({ error: "Failed to fetch track" });
  }
};

import express from "express";

const router = express.Router();

// Deezer API Base URL
const DEEZER_API = "https://api.deezer.com";

/**
 * PLAYLIST TRACKS PROXY
 * Frontend: /api/playlist/:id/tracks
 */
router.get("/playlist/:id/tracks", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`[API] Fetching playlist: ${id}`);

    const response = await fetch(`${DEEZER_API}/playlist/${id}/tracks?limit=50`);

    if (!response.ok) {
      throw new Error(`Deezer API responded with ${response.status}`);
    }

    const data = await response.json();

    if (data.error) {
      console.error("[API] Deezer Error:", data.error);
      return res.status(500).json({ error: data.error.message });
    }

    res.json(data);
  } catch (error) {
    console.error("[API] Server Error:", error);
    res.status(500).json({ error: "Failed to fetch playlist data" });
  }
});

/**
 * ALBUM TRACKS PROXY
 * Frontend: /api/album/:id/tracks
 */
router.get("/album/:id/tracks", async (req, res) => {
  try {
    const { id } = req.params;
    const response = await fetch(`${DEEZER_API}/album/${id}/tracks`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * TRACK PREVIEW PROXY
 * Frontend: /api/preview/:id
 */
router.get("/preview/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const response = await fetch(`${DEEZER_API}/track/${id}`);
    const data = await response.json();

    if (data.error) throw new Error(data.error.message);

    res.json({
      id: data.id,
      name: data.title,
      artists: data.artist.name,
      previewUrl: data.preview,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

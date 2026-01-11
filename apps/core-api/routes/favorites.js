// This file was renamed from tracks.js to favorites.js to better reflect its purpose
// and to avoid confusion with other track-related modules.
// FAVORITES ROUTES
// Will be changed to handle user favorite tracks in the future

import express from "express";
import { getPlaylistTracks, getTrack } from "../controllers/tracksController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// Apply authentication to all tracks routes
router.use(authenticate);

router.get("/playlist/:playlistId/tracks", getPlaylistTracks);
router.get("/track/:trackId", getTrack);

export default router;

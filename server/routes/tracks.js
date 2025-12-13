import express from 'express';
import { getPlaylistTracks, getTrack } from '../controllers/tracksController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Apply authentication to all tracks routes
router.use(authenticate);

router.get('/playlist/:playlistId/tracks', getPlaylistTracks);
router.get('/track/:trackId', getTrack);

export default router;

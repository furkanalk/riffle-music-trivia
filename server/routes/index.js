import express from 'express';
import authRoutes from './auth.js';
import gameRoutes from './game.js';
import tracksRoutes from './tracks.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/game', gameRoutes);
router.use('/tracks', tracksRoutes);

export default router;

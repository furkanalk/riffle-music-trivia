import express from 'express';
import { createGame, getGame } from '../controllers/gameController.js';

const router = express.Router();

router.post('/create', createGame);
router.get('/:id', getGame);

export default router;

import { GameEngine } from './game-engine.js';

  document.addEventListener('DOMContentLoaded', async () => {
    const game = new GameEngine();
    await game.initialize();
  });
import express from "express";
import authRoutes from "./auth.js";
import favoritesRoutes from "./favorites.js";
import gameRoutes from "./game.js";
import proxyRoutes from "./proxy.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/game", gameRoutes);
router.use("/favorites", favoritesRoutes);
router.use("/", proxyRoutes);

export default router;

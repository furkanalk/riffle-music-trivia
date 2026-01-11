import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  root: ".",
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        categories: resolve(__dirname, "categories.html"),
        game: resolve(__dirname, "game.html"),
      },
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:1968",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});

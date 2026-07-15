import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  assetsInclude: ["**/*.glb", "**/*.gltf", "**/*.woff2"],
  build: {
    sourcemap: true,
    chunkSizeWarningLimit: 900,
  },
});

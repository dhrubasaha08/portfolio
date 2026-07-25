import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  assetsInclude: ["**/*.glb"],
  build: {
    assetsInlineLimit: 4096,
    chunkSizeWarningLimit: 900,
    sourcemap: false,
    target: "es2022",
  },
});

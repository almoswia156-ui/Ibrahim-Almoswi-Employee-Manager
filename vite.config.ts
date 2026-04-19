import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  base: "./",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
          xlsx: ["xlsx"],
        },
      },
    },
  },
  server: {
    host: true,
    allowedHosts: "all",
  },
  optimizeDeps: {
    exclude: ["tesseract.js"],
  },
});

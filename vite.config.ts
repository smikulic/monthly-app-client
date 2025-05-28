import { defineConfig } from "vitest/config";
import compress from "vite-plugin-compression";
// import visualizer from "rollup-plugin-visualizer";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    // visualizer({ filename: 'dist/stats.html', gzipSize: true, brotliSize: true }),
    compress({ algorithm: "brotliCompress" }),
    compress({ algorithm: "gzip" }),
  ],
  resolve: {
    alias: {
      // mirror any tsconfig path aliases here
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    // if you have global constants
    "process.env": {},
  },
  server: {
    port: 3000,
  },
  build: {
    outDir: "build",
    sourcemap: true,
    target: "es2018",
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts",
    coverage: { reporter: ["text", "lcov"] },
  },
});

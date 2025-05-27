import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
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
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts",
    coverage: { reporter: ["text", "lcov"] },
  },
});

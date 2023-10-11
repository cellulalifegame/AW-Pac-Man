import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import * as path from "path";

export default defineConfig({
  plugins: [react()],
  build: {
    target: "es2022",
    minify: true,
    sourcemap: true,
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@import "./src/styles/sassConfig.scss";',
      }
    }
  },
  server: {
    port: 4000, // Service port number
    open: true, // Whether the browser is automatically opened when the service starts
    cors: true, // Allow cross-domain
    host: '0.0.0.0',
    strictPort: false
  },
  resolve: {
    alias: {
      '@img': path.resolve(__dirname, 'src/assets/images'),
      '@comps': path.resolve(__dirname, 'src/components'),
    }
  }
});

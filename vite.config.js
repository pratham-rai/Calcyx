import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      input: './index.html',
    },
  },
  server: {
    port: 3000,
    open: true,
    // SPA fallback — serve index.html for all routes
    historyApiFallback: true,
  },
});

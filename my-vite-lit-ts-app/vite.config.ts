import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  define: {
    CESIUM_BASE_URL: JSON.stringify('/cesium'),
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    proxy: {
      // Alle Anfragen an /api-swissgeol werden umgeleitet
      '/api-swissgeol': {
        target: 'https://ogc-api.gst-viewer.swissgeol.ch',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-swissgeol/, ''),
      },
    },
  },
});

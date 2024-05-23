import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // This is the default output directory for Vite
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://investly.onrender.com/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/backend-api/, ''),
      },
      '/fmp-api': {
        target: 'https://financialmodelingprep.com/api',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/fmp-api/, ''),
      },
    },
  },
});

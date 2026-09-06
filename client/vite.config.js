import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The /api proxy keeps auth cookies same-origin during development (no CORS needed).
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://task-manage-backend-red.vercel.app',
        changeOrigin: true,
      },
    },
  },
});

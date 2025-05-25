import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Tic-Tac-Bot/',
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 6888,
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});

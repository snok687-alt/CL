import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    tailwindcss(),
    react()
  ],
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://api.bwzyz.com',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '/api.php/provide/vod/at/json')
      }
    }
  },
  optimizeDeps: {
    include: ['axios']
  }
});


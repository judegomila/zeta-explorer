import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('zeros-to-1e6')) return 'data-zeros';
          if (id.includes('node_modules/three') || id.includes('@react-three')) return 'vendor-three';
          if (id.includes('node_modules/d3') || id.includes('node_modules/d3-')) return 'vendor-d3';
          if (id.includes('node_modules/katex')) return 'vendor-katex';
        },
      },
    },
  },
  server: {
    port: 3003,
    host: '0.0.0.0',
    allowedHosts: true,
  },
  preview: {
    port: 3003,
    host: '0.0.0.0',
    allowedHosts: true,
  },
});

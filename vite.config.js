import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-three': ['three', '@react-three/fiber', '@react-three/drei'],
          'vendor-d3': ['d3'],
          'vendor-katex': ['katex'],
        },
      },
    },
  },
  server: {
    port: 3002,
    host: '0.0.0.0',
    allowedHosts: true,
  },
  preview: {
    port: 3002,
    host: '0.0.0.0',
    allowedHosts: true,
  },
});

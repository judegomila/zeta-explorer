import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({plugins:[react()],build:{outDir:'dist-twistor-preview',rollupOptions:{input:'scripts/twistor-view/preview.html'}},server:{host:'127.0.0.1',port:3003}});

import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@focusguard/scoring': path.resolve(import.meta.dirname, '../../packages/scoring/src/index.ts'),
    },
  },
});


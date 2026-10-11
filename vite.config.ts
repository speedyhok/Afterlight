import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command }) => ({
  // GitHub Pages serves this repository as /Afterlight/; keep local development at /.
  base: command === 'build' ? '/Afterlight/' : '/',
  plugins: [react()],
}));

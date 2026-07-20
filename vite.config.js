import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        work: resolve(__dirname, 'work.html'),
        chairtime: resolve(__dirname, 'work-chairtime.html'),
        contact: resolve(__dirname, 'contact.html'),
      },
    },
  },
});

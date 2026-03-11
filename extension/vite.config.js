import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // Output to 'dist' folder
    rollupOptions: {
      input: {
        main: 'index.html', // Your popup
        background: 'public/background.js', // Service worker
        // content: 'src/content.js' // Content script is injected, not bundled directly by Vite for manifest v3
      },
      output: {
        // Customize output names if necessary, but default is usually fine
        // Ensure public/background.js and public/index.html are accessible
      }
    },
  },
  // Important: Ensure Vite builds relative paths correctly for the extension
  base: './',
});
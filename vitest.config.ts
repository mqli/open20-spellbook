import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    // Use node environment by default — avoids jsdom ESM compatibility issues
    // with packages like @csstools/css-calc pulled in by @testing-library
    environment: 'node',
    setupFiles: ['./src/test/setup.ts'],
    // Override to jsdom for component files that need the DOM
    environmentMatchGlobs: [
      ['src/components/**', 'jsdom'],
    ],
    server: {
      deps: {
        inline: ['open20-core'],
      },
    },
    ssr: {
      noExternal: ['open20-core'],
    },
  },
});

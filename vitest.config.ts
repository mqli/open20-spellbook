import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    // Use node environment by default
    environment: 'node',
    setupFiles: ['./src/test/setup.ts'],
    // Use happy-dom for component tests (avoids jsdom's ESM compatibility issues
    // with cssstyle → @asamuzakjp/css-color → @csstools/css-calc)
    environmentMatchGlobs: [
      ['src/components/**', 'happy-dom'],
      ['src/components/**/__tests__/**', 'happy-dom'],
    ],
    server: {
      deps: {
        // Inline open20-core to fix ESM import issues with missing .js extensions
        inline: ['open20-core'],
      },
    },
  },
});

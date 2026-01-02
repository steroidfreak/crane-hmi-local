import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Use TS source directly during dev to avoid CJS/ESM issues from dist output
      '@crane/common': path.resolve(__dirname, '../../libs/common/src'),
    },
  },
});

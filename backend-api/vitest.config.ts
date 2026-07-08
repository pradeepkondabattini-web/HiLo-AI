import { defineConfig } from 'vitest/config';

// Runs the whole backend-api workspace test suite from the root.
// @hilo/* workspace packages are inlined so their TypeScript source is transformed
// (they resolve via symlink to sibling packages, not to compiled output).
export default defineConfig({
  test: {
    include: ['**/*.test.ts'],
    exclude: ['**/node_modules/**', '**/dist/**'],
    server: {
      deps: {
        inline: [/@hilo\//],
      },
    },
  },
});

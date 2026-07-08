import { defineConfig } from 'tsup';

// Bundles the service into a single ESM file. The workspace package
// @hilo/backend-shared is bundled in (noExternal); runtime deps like express stay
// external and are installed in the container image.
export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  target: 'node20',
  platform: 'node',
  outDir: 'dist',
  clean: true,
  sourcemap: true,
  noExternal: [/^@hilo\//],
});

import { defineConfig } from 'tsup';

// Bundles the service into a single ESM file. @hilo/backend-shared is inlined; runtime
// deps (express, firebase-admin) stay external and are installed in the container image.
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

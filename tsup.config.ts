import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  target: 'es2018',
  dts: true,
  clean: true,
  sourcemap: false,
});

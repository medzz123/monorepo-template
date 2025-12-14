import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['./src/appRouter.types.ts'],
  dts: { emitDtsOnly: true },
  hash: false,
});

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    clearMocks: true,
    coverage: {
      provider: 'v8',
      reportsDirectory: './coverage',
      exclude: [
        '/node_modules/',
      ],
    },
    environment: 'node',
    globals: true,
    include: [
      'src/**/*.{test,spec}.ts',
      'tests/**/*.{test,spec}.ts',
    ],
  },
});

import { defineWorkersConfig } from '@cloudflare/vitest-pool-workers/config';

export default defineWorkersConfig({
  test: {
    // Enable coverage collection
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['**/node_modules/**', '**/test/**', '**/*.config.js']
    },
    // Test environment setup
    environment: 'miniflare',
    // Test timeout
    testTimeout: 10000,
    // Pool options for workers
    poolOptions: {
      workers: {
        wrangler: { 
          configPath: './wrangler.toml',
          // Additional worker test settings
          vars: {
            TEST_MODE: 'true'
          }
        },
      },
    },
    // Global timeout for tests
    globals: true
  },
});

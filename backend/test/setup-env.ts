import { config } from 'dotenv';
import { resolve } from 'node:path';

// Os testes e2e usam um banco separado (conecthus_test) para não apagar dados de desenvolvimento.
config({
  path: resolve(__dirname, '..', '.env.test'),
  override: true,
  quiet: true,
});

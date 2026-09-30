import { execSync } from 'node:child_process';
import { resolve } from 'node:path';
import './setup-env';

export default function globalSetup(): void {
  execSync('npx prisma migrate deploy', {
    cwd: resolve(__dirname, '..'),
    env: process.env,
    stdio: 'inherit',
  });
}

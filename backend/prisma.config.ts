import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'src/core/config/database/prisma/schema.prisma',
  migrations: {
    path: 'src/core/config/database/prisma/migrations',
  },
  datasource: {
    // process.env (e não env()) para que `prisma generate` funcione sem .env,
    // como no postinstall e no build da imagem Docker.
    url: process.env.DATABASE_URL,
  },
});

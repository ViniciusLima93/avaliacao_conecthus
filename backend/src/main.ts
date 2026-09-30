import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configureApp } from './core/config/app/configure-app';
import { EnvironmentVariables } from './core/config/env/env.validation';
import { setupSwagger } from './core/docs/swagger/swagger.config';

/** Aceita "*", uma origem ou várias separadas por vírgula. */
function parseCorsOrigin(value: string): string | string[] {
  if (value.trim() === '*') return '*';
  const origins = value
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
  return origins.length === 1 ? origins[0] : origins;
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService<EnvironmentVariables, true>);

  configureApp(app);
  app.enableCors({
    origin: parseCorsOrigin(config.get('CORS_ORIGIN', { infer: true })),
  });
  app.enableShutdownHooks();
  setupSwagger(app);

  await app.listen(config.get('PORT', { infer: true }));
}
void bootstrap();

import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DomainExceptionFilter } from '../../domain/exception/domain-exception.filter';

/** Configuração global compartilhada entre a aplicação e os testes e2e. */
export function configureApp(app: INestApplication): void {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new DomainExceptionFilter());
}

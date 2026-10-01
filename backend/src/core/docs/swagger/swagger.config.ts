import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const description = `
API REST de gerenciamento de usuários do **Desafio Conecthus**.

### Paginação
Listagens aceitam \`page\` (padrão 1) e \`limit\` (padrão 10, máximo 100) e retornam:
\`\`\`json
{ "data": [...], "meta": { "page": 1, "limit": 10, "total": 42, "totalPages": 5 } }
\`\`\`

### Erros
| Status | Significado |
| ------ | ----------- |
| 400 | Payload ou parâmetro inválido |
| 404 | Recurso não encontrado |
| 409 | Conflito de unicidade (e-mail ou matrícula) |
| 422 | Violação de regra de domínio |
| 503 | Banco de dados indisponível (health check) |
`;

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Desafio Conecthus API')
    .setDescription(description)
    .setVersion('1.0.0')
    .addServer('http://localhost:3000', 'Local')
    .addTag('users', 'Cadastro e gerenciamento de usuários')
    .addTag('health', 'Monitoramento da API e do banco de dados')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('swagger', app, document, {
    customSiteTitle: 'Conecthus API — Docs',
    jsonDocumentUrl: 'swagger-json',
    yamlDocumentUrl: 'swagger-yaml',
    swaggerOptions: {
      docExpansion: 'list',
      displayRequestDuration: true,
      tryItOutEnabled: true,
      filter: true,
    },
  });
}

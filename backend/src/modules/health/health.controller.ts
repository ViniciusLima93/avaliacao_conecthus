import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiProperty,
  ApiServiceUnavailableResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PrismaService } from '../../core/config/database/prisma.service';

class HealthResponseDto {
  @ApiProperty({ example: 'ok' })
  status: string;

  @ApiProperty({ example: 'up' })
  database: string;

  @ApiProperty({ example: '2026-09-30T00:26:11.421Z' })
  timestamp: string;
}

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @ApiOperation({
    summary: 'Verifica a saúde da API',
    description: 'Executa `SELECT 1` no PostgreSQL para confirmar a conexão.',
  })
  @ApiOkResponse({
    description: 'API e banco de dados operacionais',
    type: HealthResponseDto,
  })
  @ApiServiceUnavailableResponse({
    description: 'Banco de dados indisponível',
    schema: { example: { status: 'error', database: 'down' } },
  })
  async check(): Promise<HealthResponseDto> {
    try {
      await this.prisma.client.$queryRaw`SELECT 1`;
    } catch {
      throw new ServiceUnavailableException({
        status: 'error',
        database: 'down',
      });
    }
    return {
      status: 'ok',
      database: 'up',
      timestamp: new Date().toISOString(),
    };
  }
}

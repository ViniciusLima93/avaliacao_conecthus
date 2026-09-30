import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './generated/prisma/client';
import { EnvironmentVariables } from '../env/env.validation';
import { softDeleteExtension } from './extensions/soft-delete.extension';

const withSoftDelete = (base: PrismaClient) =>
  base.$extends(softDeleteExtension);

export type SoftDeleteClient = ReturnType<typeof withSoftDelete>;

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  /**
   * Cliente padrão: aplica o soft delete, então registros com `deletedAt`
   * nunca são retornados. Use este em todas as consultas.
   */
  readonly client: SoftDeleteClient;

  /**
   * Cliente SEM o filtro de soft delete: enxerga registros excluídos.
   * Use apenas em exceções justificadas (ex.: checagens de unicidade).
   */
  readonly withDeleted: PrismaClient;

  constructor(config: ConfigService<EnvironmentVariables, true>) {
    this.withDeleted = new PrismaClient({
      adapter: new PrismaPg({
        connectionString: config.get('DATABASE_URL', { infer: true }),
      }),
    });
    this.client = withSoftDelete(this.withDeleted);
  }

  async onModuleInit(): Promise<void> {
    await this.withDeleted.$connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.withDeleted.$disconnect();
  }
}

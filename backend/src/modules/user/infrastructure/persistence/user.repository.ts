import { Injectable } from '@nestjs/common';
import { Prisma } from '../../../../core/config/database/generated/prisma/client';
import { PrismaService } from '../../../../core/config/database/prisma.service';
import {
  ConflictException,
  NotFoundException,
} from '../../../../core/domain/exception/domain.exception';
import { UserMessages } from '../../../../core/utils/user-messages';
import { UserEntity } from '../../domain/entities/user.entity';
import {
  FindAllUsersParams,
  FindAllUsersResult,
  UserRepositoryPort,
} from '../../domain/repositories/user.repository.port';
import { UserMapper } from './user.mapper';

@Injectable()
export class UserRepository implements UserRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  /** Tabela com soft delete aplicado (padrão para tudo neste repositório). */
  private get users() {
    return this.prisma.client.user;
  }

  async create(user: UserEntity): Promise<void> {
    await this.withUniqueGuard(() =>
      this.users.create({ data: UserMapper.toPersistence(user) }),
    );
  }

  async update(user: UserEntity): Promise<void> {
    const data = UserMapper.toPersistence(user);
    await this.withGuards(() =>
      this.users.update({
        where: { id: data.id },
        data: {
          name: data.name,
          registration: data.registration,
          email: data.email,
          password: data.password,
          updatedAt: data.updatedAt,
        },
      }),
    );
  }

  async softDelete(user: UserEntity): Promise<void> {
    await this.withGuards(() =>
      this.users.update({
        where: { id: user.id },
        data: { deletedAt: user.deletedAt },
      }),
    );
  }

  async findById(id: string): Promise<UserEntity | null> {
    const model = await this.users.findUnique({ where: { id } });
    return model ? UserMapper.toDomain(model) : null;
  }

  async findAll({
    page,
    limit,
    search,
  }: FindAllUsersParams): Promise<FindAllUsersResult> {
    const where: Prisma.UserWhereInput | undefined = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
            { registration: { contains: search, mode: 'insensitive' } },
          ],
        }
      : undefined;

    const [models, total] = await this.prisma.client.$transaction([
      this.users.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.users.count({ where }),
    ]);
    return { items: models.map((model) => UserMapper.toDomain(model)), total };
  }

  /**
   * Exceção deliberada ao soft delete: usa `withDeleted` para enxergar também
   * usuários excluídos, cujo e-mail continua ocupando o índice UNIQUE.
   */
  async findByEmail(email: string): Promise<UserEntity | null> {
    const model = await this.prisma.withDeleted.user.findUnique({
      where: { email },
    });
    return model ? UserMapper.toDomain(model) : null;
  }

  /** Exceção deliberada ao soft delete (mesmo motivo de `findByEmail`). */
  async findByRegistration(registration: string): Promise<UserEntity | null> {
    const model = await this.prisma.withDeleted.user.findUnique({
      where: { registration },
    });
    return model ? UserMapper.toDomain(model) : null;
  }

  /** Conflito de unicidade e registro inexistente/excluído viram erros de domínio. */
  private async withGuards<T>(operation: () => Promise<T>): Promise<T> {
    try {
      return await this.withUniqueGuard(operation);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(UserMessages.NOT_FOUND);
      }
      throw error;
    }
  }

  /** Converte violação de unicidade (corrida entre requisições) em erro de domínio. */
  private async withUniqueGuard<T>(operation: () => Promise<T>): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        const target = JSON.stringify(error.meta ?? {});
        throw new ConflictException(
          target.includes('registration')
            ? UserMessages.REGISTRATION_ALREADY_EXISTS
            : UserMessages.EMAIL_ALREADY_EXISTS,
        );
      }
      throw error;
    }
  }
}

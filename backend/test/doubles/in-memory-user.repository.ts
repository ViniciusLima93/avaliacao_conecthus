import { HashService } from '../../src/core/services/hash.service';
import { UserEntity } from '../../src/modules/user/domain/entities/user.entity';
import {
  FindAllUsersParams,
  FindAllUsersResult,
  UserRepositoryPort,
} from '../../src/modules/user/domain/repositories/user.repository.port';

/** Mesmas regras do repositório real: excluídos só aparecem nas checagens de unicidade. */
export class InMemoryUserRepository implements UserRepositoryPort {
  /** Todas as linhas, inclusive as excluídas (como a tabela no banco). */
  items: UserEntity[] = [];

  private get active(): UserEntity[] {
    return this.items.filter((item) => !item.isDeleted);
  }

  create(user: UserEntity): Promise<void> {
    this.items.push(user);
    return Promise.resolve();
  }

  update(user: UserEntity): Promise<void> {
    this.items = this.items.map((item) => (item.id === user.id ? user : item));
    return Promise.resolve();
  }

  softDelete(user: UserEntity): Promise<void> {
    return this.update(user);
  }

  findById(id: string): Promise<UserEntity | null> {
    return Promise.resolve(this.active.find((item) => item.id === id) ?? null);
  }

  findByEmail(email: string): Promise<UserEntity | null> {
    return Promise.resolve(
      this.items.find((item) => item.email === email) ?? null,
    );
  }

  findByRegistration(registration: string): Promise<UserEntity | null> {
    return Promise.resolve(
      this.items.find((item) => item.registration === registration) ?? null,
    );
  }

  findAll({
    page,
    limit,
    search,
  }: FindAllUsersParams): Promise<FindAllUsersResult> {
    const term = search?.toLowerCase();
    const filtered = term
      ? this.active.filter((item) =>
          [item.name, item.email, item.registration].some((value) =>
            value.toLowerCase().includes(term),
          ),
        )
      : this.active;
    const start = (page - 1) * limit;
    return Promise.resolve({
      items: filtered.slice(start, start + limit),
      total: filtered.length,
    });
  }
}

export class FakeHashService implements Pick<HashService, 'hash' | 'compare'> {
  hash(plain: string): Promise<string> {
    return Promise.resolve(`hashed:${plain}`);
  }

  compare(plain: string, hashed: string): Promise<boolean> {
    return Promise.resolve(hashed === `hashed:${plain}`);
  }
}

export const asHashService = (fake: FakeHashService) =>
  fake as unknown as HashService;

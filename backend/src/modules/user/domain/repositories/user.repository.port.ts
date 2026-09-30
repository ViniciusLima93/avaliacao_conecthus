import { PaginationParams } from '../../../../core/pagination/paginated-result';
import { UserEntity } from '../entities/user.entity';

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');

export type FindAllUsersParams = PaginationParams & {
  /** Filtra por nome, e-mail ou matrícula (contém, sem diferenciar maiúsculas). */
  search?: string;
};

export type FindAllUsersResult = {
  items: UserEntity[];
  total: number;
};

/**
 * Usuários excluídos (soft delete) nunca são retornados, EXCETO por
 * `findByEmail` e `findByRegistration` — veja a documentação de cada um.
 */
export interface UserRepositoryPort {
  create(user: UserEntity): Promise<void>;
  update(user: UserEntity): Promise<void>;
  /** Persiste a exclusão lógica marcada em `user.markAsDeleted()`. */
  softDelete(user: UserEntity): Promise<void>;
  findById(id: string): Promise<UserEntity | null>;
  findAll(params: FindAllUsersParams): Promise<FindAllUsersResult>;

  /**
   * Checagem de unicidade — INCLUI usuários excluídos, deliberadamente.
   * A coluna `email` mantém a constraint UNIQUE no banco após o soft delete,
   * então o registro antigo ainda ocupa o índice. Enxergá-lo aqui permite
   * devolver um 409 controlado em vez de o INSERT/UPDATE falhar no banco.
   */
  findByEmail(email: string): Promise<UserEntity | null>;

  /** Checagem de unicidade — INCLUI usuários excluídos (mesmo motivo de `findByEmail`). */
  findByRegistration(registration: string): Promise<UserEntity | null>;
}

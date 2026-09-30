import { Inject, Injectable } from '@nestjs/common';
import {
  PaginatedResult,
  paginate,
} from '../../../../../core/pagination/paginated-result';
import { UserEntity } from '../../../domain/entities/user.entity';
import {
  type FindAllUsersParams,
  USER_REPOSITORY,
  type UserRepositoryPort,
} from '../../../domain/repositories/user.repository.port';

@Injectable()
export class FindAllUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute({
    page,
    limit,
    search,
  }: FindAllUsersParams): Promise<PaginatedResult<UserEntity>> {
    const { items, total } = await this.userRepository.findAll({
      page,
      limit,
      search: search?.trim() || undefined,
    });
    return paginate(items, total, { page, limit });
  }
}

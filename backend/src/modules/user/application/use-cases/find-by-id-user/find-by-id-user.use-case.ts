import { Inject, Injectable } from '@nestjs/common';
import { NotFoundException } from '../../../../../core/domain/exception/domain.exception';
import { UserMessages } from '../../../../../core/utils/user-messages';
import { UserEntity } from '../../../domain/entities/user.entity';
import {
  USER_REPOSITORY,
  type UserRepositoryPort,
} from '../../../domain/repositories/user.repository.port';

@Injectable()
export class FindByIdUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(id: string): Promise<UserEntity> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(UserMessages.NOT_FOUND);
    }
    return user;
  }
}

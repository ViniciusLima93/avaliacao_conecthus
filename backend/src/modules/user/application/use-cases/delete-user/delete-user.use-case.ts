import { Inject, Injectable } from '@nestjs/common';
import { NotFoundException } from '../../../../../core/domain/exception/domain.exception';
import { UserMessages } from '../../../../../core/utils/user-messages';
import {
  USER_REPOSITORY,
  type UserRepositoryPort,
} from '../../../domain/repositories/user.repository.port';

/**
 * Soft delete: o usuário deixa de aparecer em todas as consultas, mas a linha
 * continua no banco (e o e-mail/matrícula continuam reservados).
 */
@Injectable()
export class DeleteUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(id: string): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(UserMessages.NOT_FOUND);
    }
    user.markAsDeleted();
    await this.userRepository.softDelete(user);
  }
}

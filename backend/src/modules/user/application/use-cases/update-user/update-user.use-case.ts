import { Inject, Injectable } from '@nestjs/common';
import {
  ConflictException,
  NotFoundException,
} from '../../../../../core/domain/exception/domain.exception';
import { HashService } from '../../../../../core/services/hash.service';
import { UserMessages } from '../../../../../core/utils/user-messages';
import { UserEntity } from '../../../domain/entities/user.entity';
import {
  USER_REPOSITORY,
  type UserRepositoryPort,
} from '../../../domain/repositories/user.repository.port';
import { Email } from '../../../domain/value-objects/email.vo';
import { UpdateUserDto } from '../../dtos/update-user.dto';

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
    private readonly hashService: HashService,
  ) {}

  async execute(id: string, input: UpdateUserDto): Promise<UserEntity> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(UserMessages.NOT_FOUND);
    }

    const email =
      input.email !== undefined
        ? Email.create(input.email).getValue()
        : undefined;
    const registration = input.registration?.trim();

    if (email && email !== user.email) {
      const owner = await this.userRepository.findByEmail(email);
      if (owner && owner.id !== user.id) {
        throw new ConflictException(UserMessages.EMAIL_ALREADY_EXISTS);
      }
    }
    if (registration && registration !== user.registration) {
      const owner = await this.userRepository.findByRegistration(registration);
      if (owner && owner.id !== user.id) {
        throw new ConflictException(UserMessages.REGISTRATION_ALREADY_EXISTS);
      }
    }

    user.update({
      name: input.name,
      registration,
      email,
      isActive: input.isActive,
    });

    if (input.password !== undefined) {
      user.changePassword(await this.hashService.hash(input.password));
    }

    await this.userRepository.update(user);
    return user;
  }
}

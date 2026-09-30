import { Inject, Injectable } from '@nestjs/common';
import { ConflictException } from '../../../../../core/domain/exception/domain.exception';
import { HashService } from '../../../../../core/services/hash.service';
import { UserMessages } from '../../../../../core/utils/user-messages';
import { UserEntity } from '../../../domain/entities/user.entity';
import { UserFactory } from '../../../domain/factories/user.factory';
import {
  USER_REPOSITORY,
  type UserRepositoryPort,
} from '../../../domain/repositories/user.repository.port';
import { Email } from '../../../domain/value-objects/email.vo';
import { CreateUserDto } from '../../dtos/create-user.dto';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
    private readonly hashService: HashService,
  ) {}

  async execute(input: CreateUserDto): Promise<UserEntity> {
    const email = Email.create(input.email).getValue();
    const registration = input.registration.trim();

    if (await this.userRepository.findByEmail(email)) {
      throw new ConflictException(UserMessages.EMAIL_ALREADY_EXISTS);
    }
    if (await this.userRepository.findByRegistration(registration)) {
      throw new ConflictException(UserMessages.REGISTRATION_ALREADY_EXISTS);
    }

    const user = UserFactory.create({
      name: input.name,
      registration,
      email,
      hashedPassword: await this.hashService.hash(input.password),
      isActive: input.isActive,
    });

    await this.userRepository.create(user);
    return user;
  }
}

import { Module } from '@nestjs/common';
import { HashService } from '../../core/services/hash.service';
import { CreateUserUseCase } from './application/use-cases/create-user/create-user.use-case';
import { DeleteUserUseCase } from './application/use-cases/delete-user/delete-user.use-case';
import { FindAllUserUseCase } from './application/use-cases/find-all-user/find-all-user.use-case';
import { FindByIdUserUseCase } from './application/use-cases/find-by-id-user/find-by-id-user.use-case';
import { UpdateUserUseCase } from './application/use-cases/update-user/update-user.use-case';
import { USER_REPOSITORY } from './domain/repositories/user.repository.port';
import { UserController } from './infrastructure/http/user.controller';
import { UserRepository } from './infrastructure/persistence/user.repository';

@Module({
  controllers: [UserController],
  providers: [
    HashService,
    { provide: USER_REPOSITORY, useClass: UserRepository },
    CreateUserUseCase,
    FindAllUserUseCase,
    FindByIdUserUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
  ],
})
export class UserModule {}

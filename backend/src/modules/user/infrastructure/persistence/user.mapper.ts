import type { User as UserModel } from '../../../../core/config/database/generated/prisma/client';
import { UserEntity } from '../../domain/entities/user.entity';
import { Email } from '../../domain/value-objects/email.vo';

export class UserMapper {
  static toDomain(model: UserModel): UserEntity {
    return UserEntity.restore({
      id: model.id,
      name: model.name,
      registration: model.registration,
      email: Email.create(model.email),
      password: model.password,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
      deletedAt: model.deletedAt,
    });
  }

  static toPersistence(entity: UserEntity): UserModel {
    return {
      id: entity.id,
      name: entity.name,
      registration: entity.registration,
      email: entity.email,
      password: entity.password,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
    };
  }
}

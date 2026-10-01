import { randomUUID } from 'node:crypto';
import { UserEntity } from '../entities/user.entity';
import { Email } from '../value-objects/email.vo';

export type CreateUserFactoryInput = {
  name: string;
  registration: string;
  email: string;
  hashedPassword: string;
};

export class UserFactory {
  static create(input: CreateUserFactoryInput): UserEntity {
    const now = new Date();
    return UserEntity.create({
      id: randomUUID(),
      name: input.name,
      registration: input.registration,
      email: Email.create(input.email),
      password: input.hashedPassword,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    });
  }
}

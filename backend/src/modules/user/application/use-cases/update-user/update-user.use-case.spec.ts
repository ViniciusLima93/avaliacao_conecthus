import { randomUUID } from 'node:crypto';
import {
  asHashService,
  FakeHashService,
  InMemoryUserRepository,
} from '../../../../../../test/doubles/in-memory-user.repository';
import {
  ConflictException,
  NotFoundException,
} from '../../../../../core/domain/exception/domain.exception';
import { UserFactory } from '../../../domain/factories/user.factory';
import { UpdateUserUseCase } from './update-user.use-case';

describe('UpdateUserUseCase', () => {
  let repository: InMemoryUserRepository;
  let useCase: UpdateUserUseCase;

  const makeUser = (registration: string, email: string) =>
    UserFactory.create({
      name: 'Usuário Teste',
      registration,
      email,
      hashedPassword: 'hashed:antiga',
    });

  beforeEach(() => {
    repository = new InMemoryUserRepository();
    useCase = new UpdateUserUseCase(
      repository,
      asHashService(new FakeHashService()),
    );
  });

  it('atualiza os dados informados', async () => {
    const user = makeUser('1001', 'a@email.com');
    await repository.create(user);

    const updated = await useCase.execute(user.id, {
      name: 'Nome Novo',
      isActive: false,
    });

    expect(updated.name).toBe('Nome Novo');
    expect(updated.isActive).toBe(false);
    expect(updated.email).toBe('a@email.com');
  });

  it('criptografa a nova senha', async () => {
    const user = makeUser('1001', 'a@email.com');
    await repository.create(user);

    const updated = await useCase.execute(user.id, {
      password: 'Xyz789',
    });

    expect(updated.password).toBe('hashed:Xyz789');
  });

  it('permite manter o próprio e-mail', async () => {
    const user = makeUser('1001', 'a@email.com');
    await repository.create(user);

    await expect(
      useCase.execute(user.id, { email: 'A@email.com' }),
    ).resolves.toBeDefined();
  });

  it('impede usar e-mail de outro usuário', async () => {
    const user = makeUser('1001', 'a@email.com');
    await repository.create(user);
    await repository.create(makeUser('1002', 'b@email.com'));

    await expect(
      useCase.execute(user.id, { email: 'b@email.com' }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('impede usar matrícula de outro usuário', async () => {
    const user = makeUser('1001', 'a@email.com');
    await repository.create(user);
    await repository.create(makeUser('1002', 'b@email.com'));

    await expect(
      useCase.execute(user.id, { registration: '1002' }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('lança NotFound para usuário inexistente', async () => {
    await expect(
      useCase.execute(randomUUID(), { name: 'Qualquer' }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});

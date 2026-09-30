import {
  asHashService,
  FakeHashService,
  InMemoryUserRepository,
} from '../../../../../../test/doubles/in-memory-user.repository';
import { ConflictException } from '../../../../../core/domain/exception/domain.exception';
import { UserMessages } from '../../../../../core/utils/user-messages';
import { CreateUserUseCase } from './create-user.use-case';

describe('CreateUserUseCase', () => {
  let repository: InMemoryUserRepository;
  let useCase: CreateUserUseCase;

  const input = {
    name: 'Maria Silva',
    registration: '2024001',
    email: 'maria@email.com',
    password: 'Abc123',
  };

  beforeEach(() => {
    repository = new InMemoryUserRepository();
    useCase = new CreateUserUseCase(
      repository,
      asHashService(new FakeHashService()),
    );
  });

  it('cria o usuário com a senha criptografada', async () => {
    const user = await useCase.execute(input);

    expect(repository.items).toHaveLength(1);
    expect(user.password).toBe('hashed:Abc123');
    expect(user.isActive).toBe(true);
  });

  it('impede e-mail duplicado (ignorando maiúsculas)', async () => {
    await useCase.execute(input);

    await expect(
      useCase.execute({
        ...input,
        registration: '2024002',
        email: 'MARIA@email.com',
      }),
    ).rejects.toThrow(new ConflictException(UserMessages.EMAIL_ALREADY_EXISTS));
  });

  it('impede matrícula duplicada', async () => {
    await useCase.execute(input);

    await expect(
      useCase.execute({ ...input, email: 'outra@email.com' }),
    ).rejects.toThrow(
      new ConflictException(UserMessages.REGISTRATION_ALREADY_EXISTS),
    );
  });
});

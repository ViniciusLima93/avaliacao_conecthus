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
import { UserMessages } from '../../../../../core/utils/user-messages';
import { UserFactory } from '../../../domain/factories/user.factory';
import { CreateUserUseCase } from '../create-user/create-user.use-case';
import { FindAllUserUseCase } from '../find-all-user/find-all-user.use-case';
import { FindByIdUserUseCase } from '../find-by-id-user/find-by-id-user.use-case';
import { UpdateUserUseCase } from '../update-user/update-user.use-case';
import { DeleteUserUseCase } from './delete-user.use-case';

describe('DeleteUserUseCase (soft delete)', () => {
  let repository: InMemoryUserRepository;
  let useCase: DeleteUserUseCase;

  const makeUser = (registration = '1001', email = 'maria@email.com') =>
    UserFactory.create({
      name: 'Maria Silva',
      registration,
      email,
      hashedPassword: 'hash',
    });

  beforeEach(() => {
    repository = new InMemoryUserRepository();
    useCase = new DeleteUserUseCase(repository);
  });

  it('marca deletedAt sem remover o registro', async () => {
    const user = makeUser();
    await repository.create(user);

    await useCase.execute(user.id);

    expect(repository.items).toHaveLength(1);
    expect(repository.items[0].deletedAt).toBeInstanceOf(Date);
  });

  it('o usuário excluído não aparece em findById nem na listagem', async () => {
    const user = makeUser();
    await repository.create(user);
    await useCase.execute(user.id);

    await expect(
      new FindByIdUserUseCase(repository).execute(user.id),
    ).rejects.toBeInstanceOf(NotFoundException);

    const list = await new FindAllUserUseCase(repository).execute({
      page: 1,
      limit: 10,
    });
    expect(list.data).toHaveLength(0);
    expect(list.meta.total).toBe(0);
  });

  it('excluir de novo retorna NotFound', async () => {
    const user = makeUser();
    await repository.create(user);
    await useCase.execute(user.id);

    await expect(useCase.execute(user.id)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('lança NotFound quando não existe', async () => {
    await expect(useCase.execute(randomUUID())).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  describe('e-mail e matrícula de usuário excluído continuam reservados', () => {
    const hash = asHashService(new FakeHashService());

    beforeEach(async () => {
      const user = makeUser('1001', 'maria@email.com');
      await repository.create(user);
      await useCase.execute(user.id);
    });

    it('cadastro com o mesmo e-mail retorna 409', async () => {
      await expect(
        new CreateUserUseCase(repository, hash).execute({
          name: 'Outra Pessoa',
          registration: '2002',
          email: 'maria@email.com',
          password: 'Abc123',
        }),
      ).rejects.toThrow(
        new ConflictException(UserMessages.EMAIL_ALREADY_EXISTS),
      );
    });

    it('cadastro com a mesma matrícula retorna 409', async () => {
      await expect(
        new CreateUserUseCase(repository, hash).execute({
          name: 'Outra Pessoa',
          registration: '1001',
          email: 'outra@email.com',
          password: 'Abc123',
        }),
      ).rejects.toThrow(
        new ConflictException(UserMessages.REGISTRATION_ALREADY_EXISTS),
      );
    });

    it('edição para o e-mail do excluído retorna 409', async () => {
      const other = makeUser('3003', 'outra@email.com');
      await repository.create(other);

      await expect(
        new UpdateUserUseCase(repository, hash).execute(other.id, {
          email: 'maria@email.com',
        }),
      ).rejects.toBeInstanceOf(ConflictException);
    });
  });
});

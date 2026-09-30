import { randomUUID } from 'node:crypto';
import { InMemoryUserRepository } from '../../../../../../test/doubles/in-memory-user.repository';
import { NotFoundException } from '../../../../../core/domain/exception/domain.exception';
import { UserFactory } from '../../../domain/factories/user.factory';
import { FindByIdUserUseCase } from './find-by-id-user.use-case';

describe('FindByIdUserUseCase', () => {
  let repository: InMemoryUserRepository;
  let useCase: FindByIdUserUseCase;

  beforeEach(() => {
    repository = new InMemoryUserRepository();
    useCase = new FindByIdUserUseCase(repository);
  });

  it('retorna o usuário pelo id', async () => {
    const user = UserFactory.create({
      name: 'Maria Silva',
      registration: '1001',
      email: 'maria@email.com',
      hashedPassword: 'hash',
    });
    await repository.create(user);

    await expect(useCase.execute(user.id)).resolves.toBe(user);
  });

  it('lança NotFound quando não existe', async () => {
    await expect(useCase.execute(randomUUID())).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});

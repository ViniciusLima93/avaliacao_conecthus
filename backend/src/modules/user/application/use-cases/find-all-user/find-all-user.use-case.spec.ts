import { InMemoryUserRepository } from '../../../../../../test/doubles/in-memory-user.repository';
import { UserFactory } from '../../../domain/factories/user.factory';
import { FindAllUserUseCase } from './find-all-user.use-case';

describe('FindAllUserUseCase', () => {
  it('retorna a página solicitada com os metadados', async () => {
    const repository = new InMemoryUserRepository();
    for (let i = 1; i <= 15; i++) {
      await repository.create(
        UserFactory.create({
          name: `Usuário ${String.fromCharCode(64 + i)}`,
          registration: `${1000 + i}`,
          email: `user${i}@email.com`,
          hashedPassword: 'hash',
        }),
      );
    }
    const useCase = new FindAllUserUseCase(repository);

    const result = await useCase.execute({ page: 2, limit: 10 });

    expect(result.data).toHaveLength(5);
    expect(result.meta).toEqual({
      page: 2,
      limit: 10,
      total: 15,
      totalPages: 2,
    });
  });

  it('filtra por termo de busca e ignora espaços nas bordas', async () => {
    const repository = new InMemoryUserRepository();
    await repository.create(
      UserFactory.create({
        name: 'Raimundo Neto',
        registration: '1001',
        email: 'raimundo@email.com',
        hashedPassword: 'hash',
      }),
    );
    await repository.create(
      UserFactory.create({
        name: 'Maria Silva',
        registration: '1002',
        email: 'maria@email.com',
        hashedPassword: 'hash',
      }),
    );
    const useCase = new FindAllUserUseCase(repository);

    const result = await useCase.execute({
      page: 1,
      limit: 10,
      search: '  RAIMUNDO ',
    });

    expect(result.data.map((user) => user.name)).toEqual(['Raimundo Neto']);
    expect(result.meta.total).toBe(1);
  });
});

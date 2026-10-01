import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { configureApp } from '../src/core/config/app/configure-app';
import { PrismaService } from '../src/core/config/database/prisma.service';

type UserBody = {
  id: string;
  name: string;
  email: string;
  registration: string;
  password?: string;
};

describe('Users (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;

  const payload = {
    name: 'Maria Silva',
    registration: '2024001',
    email: 'maria@email.com',
    password: 'Abc123',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    configureApp(app);
    await app.init();
    prisma = app.get(PrismaService);
  });

  beforeEach(async () => {
    // Limpeza física (inclui linhas com soft delete) entre os testes.
    await prisma.withDeleted.user.deleteMany();
  });

  afterAll(async () => {
    // Limpeza física (inclui linhas com soft delete) entre os testes.
    await prisma.withDeleted.user.deleteMany();
    await app.close();
  });

  const createUser = (body: object = payload) =>
    request(app.getHttpServer()).post('/users').send(body);

  it('GET /health retorna o banco como disponível', async () => {
    const res = await request(app.getHttpServer()).get('/health').expect(200);
    expect(res.body).toMatchObject({ status: 'ok', database: 'up' });
  });

  it('executa o CRUD completo', async () => {
    const created = await createUser().expect(201);
    const user = created.body as UserBody;
    expect(user).toMatchObject({
      name: payload.name,
      email: payload.email,
    });
    expect(user.password).toBeUndefined();

    const list = await request(app.getHttpServer())
      .get('/users?page=1&limit=10')
      .expect(200);
    expect(list.body).toMatchObject({
      meta: { page: 1, limit: 10, total: 1, totalPages: 1 },
    });

    await request(app.getHttpServer()).get(`/users/${user.id}`).expect(200);

    const updated = await request(app.getHttpServer())
      .patch(`/users/${user.id}`)
      .send({ name: 'Maria Souza' })
      .expect(200);
    expect(updated.body).toMatchObject({
      name: 'Maria Souza',
    });

    await request(app.getHttpServer()).delete(`/users/${user.id}`).expect(204);
    await request(app.getHttpServer()).get(`/users/${user.id}`).expect(404);
  });

  it('GET /users?search filtra por nome, e-mail ou matrícula', async () => {
    await createUser().expect(201);
    await createUser({
      name: 'Raimundo Neto',
      registration: '7777',
      email: 'raimundo@email.com',
      password: 'Abc123',
    }).expect(201);

    for (const search of ['raimundo', '7777', 'raimundo@']) {
      const res = await request(app.getHttpServer())
        .get('/users')
        .query({ search })
        .expect(200);
      const body = res.body as { data: UserBody[]; meta: { total: number } };
      expect(body.meta.total).toBe(1);
      expect(body.data[0].name).toBe('Raimundo Neto');
    }
  });

  it('armazena a senha com hash', async () => {
    const res = await createUser().expect(201);
    const stored = await prisma.client.user.findUniqueOrThrow({
      where: { id: (res.body as UserBody).id },
    });
    expect(stored.password).not.toBe(payload.password);
    expect(stored.password).toMatch(/^\$2[aby]\$/);
  });

  it('retorna 409 para e-mail ou matrícula duplicados', async () => {
    await createUser().expect(201);
    await createUser({ ...payload, registration: '9999' }).expect(409);
    await createUser({ ...payload, email: 'outro@email.com' }).expect(409);
  });

  it('retorna 400 para payload inválido', async () => {
    const res = await createUser({
      name: 'Al',
      email: 'invalido',
      password: '123',
      extra: 'x',
    }).expect(400);
    expect((res.body as { message: string[] }).message.length).toBeGreaterThan(
      1,
    );
  });

  it('retorna 400 para matrícula com letras ou fora de 4–10 dígitos', async () => {
    for (const registration of ['AB1234', '123', '12345678901']) {
      await createUser({ ...payload, registration }).expect(400);
    }
  });

  it('retorna 400 para nome com números ou símbolos', async () => {
    for (const name of ['Maria 2', 'Maria_Silva', 'Maria@']) {
      const res = await createUser({ ...payload, name }).expect(400);
      expect((res.body as { message: string[] }).message).toContain(
        'Nome deve conter apenas letras',
      );
    }
  });

  it('senha precisa ter exatamente 6 caracteres alfanuméricos', async () => {
    const cases: Array<[string, string]> = [
      ['Abc12', 'Senha deve ter exatamente 6 caracteres'],
      ['Abc1234', 'Senha deve ter exatamente 6 caracteres'],
      ['Abc12!', 'Senha deve conter apenas letras e números'],
    ];
    for (const [password, message] of cases) {
      const res = await createUser({ ...payload, password }).expect(400);
      expect((res.body as { message: string[] }).message).toContain(message);
    }
    await createUser({ ...payload, password: 'aB3dE9' }).expect(201);
  });

  describe('soft delete', () => {
    const deleteUser = (id: string) =>
      request(app.getHttpServer()).delete(`/users/${id}`);

    it('mantém a linha no banco com deleted_at preenchido', async () => {
      const { id } = (await createUser().expect(201)).body as UserBody;
      await deleteUser(id).expect(204);

      const row = await prisma.withDeleted.user.findUniqueOrThrow({
        where: { id },
      });
      expect(row.deletedAt).toBeInstanceOf(Date);
    });

    it('o excluído não aparece em GET por id, listagem, pesquisa, PATCH nem DELETE', async () => {
      const { id } = (await createUser().expect(201)).body as UserBody;
      await deleteUser(id).expect(204);

      await request(app.getHttpServer()).get(`/users/${id}`).expect(404);
      await request(app.getHttpServer())
        .patch(`/users/${id}`)
        .send({ name: 'Nome Novo' })
        .expect(404);
      await deleteUser(id).expect(404);

      const list = await request(app.getHttpServer()).get('/users').expect(200);
      expect(list.body).toMatchObject({ data: [], meta: { total: 0 } });

      const search = await request(app.getHttpServer())
        .get('/users')
        .query({ search: 'maria' })
        .expect(200);
      expect((search.body as { data: UserBody[] }).data).toHaveLength(0);
    });

    it('o cliente padrão nunca retorna excluídos (find, findUnique, count)', async () => {
      const { id } = (await createUser().expect(201)).body as UserBody;
      await deleteUser(id).expect(204);

      await expect(
        prisma.client.user.findUnique({ where: { id } }),
      ).resolves.toBeNull();
      await expect(prisma.client.user.findFirst()).resolves.toBeNull();
      await expect(prisma.client.user.findMany()).resolves.toHaveLength(0);
      await expect(prisma.client.user.count()).resolves.toBe(0);
      await expect(prisma.withDeleted.user.count()).resolves.toBe(1);
    });

    it('e-mail e matrícula do excluído continuam reservados (409, não erro de banco)', async () => {
      const { id } = (await createUser().expect(201)).body as UserBody;
      await deleteUser(id).expect(204);

      const sameEmail = await createUser({
        ...payload,
        registration: '5555',
      }).expect(409);
      expect((sameEmail.body as { message: string }).message).toBe(
        'Já existe um usuário com este e-mail',
      );

      const sameRegistration = await createUser({
        ...payload,
        email: 'nova@email.com',
      }).expect(409);
      expect((sameRegistration.body as { message: string }).message).toBe(
        'Já existe um usuário com esta matrícula',
      );
    });
  });

  it('retorna 400 para id que não é UUID', () =>
    request(app.getHttpServer()).get('/users/123').expect(400));
});

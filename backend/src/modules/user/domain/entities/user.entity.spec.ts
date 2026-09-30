import { NotificationErrors } from '../../../../core/domain/notification/notification.errors';
import { UserMessages } from '../../../../core/utils/user-messages';
import { UserFactory } from '../factories/user.factory';

const validInput = {
  name: 'Maria Silva',
  registration: '2024001',
  email: 'Maria.Silva@Email.com ',
  hashedPassword: 'hashed-password',
};

describe('UserEntity', () => {
  it('cria um usuário válido, ativo por padrão e com e-mail normalizado', () => {
    const user = UserFactory.create(validInput);

    expect(user.id).toBeDefined();
    expect(user.email).toBe('maria.silva@email.com');
    expect(user.isActive).toBe(true);
    expect(user.createdAt).toBeInstanceOf(Date);
  });

  it('acumula todas as violações de domínio em NotificationErrors', () => {
    expect.assertions(3);
    try {
      UserFactory.create({
        ...validInput,
        name: 'Al',
        email: 'invalido',
        registration: '',
      });
    } catch (error) {
      expect(error).toBeInstanceOf(NotificationErrors);
      const messages = (error as NotificationErrors).errors.map(
        (e) => e.message,
      );
      expect(messages).toEqual(
        expect.arrayContaining([
          UserMessages.NAME_MIN,
          UserMessages.EMAIL_INVALID,
          UserMessages.REGISTRATION_REQUIRED,
        ]),
      );
      expect(messages).toHaveLength(3);
    }
  });

  it.each([
    ['com letras', 'AB1234', UserMessages.REGISTRATION_DIGITS],
    ['com menos de 4 dígitos', '123', UserMessages.REGISTRATION_MIN],
    ['com mais de 10 dígitos', '12345678901', UserMessages.REGISTRATION_MAX],
  ])('rejeita matrícula %s', (_, registration, message) => {
    expect.assertions(1);
    try {
      UserFactory.create({ ...validInput, registration });
    } catch (error) {
      expect(
        (error as NotificationErrors).errors.map((e) => e.message),
      ).toEqual([message]);
    }
  });

  it.each(['Maria 2', 'João_Silva', 'Ana  Clara', 'Zé!'])(
    'rejeita nome que não é só letras: "%s"',
    (name) => {
      expect.assertions(1);
      try {
        UserFactory.create({ ...validInput, name });
      } catch (error) {
        expect(
          (error as NotificationErrors).errors.map((e) => e.message),
        ).toContain(UserMessages.NAME_LETTERS);
      }
    },
  );

  it('aceita nome com acentos e espaços', () => {
    expect(
      UserFactory.create({ ...validInput, name: 'Maria José da Conceição' })
        .name,
    ).toBe('Maria José da Conceição');
  });

  it('rejeita nome com mais de 30 e e-mail com mais de 40 caracteres', () => {
    expect.assertions(1);
    try {
      UserFactory.create({
        ...validInput,
        name: 'N'.repeat(31),
        email: `${'e'.repeat(31)}@email.com`,
      });
    } catch (error) {
      expect(
        (error as NotificationErrors).errors.map((e) => e.message),
      ).toEqual(
        expect.arrayContaining([UserMessages.NAME_MAX, UserMessages.EMAIL_MAX]),
      );
    }
  });

  it('atualiza campos e o updatedAt', () => {
    const user = UserFactory.create(validInput);
    const before = user.updatedAt;

    user.update({ name: 'Maria Souza', email: 'NOVO@email.com' });

    expect(user.name).toBe('Maria Souza');
    expect(user.email).toBe('novo@email.com');
    expect(user.updatedAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
  });

  it('rejeita atualização que viola as invariantes', () => {
    const user = UserFactory.create(validInput);

    expect(() => user.update({ email: 'sem-arroba' })).toThrow(
      NotificationErrors,
    );
  });

  it('nasce sem deletedAt e markAsDeleted registra a exclusão uma única vez', () => {
    const user = UserFactory.create(validInput);
    expect(user.deletedAt).toBeNull();
    expect(user.isDeleted).toBe(false);

    user.markAsDeleted();
    const deletedAt = user.deletedAt;
    user.markAsDeleted();

    expect(user.isDeleted).toBe(true);
    expect(deletedAt).toBeInstanceOf(Date);
    expect(user.deletedAt).toBe(deletedAt);
  });

  it('ativa e desativa o usuário', () => {
    const user = UserFactory.create(validInput);

    user.deactivate();
    expect(user.isActive).toBe(false);
    user.activate();
    expect(user.isActive).toBe(true);
  });
});

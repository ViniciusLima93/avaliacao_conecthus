import { describe, expect, it } from 'vitest';
import type { z } from 'zod';
import {
  createUserSchema,
  updateUserSchema,
  type UserFormValues,
} from './userFormSchema';

const valid: UserFormValues = {
  name: 'Maria José',
  registration: '2024001',
  email: 'maria@email.com',
  password: 'Abc123',
  confirmPassword: 'Abc123',
};

/** Primeira mensagem de erro de cada campo (ex.: { name: 'Nome é obrigatório' }). */
function errorsOf(
  schema: z.ZodType<UserFormValues>,
  values: Partial<UserFormValues>,
): Record<string, string> {
  const result = schema.safeParse({ ...valid, ...values });
  if (result.success) return {};
  return result.error.issues.reduce<Record<string, string>>((acc, issue) => {
    const field = issue.path.join('.');
    acc[field] ??= issue.message;
    return acc;
  }, {});
}

describe('createUserSchema', () => {
  it('aceita um cadastro válido e remove espaços das bordas', () => {
    const result = createUserSchema.safeParse({
      ...valid,
      name: '  Maria José  ',
      email: ' maria@email.com ',
    });

    expect(result.success).toBe(true);
    expect(result.data?.name).toBe('Maria José');
    expect(result.data?.email).toBe('maria@email.com');
  });

  describe('nome', () => {
    it.each([
      ['', 'Nome é obrigatório'],
      ['Maria 2', 'Nome deve conter apenas letras'],
      ['João_Silva', 'Nome deve conter apenas letras'],
      ['Ana  Clara', 'Nome deve conter apenas letras'],
      ['Al', 'Nome deve ter no mínimo 3 caracteres'],
      ['A'.repeat(31), 'Nome deve ter no máximo 30 caracteres'],
    ])('"%s" → %s', (name, message) => {
      expect(errorsOf(createUserSchema, { name }).name).toBe(message);
    });

    it('aceita acentos e espaços simples', () => {
      expect(
        errorsOf(createUserSchema, { name: 'Conceição Araújo' }).name,
      ).toBeUndefined();
    });
  });

  describe('matrícula', () => {
    it.each([
      ['', 'Matrícula é obrigatória'],
      ['AB12', 'Matrícula deve conter apenas números'],
      ['123', 'Matrícula deve ter no mínimo 4 caracteres'],
      ['12345678901', 'Matrícula deve ter no máximo 10 caracteres'],
    ])('"%s" → %s', (registration, message) => {
      expect(errorsOf(createUserSchema, { registration }).registration).toBe(
        message,
      );
    });

    it.each(['1234', '1234567890'])('aceita "%s"', (registration) => {
      expect(
        errorsOf(createUserSchema, { registration }).registration,
      ).toBeUndefined();
    });
  });

  describe('e-mail', () => {
    it.each([
      ['', 'E-mail é obrigatório'],
      ['maria@', 'E-mail inválido'],
      ['sem-arroba.com', 'E-mail inválido'],
      [
        `${'a'.repeat(31)}@email.com`,
        'E-mail deve ter no máximo 40 caracteres',
      ],
    ])('"%s" → %s', (email, message) => {
      expect(errorsOf(createUserSchema, { email }).email).toBe(message);
    });
  });

  describe('senha', () => {
    it.each([
      ['', 'Senha é obrigatória'],
      ['Abc12', 'Senha deve ter exatamente 6 caracteres'],
      ['Abc1234', 'Senha deve ter exatamente 6 caracteres'],
      ['Abc12!', 'Senha deve conter apenas letras e números'],
    ])('"%s" → %s', (password, message) => {
      expect(
        errorsOf(createUserSchema, { password, confirmPassword: password })
          .password,
      ).toBe(message);
    });

    it('exige repetir a senha', () => {
      expect(
        errorsOf(createUserSchema, { confirmPassword: '' }).confirmPassword,
      ).toBe('Repita a senha');
    });

    it('acusa senhas diferentes no campo "Repetir Senha"', () => {
      expect(
        errorsOf(createUserSchema, { confirmPassword: 'Xyz789' })
          .confirmPassword,
      ).toBe('As senhas não coincidem');
    });
  });
});

describe('updateUserSchema', () => {
  it('aceita senha em branco (mantém a atual)', () => {
    expect(
      updateUserSchema.safeParse({
        ...valid,
        password: '',
        confirmPassword: '',
      }).success,
    ).toBe(true);
  });

  it('se a senha for preenchida, aplica as mesmas regras do cadastro', () => {
    expect(
      errorsOf(updateUserSchema, {
        password: 'Abc12',
        confirmPassword: 'Abc12',
      }).password,
    ).toBe('Senha deve ter exatamente 6 caracteres');
  });

  it('se a senha for preenchida, exige a confirmação igual', () => {
    expect(
      errorsOf(updateUserSchema, { password: 'Xyz789', confirmPassword: '' })
        .confirmPassword,
    ).toBe('As senhas não coincidem');
  });
});

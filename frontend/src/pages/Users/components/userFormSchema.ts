import { z } from 'zod';

/** Limites compartilhados com o backend e exibidos nos textos de apoio. */
export const USER_LIMITS = {
  nameMax: 30,
  registrationMin: 4,
  registrationMax: 10,
  emailMax: 40,
  passwordLength: 6,
} as const;

/** Mesmas regras do backend (user.rules.ts). */
const NAME_PATTERN = /^\p{L}+(?: \p{L}+)*$/u;
const REGISTRATION_PATTERN = /^\d+$/;
const PASSWORD_PATTERN = /^[A-Za-z0-9]+$/;

const PASSWORD_LENGTH_MESSAGE = 'Senha deve ter exatamente 6 caracteres';
const PASSWORD_ALPHANUMERIC_MESSAGE =
  'Senha deve conter apenas letras e números';
const PASSWORD_MISMATCH = 'As senhas não coincidem';

const baseSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Nome é obrigatório')
    .regex(NAME_PATTERN, 'Nome deve conter apenas letras')
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(USER_LIMITS.nameMax, 'Nome deve ter no máximo 30 caracteres'),
  registration: z
    .string()
    .trim()
    .min(1, 'Matrícula é obrigatória')
    .regex(REGISTRATION_PATTERN, 'Matrícula deve conter apenas números')
    .min(
      USER_LIMITS.registrationMin,
      'Matrícula deve ter no mínimo 4 caracteres',
    )
    .max(
      USER_LIMITS.registrationMax,
      'Matrícula deve ter no máximo 10 caracteres',
    ),
  email: z
    .string()
    .trim()
    .min(1, 'E-mail é obrigatório')
    .max(USER_LIMITS.emailMax, 'E-mail deve ter no máximo 40 caracteres')
    .pipe(z.email('E-mail inválido')),
  password: z.string(),
  confirmPassword: z.string(),
});

/** Senha válida: exatamente 6 caracteres, só letras e números. */
const validPassword = z
  .string()
  .regex(PASSWORD_PATTERN, PASSWORD_ALPHANUMERIC_MESSAGE)
  .length(USER_LIMITS.passwordLength, PASSWORD_LENGTH_MESSAGE);

const passwordsMatch = (values: {
  password: string;
  confirmPassword: string;
}) => values.password === values.confirmPassword;

/** Cadastro: senha obrigatória e confirmada. */
export const createUserSchema = baseSchema
  .extend({
    password: z.string().min(1, 'Senha é obrigatória').pipe(validPassword),
    confirmPassword: z.string().min(1, 'Repita a senha'),
  })
  .refine(passwordsMatch, {
    message: PASSWORD_MISMATCH,
    path: ['confirmPassword'],
  });

/** Edição: senha em branco mantém a atual; se preenchida, segue a mesma regra. */
export const updateUserSchema = baseSchema
  .extend({
    password: z.union([z.literal(''), validPassword]),
  })
  .refine(passwordsMatch, {
    message: PASSWORD_MISMATCH,
    path: ['confirmPassword'],
  });

export type UserFormValues = z.infer<typeof baseSchema>;

export const emptyUserForm: UserFormValues = {
  name: '',
  registration: '',
  email: '',
  password: '',
  confirmPassword: '',
};

import { zodResolver } from '@hookform/resolvers/zod';
import { type UseFormSetError, useForm } from 'react-hook-form';
import styled from 'styled-components';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { FloatingInput } from '../../../components/ui/FloatingInput';
import { FormSection } from '../../../components/ui/FormSection';
import { PasswordInput } from '../../../components/ui/PasswordInput';
import { media } from '../../../styles/theme';
import {
  createUserSchema,
  updateUserSchema,
  USER_LIMITS,
  type UserFormValues,
} from './userFormSchema';

type UserFormProps = {
  mode: 'create' | 'edit';
  defaultValues: UserFormValues;
  submitting: boolean;
  onCancel: () => void;
  onSubmit: (
    values: UserFormValues,
    setError: UseFormSetError<UserFormValues>,
  ) => void;
};

export function UserForm({
  mode,
  defaultValues,
  submitting,
  onCancel,
  onSubmit,
}: UserFormProps) {
  const isCreate = mode === 'create';
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid, isDirty },
  } = useForm<UserFormValues>({
    resolver: zodResolver(isCreate ? createUserSchema : updateUserSchema),
    defaultValues,
    mode: 'onTouched',
  });

  // Matrícula aceita só dígitos: remove qualquer outro caractere ao digitar/colar.
  const registrationField = register('registration');

  // "Cadastrar" só habilita com o formulário válido; na edição, também exige alteração.
  const canSubmit = isValid && (isCreate || isDirty) && !submitting;

  return (
    <Card
      as="form"
      noValidate
      onSubmit={handleSubmit((values) => onSubmit(values, setError))}
    >
      <FormSection title="Dados do Usuário">
        <Grid>
          <FloatingInput
            {...register('name')}
            label="Insira o nome completo*"
            helper={`• Máx. ${USER_LIMITS.nameMax} Caracteres`}
            error={errors.name?.message}
            maxLength={USER_LIMITS.nameMax}
            autoComplete="name"
          />
          <FloatingInput
            {...registrationField}
            onChange={(event) => {
              event.target.value = event.target.value.replace(/\D/g, '');
              return registrationField.onChange(event);
            }}
            label="Insira o Nº da matrícula"
            helper={`• Mín. ${USER_LIMITS.registrationMin} Letras | • Máx. ${USER_LIMITS.registrationMax} Caracteres`}
            error={errors.registration?.message}
            maxLength={USER_LIMITS.registrationMax}
            inputMode="numeric"
            autoComplete="off"
          />
          <FloatingInput
            {...register('email')}
            label="Insira o E-mail*"
            helper={`• Máx. ${USER_LIMITS.emailMax} Caracteres`}
            error={errors.email?.message}
            maxLength={USER_LIMITS.emailMax}
            type="email"
            inputMode="email"
            autoComplete="email"
          />
        </Grid>
      </FormSection>

      <FormSection title="Dados de acesso">
        <Grid>
          <PasswordInput
            {...register('password', { deps: ['confirmPassword'] })}
            label="Senha"
            helper={
              isCreate
                ? '• 6 Caracteres alfanuméricos'
                : '• 6 Caracteres alfanuméricos | • Em branco mantém a atual'
            }
            error={errors.password?.message}
            maxLength={USER_LIMITS.passwordLength}
            autoComplete="new-password"
          />
          <PasswordInput
            {...register('confirmPassword')}
            label="Repetir Senha"
            error={errors.confirmPassword?.message}
            maxLength={USER_LIMITS.passwordLength}
            autoComplete="new-password"
          />
        </Grid>
      </FormSection>

      <Actions>
        <Button $variant="secondary" onClick={onCancel} disabled={submitting}>
          Cancelar
        </Button>
        <Button type="submit" disabled={!canSubmit}>
          {submitting ? 'Salvando...' : isCreate ? 'Cadastrar' : 'Salvar'}
        </Button>
      </Actions>
    </Card>
  );
}

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;

  ${media.md} {
    grid-template-columns: 1fr 1fr;
  }
`;

const Actions = styled.div`
  display: flex;
  flex-direction: column-reverse;
  gap: 8px;
  margin-top: 32px;

  ${media.sm} {
    flex-direction: row;
    justify-content: flex-end;

    button {
      min-width: 98px;
    }
  }
`;

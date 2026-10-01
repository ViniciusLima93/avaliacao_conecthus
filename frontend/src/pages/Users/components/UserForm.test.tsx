import { screen, waitFor } from '@testing-library/react';
import type { UserEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { renderWithTheme } from '../../../test/render';
import { UserForm } from './UserForm';
import { emptyUserForm, type UserFormValues } from './userFormSchema';

const field = {
  name: () => screen.getByLabelText('Insira o nome completo*'),
  registration: () => screen.getByLabelText('Insira o Nº da matrícula'),
  email: () => screen.getByLabelText('Insira o E-mail*'),
  password: () => screen.getByLabelText('Senha'),
  confirmPassword: () => screen.getByLabelText('Repetir Senha'),
};

function renderForm(props: Partial<Parameters<typeof UserForm>[0]> = {}) {
  const onSubmit = vi.fn();
  const onCancel = vi.fn();
  const view = renderWithTheme(
    <UserForm
      mode="create"
      defaultValues={emptyUserForm}
      submitting={false}
      onSubmit={onSubmit}
      onCancel={onCancel}
      {...props}
    />,
  );
  return { ...view, onSubmit, onCancel };
}

async function fillValidForm(user: UserEvent) {
  await user.type(field.name(), 'Maria José');
  await user.type(field.registration(), '2024001');
  await user.type(field.email(), 'maria@email.com');
  await user.type(field.password(), 'Abc123');
  await user.type(field.confirmPassword(), 'Abc123');
}

describe('UserForm — cadastro', () => {
  it('começa com "Cadastrar" desabilitado', () => {
    renderForm();
    expect(screen.getByRole('button', { name: 'Cadastrar' })).toBeDisabled();
  });

  it('mostra os textos de apoio do protótipo', () => {
    renderForm();
    expect(screen.getByText('• Máx. 30 Caracteres')).toBeInTheDocument();
    expect(
      screen.getByText('• Mín. 4 | • Máx. 10 Números'),
    ).toBeInTheDocument();
    expect(screen.getByText('• Máx. 40 Caracteres')).toBeInTheDocument();
  });

  it('habilita "Cadastrar" com todos os campos válidos e envia os valores', async () => {
    const { user, onSubmit } = renderForm();

    await fillValidForm(user);
    const submit = screen.getByRole('button', { name: 'Cadastrar' });
    await waitFor(() => expect(submit).toBeEnabled());
    await user.click(submit);

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    expect(onSubmit.mock.calls[0][0]).toEqual({
      name: 'Maria José',
      registration: '2024001',
      email: 'maria@email.com',
      password: 'Abc123',
      confirmPassword: 'Abc123',
    } satisfies UserFormValues);
  });

  it('descarta tudo que não for dígito na matrícula', async () => {
    const { user } = renderForm();

    await user.type(field.registration(), 'ab12c34-5');

    expect(field.registration()).toHaveValue('12345');
  });

  it('limita a senha a 6 caracteres', async () => {
    const { user } = renderForm();

    await user.type(field.password(), 'Abc123456');

    expect(field.password()).toHaveValue('Abc123');
  });

  it('mostra erro de nome com números ao sair do campo', async () => {
    const { user } = renderForm();

    await user.type(field.name(), 'Maria 2');
    await user.tab();

    expect(
      await screen.findByText('Nome deve conter apenas letras'),
    ).toBeInTheDocument();
    expect(field.name()).toHaveAttribute('aria-invalid', 'true');
  });

  it('acusa senhas diferentes e mantém "Cadastrar" desabilitado', async () => {
    const { user } = renderForm();

    await fillValidForm(user);
    await user.clear(field.confirmPassword());
    await user.type(field.confirmPassword(), 'Xyz789');
    await user.tab();

    expect(
      await screen.findByText('As senhas não coincidem'),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cadastrar' })).toBeDisabled();
  });

  it('alterna a visibilidade da senha', async () => {
    const { user } = renderForm();

    expect(field.password()).toHaveAttribute('type', 'password');
    await user.click(screen.getByRole('button', { name: 'Mostrar Senha' }));
    expect(field.password()).toHaveAttribute('type', 'text');
  });

  it('chama onCancel ao clicar em "Cancelar"', async () => {
    const { user, onCancel } = renderForm();

    await user.click(screen.getByRole('button', { name: 'Cancelar' }));

    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('mostra "Salvando..." e desabilita os botões durante o envio', () => {
    renderForm({ submitting: true });

    expect(screen.getByRole('button', { name: 'Salvando...' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeDisabled();
  });
});

describe('UserForm — edição', () => {
  const existing: UserFormValues = {
    name: 'Maria José',
    registration: '2024001',
    email: 'maria@email.com',
    password: '',
    confirmPassword: '',
  };

  it('só habilita "Salvar" depois de alguma alteração', async () => {
    const { user } = renderForm({ mode: 'edit', defaultValues: existing });

    const save = screen.getByRole('button', { name: 'Salvar' });
    expect(save).toBeDisabled();

    await user.type(field.name(), ' Silva');

    await waitFor(() => expect(save).toBeEnabled());
  });

  it('permite salvar com as senhas em branco', async () => {
    const { user, onSubmit } = renderForm({
      mode: 'edit',
      defaultValues: existing,
    });

    await user.clear(field.name());
    await user.type(field.name(), 'Maria Souza');
    await user.click(screen.getByRole('button', { name: 'Salvar' }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    expect(onSubmit.mock.calls[0][0]).toMatchObject({
      name: 'Maria Souza',
      password: '',
    });
  });

  it('informa que a senha em branco mantém a atual', () => {
    renderForm({ mode: 'edit', defaultValues: existing });

    expect(
      screen.getByText(
        '• 6 Caracteres alfanuméricos | • Em branco mantém a atual',
      ),
    ).toBeInTheDocument();
  });
});

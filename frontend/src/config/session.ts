/**
 * Usuário exibido no cabeçalho, no menu de perfil e na saudação da Home.
 * A API ainda não possui autenticação; quando houver, substitua por dados da sessão.
 */
export const currentUser = {
  name: 'Milena Santana Borges',
  email: 'milena.santana@energy.org.br',
};

/** Iniciais do primeiro e do segundo nome (ex.: "Milena Santana Borges" → "MS"). */
export function getInitials(name: string): string {
  const [first = '', second = ''] = name.trim().split(/\s+/);
  return (first.charAt(0) + second.charAt(0)).toUpperCase();
}

export function getFirstName(name: string): string {
  return name.trim().split(/\s+/)[0] ?? '';
}

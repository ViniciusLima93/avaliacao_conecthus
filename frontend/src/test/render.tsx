import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactElement, ReactNode } from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { ThemeProvider } from 'styled-components';
import { ToastProvider } from '../components/ui/Toast';
import { theme } from '../styles/theme';

/** Só o tema: para componentes que não dependem de rotas nem da API. */
export function renderWithTheme(ui: ReactElement) {
  return {
    user: userEvent.setup(),
    ...render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>),
  };
}

type RenderPageOptions = {
  /** URL inicial (ex.: "/usuarios?page=2"). */
  route?: string;
  /** Padrão de rota em que a página é montada. */
  path?: string;
};

/**
 * Renderiza uma página com os mesmos providers do app (tema, React Query,
 * toasts e router em memória). Outras rotas mostram "Outra rota" para que os
 * testes possam verificar navegações pelo `router`.
 */
export function renderPage(
  ui: ReactElement,
  { route = '/', path = '/' }: RenderPageOptions = {},
) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  const router = createMemoryRouter(
    [
      { path, element: ui },
      { path: '*', element: <p>Outra rota</p> },
    ],
    { initialEntries: [route] },
  );

  const Providers = ({ children }: { children: ReactNode }) => (
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>{children}</ToastProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );

  return {
    user: userEvent.setup(),
    router,
    queryClient,
    ...render(<RouterProvider router={router} />, { wrapper: Providers }),
  };
}

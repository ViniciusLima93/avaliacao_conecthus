import { createBrowserRouter } from 'react-router';
import { AppLayout } from './components/layout/AppLayout';

// Cada página vira um chunk separado, baixado só quando a rota é acessada.
export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        lazy: async () => ({
          Component: (await import('./pages/Home/HomePage')).HomePage,
        }),
      },
      {
        path: 'usuarios',
        lazy: async () => ({
          Component: (await import('./pages/Users/UsersPage')).UsersPage,
        }),
      },
      {
        path: 'usuarios/novo',
        lazy: async () => ({
          Component: (await import('./pages/Users/UserFormPage')).UserFormPage,
        }),
      },
      {
        path: 'usuarios/:id/editar',
        lazy: async () => ({
          Component: (await import('./pages/Users/UserFormPage')).UserFormPage,
        }),
      },
      {
        path: '*',
        lazy: async () => ({
          Component: (await import('./pages/NotFound/NotFoundPage'))
            .NotFoundPage,
        }),
      },
    ],
  },
]);

import ProtectedRoute from '@components/ProtectedRoute';
import { lazyWithRetry } from '@helpers/lazyWithRetry';

// Lazy loading de componentes de cliente con retry
const ClientePedidos = lazyWithRetry(() => import('@pages/cliente-tienda/MisPedidos'));
const ClientePerfil = lazyWithRetry(() => import('@pages/cliente-tienda/MiPerfil'));

export const clienteRoutes = [
  {
    path: '/cliente/pedidos',
    element: (
      <ProtectedRoute allowedRoles={['cliente']}>
        <ClientePedidos />
      </ProtectedRoute>
    )
  },
  {
    path: '/cliente/profile',
    element: (
      <ProtectedRoute allowedRoles={['cliente']}>
        <ClientePerfil />
      </ProtectedRoute>
    )
  }
];

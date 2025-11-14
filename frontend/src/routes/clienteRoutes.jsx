import { lazy } from 'react';
import ProtectedRoute from '@components/ProtectedRoute';

// Lazy loading de componentes de cliente
const ClientePedidos = lazy(() => import('@pages/cliente-tienda/MisPedidos'));
const ClientePerfil = lazy(() => import('@pages/cliente-tienda/MiPerfil'));

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

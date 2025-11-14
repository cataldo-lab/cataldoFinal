import ProtectedRoute from '@components/ProtectedRoute';
import { lazyWithRetry } from '@helpers/lazyWithRetry';

// Lazy loading de componentes de gerente con retry
const GerenteDashboard = lazyWithRetry(() => import('@pages/gerente/gerenteDashboard'));

export const gerenteRoutes = [
  {
    path: '/gerente/dashboard',
    element: (
      <ProtectedRoute allowedRoles={['administrador', 'gerente']}>
        <GerenteDashboard />
      </ProtectedRoute>
    )
  }
];

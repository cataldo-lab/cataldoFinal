import { lazy } from 'react';
import ProtectedRoute from '@components/ProtectedRoute';

// Lazy loading de componentes de gerente
const GerenteDashboard = lazy(() => import('@pages/gerente/gerenteDashboard'));

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

import ProtectedRoute from '@components/ProtectedRoute';
import { lazyWithRetry } from '@helpers/lazyWithRetry';

// Lazy loading de componentes de administrador con retry
const Users = lazyWithRetry(() => import('@pages/Users'));
const AuditLogs = lazyWithRetry(() => import('@pages/adm/AuditLogs'));

export const adminRoutes = [
  {
    path: '/users',
    element: (
      <ProtectedRoute allowedRoles={['administrador']}>
        <Users />
      </ProtectedRoute>
    )
  },
  {
    path: '/admin/auditoria',
    element: (
      <ProtectedRoute allowedRoles={['administrador']}>
        <AuditLogs />
      </ProtectedRoute>
    )
  }
];

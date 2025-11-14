import { lazy } from 'react';
import ProtectedRoute from '@components/ProtectedRoute';

// Lazy loading de componentes de administrador
const Users = lazy(() => import('@pages/Users'));
const AuditLogs = lazy(() => import('@pages/adm/AuditLogs'));

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

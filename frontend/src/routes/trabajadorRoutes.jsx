import ProtectedRoute from '@components/ProtectedRoute';
import { lazyWithRetry } from '@helpers/lazyWithRetry';

// Lazy loading de componentes de trabajador con retry
const TrabajadorDashboard = lazyWithRetry(() => import('@pages/trabajador-tienda/TrabajadorDashboard'));
const ProductosTrabajador = lazyWithRetry(() => import('@pages/trabajador-tienda/Productos'));
const MaterialesTrabajador = lazyWithRetry(() => import('@pages/trabajador-tienda/Materiales'));
const OperacionesTrabajador = lazyWithRetry(() => import('@pages/trabajador-tienda/TrabajadorOperaciones'));
const ClientesStaff = lazyWithRetry(() => import('@pages/trabajador-tienda/Clientes'));
const ProveedoresStaff = lazyWithRetry(() => import('@pages/trabajador-tienda/Proveedores'));
const PapelesStaff = lazyWithRetry(() => import('@pages/trabajador-tienda/Papeles'));
const ServicioCorreo = lazyWithRetry(() => import('@pages/trabajador-tienda/ServicioCorreo'));
const EncuestasTrabajador = lazyWithRetry(() => import('@pages/trabajador-tienda/Encuesta'));

// Roles permitidos para trabajadores (se puede acceder también con admin y gerente)
const trabajadorRoles = ['administrador', 'gerente', 'trabajador_tienda'];

export const trabajadorRoutes = [
  {
    path: '/trabajador/dashboard',
    element: (
      <ProtectedRoute allowedRoles={trabajadorRoles}>
        <TrabajadorDashboard />
      </ProtectedRoute>
    )
  },
  {
    path: '/trabajador/products',
    element: (
      <ProtectedRoute allowedRoles={trabajadorRoles}>
        <ProductosTrabajador />
      </ProtectedRoute>
    )
  },
  {
    path: '/trabajador/materiales',
    element: (
      <ProtectedRoute allowedRoles={trabajadorRoles}>
        <MaterialesTrabajador />
      </ProtectedRoute>
    )
  },
  {
    path: '/trabajador/operations',
    element: (
      <ProtectedRoute allowedRoles={trabajadorRoles}>
        <OperacionesTrabajador />
      </ProtectedRoute>
    )
  },
  {
    path: '/trabajador/clientes',
    element: (
      <ProtectedRoute allowedRoles={trabajadorRoles}>
        <ClientesStaff />
      </ProtectedRoute>
    )
  },
  {
    path: '/trabajador/proveedores',
    element: (
      <ProtectedRoute allowedRoles={trabajadorRoles}>
        <ProveedoresStaff />
      </ProtectedRoute>
    )
  },
  {
    path: '/trabajador/papeles',
    element: (
      <ProtectedRoute allowedRoles={trabajadorRoles}>
        <PapelesStaff />
      </ProtectedRoute>
    )
  },
  {
    path: '/trabajador/correos',
    element: (
      <ProtectedRoute allowedRoles={trabajadorRoles}>
        <ServicioCorreo />
      </ProtectedRoute>
    )
  },
  {
    path: '/trabajador/encuestas',
    element: (
      <ProtectedRoute allowedRoles={trabajadorRoles}>
        <EncuestasTrabajador />
      </ProtectedRoute>
    )
  },
  {
    path: '/trabajador/encuestas/:id',
    element: (
      <ProtectedRoute allowedRoles={trabajadorRoles}>
        <EncuestasTrabajador />
      </ProtectedRoute>
    )
  }
];

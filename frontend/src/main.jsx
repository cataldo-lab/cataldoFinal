import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { lazy, Suspense } from 'react';
import { AuthProvider } from '@context/AuthContext';

// Importaciones estáticas solo para componentes críticos
import Error404 from '@pages/Error404';
import Navbar from '@components/Navbar';
import ProtectedRoute from '@components/ProtectedRoute';
// Importar los estilos principales (que incluyen Tailwind)
import '@styles/main.css';

// Lazy loading de páginas - se cargan solo cuando se navega a ellas
const Login = lazy(() => import('@pages/Login'));
const Home = lazy(() => import('@pages/Home'));
const Users = lazy(() => import('@pages/Users'));
const AuditLogs = lazy(() => import('@pages/adm/AuditLogs'));
const TrabajadorDashboard = lazy(() => import('@pages/trabajador-tienda/TrabajadorDashboard'));
const ProductosTrabajador = lazy(() => import('@pages/trabajador-tienda/Productos'));
const MaterialesTrabajador = lazy(() => import('@pages/trabajador-tienda/Materiales'));
const OperacionesTrabajador = lazy(() => import('@pages/trabajador-tienda/TrabajadorOperaciones'));
const ClientesStaff = lazy(() => import('@pages/trabajador-tienda/Clientes'));
const ProveedoresStaff = lazy(() => import('@pages/trabajador-tienda/Proveedores'));
const PapelesStaff = lazy(() => import('@pages/trabajador-tienda/Papeles'));
const ServicioCorreo = lazy(() => import('@pages/trabajador-tienda/ServicioCorreo'));
const EncuestasTrabajador = lazy(() => import('@pages/trabajador-tienda/Encuesta'));
const GerenteDashboard = lazy(() => import('@pages/gerente/gerenteDashboard'));
const ClientePedidos = lazy(() => import('@pages/cliente-tienda/MisPedidos'));
const ClientePerfil = lazy(() => import('@pages/cliente-tienda/MiPerfil'));

// Componente de carga para Suspense
function LoadingFallback() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div>Cargando...</div>
    </div>
  );
}

// Componente Layout para rutas autenticadas
function AuthenticatedLayout() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<LoadingFallback />}>
        <Outlet />
      </Suspense>
    </>
  );
}

// Componente Layout para rutas públicas (sin navbar)
function PublicLayout() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Outlet />
    </Suspense>
  );
}

// Configuración del router
const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <AuthProvider>
        <Outlet />
      </AuthProvider>
    ),
    errorElement: <Error404 />,
    children: [
      // Rutas públicas (sin navbar)
      {
        element: <PublicLayout />,
        children: [
          {
            path: '/auth',
            element: <Login />
          }
        ]
      },
      // Rutas autenticadas (con navbar)
      {
        element: <AuthenticatedLayout />,
        children: [
          {
            path: '/',
            element: (
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            )
          },
          {
            path: '/home',
            element: (
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            )
          },
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
            },
          {
            path: '/trabajador/dashboard',
            element: (
              <ProtectedRoute allowedRoles={['administrador', 'gerente', 'trabajador_tienda']}>
                <TrabajadorDashboard />
              </ProtectedRoute>
            )
          },
          {
            path: '/trabajador/products',
            element:(
              <ProtectedRoute allowedRoles={['administrador', 'gerente', 'trabajador_tienda']}>
                <ProductosTrabajador />
              </ProtectedRoute>
            )
          },
          {
            path: '/trabajador/materiales',
            element:(
              <ProtectedRoute allowedRoles={['administrador', 'gerente', 'trabajador_tienda']}>
                <MaterialesTrabajador />
              </ProtectedRoute>
            )
          },
          {
            path: '/trabajador/operations',
            element:(
              <ProtectedRoute allowedRoles={['administrador', 'gerente', 'trabajador_tienda']}>
                <OperacionesTrabajador />
              </ProtectedRoute>
            )
          },
          {
            path: '/trabajador/clientes',
            element:(
              <ProtectedRoute allowedRoles={['administrador', 'gerente', 'trabajador_tienda']}>
                <ClientesStaff />
              </ProtectedRoute>
            )
          },
          {
            path: '/trabajador/proveedores',
            element:(
              <ProtectedRoute allowedRoles={['administrador', 'gerente', 'trabajador_tienda']}>
                <ProveedoresStaff />
              </ProtectedRoute>
            )
          },
          {
            path: '/trabajador/papeles',
            element:(
              <ProtectedRoute allowedRoles={['administrador', 'gerente', 'trabajador_tienda']}>
                <PapelesStaff />
              </ProtectedRoute>
            )
          },
          {
            path: '/trabajador/correos',
            element:(
              <ProtectedRoute allowedRoles={['administrador', 'gerente', 'trabajador_tienda']}>
                <ServicioCorreo />
              </ProtectedRoute>
            )
          },
          {
            path: '/trabajador/encuestas',
            element:(
              <ProtectedRoute allowedRoles={['administrador', 'gerente', 'trabajador_tienda']}>
                <EncuestasTrabajador />
              </ProtectedRoute>
            )
          },
          {
            path: '/trabajador/encuestas/:id',
            element:(
              <ProtectedRoute allowedRoles={['administrador', 'gerente', 'trabajador_tienda']}>
                <EncuestasTrabajador />
              </ProtectedRoute>
            )
          },
          {
            path: '/gerente/dashboard',
            element:(
              <ProtectedRoute allowedRoles={['administrador', 'gerente']}>
                <GerenteDashboard />
              </ProtectedRoute>
            )
          },
          {
            path: '/cliente/pedidos',
            element:(
              <ProtectedRoute allowedRoles={['cliente']}>
                <ClientePedidos />
              </ProtectedRoute>
            )
          },
          {
            path: '/cliente/profile',
            element:(
              <ProtectedRoute allowedRoles={['cliente']}>
                <ClientePerfil />
              </ProtectedRoute>
            )
          }


        ]
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);
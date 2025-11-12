import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { AuthProvider } from '@context/AuthContext';
import Login from '@pages/Login';
import Home from '@pages/Home';
import Users from '@pages/Users';

import Error404 from '@pages/Error404';
import Navbar from '@components/Navbar';
import ProtectedRoute from '@components/ProtectedRoute';
import TrabajadorDashboard from '@pages/trabajador-tienda/TrabajadorDashboard';
import AuditLogs from '@pages/adm/AuditLogs';
import ProductosTrabajador from '@pages/trabajador-tienda/Productos';
import MaterialesTrabajador from '@pages/trabajador-tienda/Materiales';
import OperacionesTrabajador from '@pages/trabajador-tienda/TrabajadorOperaciones';
import ClientesStaff from '@pages/trabajador-tienda/Clientes';
import ProveedoresStaff from '@pages/trabajador-tienda/Proveedores';
import PapelesStaff from '@pages/trabajador-tienda/Papeles';
import ServicioCorreo from '@pages/trabajador-tienda/ServicioCorreo';
import EncuestasTrabajador from '@pages/trabajador-tienda/Encuesta';
import GerenteDashboard from '@pages/gerente/gerenteDashboard';
import ClientePedidos from '@pages/cliente-tienda/MisPedidos';
import ClientePerfil from '@pages/cliente-tienda/MiPerfil';
// Importar los estilos principales (que incluyen Tailwind)
import '@styles/main.css';

// Componente Layout para rutas autenticadas
function AuthenticatedLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

// Componente Layout para rutas públicas (sin navbar)
function PublicLayout() {
  return <Outlet />;
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
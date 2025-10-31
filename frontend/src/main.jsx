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
        

        ]
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);
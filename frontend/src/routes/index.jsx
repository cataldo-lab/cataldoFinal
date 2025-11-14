import { lazy } from 'react';
import { createBrowserRouter, Outlet } from "react-router-dom";
import { AuthProvider } from '@context/AuthContext';
import ProtectedRoute from '@components/ProtectedRoute';
import Navbar from '@components/Navbar';

// Importar las rutas por rol
import { adminRoutes } from './adminRoutes';
import { trabajadorRoutes } from './trabajadorRoutes';
import { gerenteRoutes } from './gerenteRoutes';
import { clienteRoutes } from './clienteRoutes';

// Lazy loading solo para páginas comunes
const Login = lazy(() => import('@pages/Login'));
const Home = lazy(() => import('@pages/Home'));
const Error404 = lazy(() => import('@pages/Error404'));

// Layout para rutas autenticadas (con navbar)
function AuthenticatedLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

// Layout para rutas públicas (sin navbar)
function PublicLayout() {
  return <Outlet />;
}

// Configuración del router
export const router = createBrowserRouter([
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
          // Rutas comunes
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
          // Rutas de administrador
          ...adminRoutes,
          // Rutas de trabajador
          ...trabajadorRoutes,
          // Rutas de gerente
          ...gerenteRoutes,
          // Rutas de cliente
          ...clienteRoutes
        ]
      }
    ]
  }
]);

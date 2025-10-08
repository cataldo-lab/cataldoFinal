import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { AuthProvider } from '@context/AuthContext';
import Login from '@pages/Login';
import Home from '@pages/Home';
import Users from '@pages/Users';
import Register from '@pages/Register';
import Error404 from '@pages/Error404';
import Navbar from '@components/Navbar';
import ProtectedRoute from '@components/ProtectedRoute';
import TrabajadorDashboard from '@pages/trabajador-tienda/TrabajadorDashboard';

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
          },
          {
            path: '/register',
            element: <Register />
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
            path: 'trabajador/dashboard',
            element: (
              <ProtectedRoute allowedRoles={['administrador', 'gerente', 'trabajador_tienda']}>
                <TrabajadorDashboard />
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
=============================================================================
                    REFERENCIA RÁPIDA - FRONTEND
                 Quick Reference Guide for Developers
=============================================================================

TABLA 1: DIRECTORIOS CLAVE Y CONTENIDO
═════════════════════════════════════════════════════════════════════════

CARPETA               │ CONTENIDO                    │ ARCHIVOS
──────────────────────┼──────────────────────────────┼─────────────────────
/src/components       │ Componentes reutilizables    │ 30+
/src/pages            │ Páginas completas            │ 19
/src/hooks            │ Custom React hooks           │ 60+
/src/services         │ Llamadas a API               │ 16
/src/context          │ Context API (Auth)           │ 1
/src/helpers          │ Funciones de utilidad        │ 7
/src/validaciones     │ Reglas de validación         │ 2
/src/styles           │ CSS (Tailwind)               │ 2+
/src/assets           │ Recursos (img, etc)          │ N/A

═════════════════════════════════════════════════════════════════════════

TABLA 2: COMANDOS IMPORTANTES
═════════════════════════════════════════════════════════════════════════

npm run dev              │ Inicia server desarrollo (localhost:5173)
npm run build            │ Build producción optimizado
npm run preview          │ Previsualiza build (puerto 443)
npm run lint             │ Ejecuta ESLint en todo el código
npm run lint:css         │ Ejecuta Stylelint en CSS
npm install              │ Instala dependencias

═════════════════════════════════════════════════════════════════════════

TABLA 3: RUTAS PRINCIPALES POR ROL
═════════════════════════════════════════════════════════════════════════

ADMIN ROUTES:
  /users                     │ Gestión de usuarios
  /admin/auditoria           │ Logs de auditoría

GERENTE ROUTES:
  /gerente/dashboard         │ Dashboard gerente

TRABAJADOR ROUTES:
  /trabajador/dashboard      │ Dashboard
  /trabajador/products       │ Productos
  /trabajador/materiales     │ Materiales
  /trabajador/operations     │ Operaciones
  /trabajador/clientes       │ Clientes
  /trabajador/proveedores    │ Proveedores
  /trabajador/papeles        │ Documentos
  /trabajador/correos        │ Correos
  /trabajador/encuestas      │ Encuestas

CLIENTE ROUTES:
  /cliente/pedidos           │ Mis pedidos
  /cliente/profile           │ Mi perfil

PUBLIC ROUTES:
  /auth                      │ Login
  /register                  │ Registro (si existe)

═════════════════════════════════════════════════════════════════════════

TABLA 4: SERVICIOS API Y SUS FUNCIONES
═════════════════════════════════════════════════════════════════════════

auth.service.js              │ login, register, logout, refresh token
user.service.js              │ CRUD de usuarios
cliente.service.js           │ CRUD de clientes
clienteData.service.js       │ GET detalles de cliente
producto.service.js          │ CRUD de productos
materiales.service.js        │ CRUD de materiales, control de stock
proveedor.service.js         │ CRUD de proveedores
operacion.service.js         │ CRUD de operaciones
papeles.service.js           │ CRUD de documentos
encuesta.service.js          │ CRUD de encuestas
correo.service.js            │ Envío y gestión de correos
dashboard.service.js         │ Datos para dashboards
audit.service.js             │ GET logs de auditoría
direccion.service.js         │ CRUD de direcciones
trabajadorTienda.service.js  │ GET datos de trabajador
root.service.js              │ Config global, axios base

═════════════════════════════════════════════════════════════════════════

TABLA 5: COMPONENTES REUTILIZABLES
═════════════════════════════════════════════════════════════════════════

COMPONENTE          │ UBICACIÓN                  │ PROPÓSITO
────────────────────┼────────────────────────────┼──────────────────────
Navbar              │ /components/               │ Navegación principal
ProtectedRoute      │ /components/               │ Protección por rol
Form                │ /components/               │ Formulario genérico
Table               │ /components/               │ Tabla genérica
Search              │ /components/               │ Búsqueda
Popups/Modales      │ /components/popup/         │ Modales por rol
ClientesIcons       │ /components/icons/         │ Íconos custom

═════════════════════════════════════════════════════════════════════════

TABLA 6: TECNOLOGÍAS Y VERSIONES
═════════════════════════════════════════════════════════════════════════

LIBRERÍA              │ VERSIÓN    │ PROPÓSITO
──────────────────────┼────────────┼─────────────────────────
React                 │ 18.3.1     │ Framework UI
React DOM             │ 18.3.1     │ Renderizado
React Router DOM      │ 6.26.1     │ Enrutamiento SPA
React Hook Form       │ 7.66.0     │ Gestión de formularios
React Tabulator       │ 0.21.0     │ Tablas avanzadas
React Icons           │ 5.5.0      │ Iconografía SVG
SweetAlert2           │ 11.6.13    │ Alertas personalizadas
React Toastify       │ 11.0.5     │ Notificaciones toast
Axios                 │ 1.7.5      │ Cliente HTTP
Tailwind CSS          │ 4.1.13     │ Framework CSS
Vite                  │ 5.4.1      │ Bundler
ESLint                │ 9.9.0      │ Linter JS
Stylelint             │ 16.24.0    │ Linter CSS
JWT Decode            │ 4.0.0      │ Decodificación JWT
JS Cookie             │ 3.0.5      │ Manejo de cookies
Lodash                │ 4.17.21    │ Utilidades JS
Rut.js                │ 2.1.0      │ Validar RUT chileno

═════════════════════════════════════════════════════════════════════════

TABLA 7: PATRONES Y CONVENCIONES
═════════════════════════════════════════════════════════════════════════

PATRÓN                │ DÓNDE SE USA              │ EJEMPLO
──────────────────────┼───────────────────────────┼──────────────────────
Custom Hooks          │ /hooks/                   │ useClientes, useProductos
Service Layer         │ /services/                │ cliente.service.js
Context API           │ /context/                 │ AuthContext
Component Comp.       │ /components/              │ Form, Table, Navbar
Page Component        │ /pages/                   │ Clientes.jsx
Lazy Loading          │ main.jsx (Router)         │ lazy(() => import(...))
Protected Routes      │ ProtectedRoute.jsx        │ allowedRoles={['admin']}
Modal Pattern         │ /components/popup/        │ SweetAlert2 + Form
Validation Rules      │ /validaciones/            │ validaciones.js

═════════════════════════════════════════════════════════════════════════

TABLA 8: ESTRUCTURA TÍPICA DE UN HOOK
═════════════════════════════════════════════════════════════════════════

ESTRUCTURA:
  ├── useState (estado local)
  ├── useEffect (efectos secundarios)
  ├── Llamadas a servicios (service.method())
  ├── Manejo de errores (try/catch)
  ├── Alertas (SweetAlert2, toast)
  └── return { data, loading, error, functions }

EJEMPLO:
  export function useClientes() {
    const [clientes, setClientes] = useState([]);
    const [loading, setLoading] = useState(false);
    
    const getClientes = async () => {
      setLoading(true);
      try {
        const data = await cliente.service.getClientes();
        setClientes(data);
      } catch (error) {
        Swal.fire('Error', error.message, 'error');
      } finally {
        setLoading(false);
      }
    };
    
    return { clientes, loading, getClientes };
  }

═════════════════════════════════════════════════════════════════════════

TABLA 9: ESTRUCTURA TÍPICA DE UN SERVICIO
═════════════════════════════════════════════════════════════════════════

ESTRUCTURA:
  ├── import { axiosInstance } from './root.service'
  ├── const API_BASE = '/api/endpoint'
  ├── export const getAll = () => axiosInstance.get(API_BASE)
  ├── export const getById = (id) => axiosInstance.get(`${API_BASE}/${id}`)
  ├── export const create = (data) => axiosInstance.post(API_BASE, data)
  ├── export const update = (id, data) => axiosInstance.put(`${API_BASE}/${id}`, data)
  └── export const delete = (id) => axiosInstance.delete(`${API_BASE}/${id}`)

═════════════════════════════════════════════════════════════════════════

TABLA 10: CONFIGURACIÓN DE RUTAS (main.jsx)
═════════════════════════════════════════════════════════════════════════

ESTRUCTURA DE RUTAS:

[ROOT]
  AuthProvider
    BrowserRouter
      [PUBLIC]
        /auth → Login
      [AUTHENTICATED]
        Navbar
        ProtectedRoute (verificar role)
          /home → Home
          /users → Users (admin only)
          /trabajador/* → Trabajador routes
          /gerente/* → Gerente routes
          /cliente/* → Cliente routes

═════════════════════════════════════════════════════════════════════════

TABLA 11: VALIDACIONES DISPONIBLES
═════════════════════════════════════════════════════════════════════════

UBICACIÓN             │ VALIDACIONES
──────────────────────┼────────────────────────────────────────────────
/validaciones/        │ Email, teléfono, contraseña, general
/helpers/validacion/  │ RUT chileno (rutRegex.js)
                      │ Fechas LATAM (fechaLatam.js)
                      │ Dominios de email (emailsDomains.js)

═════════════════════════════════════════════════════════════════════════

TABLA 12: ARCHIVOS DE CONFIGURACIÓN
═════════════════════════════════════════════════════════════════════════

ARCHIVO                  │ PROPÓSITO
─────────────────────────┼──────────────────────────────────────────────
package.json             │ Dependencias, scripts, info del proyecto
vite.config.js           │ Config de bundler, aliases, code splitting
tailwind.config.js       │ Config de Tailwind CSS
postcss.config.js        │ Plugins de PostCSS
eslint.config.js         │ Reglas de linting
.stylelintrc.json        │ Reglas de linting de CSS
.env                     │ Variables de entorno
index.html               │ HTML principal (entry point)

═════════════════════════════════════════════════════════════════════════

TABLA 13: FLUJOS PRINCIPALES
═════════════════════════════════════════════════════════════════════════

FLUJO DE LOGIN:
  Login.jsx → useLogin hook → auth.service → JWT token → AuthContext
  → Redirect a home según rol

FLUJO DE CRUD:
  Page.jsx → useXXX hook → XXX.service → API → Response → setState
  → Re-render con nuevos datos

FLUJO DE AUTORIZACIÓN:
  ProtectedRoute → Lee AuthContext → Verifica token → Verifica role
  → Renderiza página o Redirect a /auth

═════════════════════════════════════════════════════════════════════════

TABLA 14: ALIASES DE IMPORTACIÓN
═════════════════════════════════════════════════════════════════════════

ALIAS               │ APUNTA A              │ EJEMPLO
────────────────────┼───────────────────────┼────────────────────────
@components         │ /src/components       │ import Form from '@components/Form'
@hooks              │ /src/hooks            │ import useClientes from '@hooks/clientes'
@pages              │ /src/pages            │ import Home from '@pages/Home'
@services           │ /src/services         │ import * as api from '@services/cliente'
@context            │ /src/context          │ import AuthContext from '@context/Auth'
@helpers            │ /src/helpers          │ import { formatData } from '@helpers'
@styles             │ /src/styles           │ import '@styles/main.css'
@assets             │ /src/assets           │ import logo from '@assets/logo.png'
@validaciones       │ /src/validaciones     │ import { rules } from '@validaciones'

═════════════════════════════════════════════════════════════════════════

TABLA 15: ATAJOS Y TIPS ÚTILES
═════════════════════════════════════════════════════════════════════════

TAREA                         │ UBICACIÓN ARCHIVO             │ DESCRIPCIÓN
──────────────────────────────┼───────────────────────────────┼─────────────────
Agregar nueva página          │ /src/pages/                   │ Crear .jsx
Agregar nuevo componente      │ /src/components/              │ Crear .jsx
Agregar nuevo hook            │ /src/hooks/{modulo}/          │ Crear use*.jsx
Agregar nuevo servicio        │ /src/services/                │ Crear *.service.js
Cambiar estilos globales      │ /src/styles/main.css          │ Editar CSS
Agregar validación            │ /src/validaciones/            │ Editar validaciones.js
Proteger nueva ruta           │ /src/main.jsx                 │ Agregar ProtectedRoute
Cambiar colores Tailwind      │ /src/styles/main.css          │ @theme colors

═════════════════════════════════════════════════════════════════════════

=============================================================================
        DIAGRAMA DE FLUJO - ARQUITECTURA FRONTEND
=============================================================================

APP STRUCTURE:
┌─────────────────────────────────────────────────────────────────────────┐
│                            index.html                                   │
│                        (Entry point HTML)                               │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           main.jsx                                      │
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │         AuthProvider (AuthContext.jsx)                          │  │
│  │  ┌───────────────────────────────────────────────────────────┐ │  │
│  │  │          BrowserRouter (React Router)                    │ │  │
│  │  │  ┌─────────────────────────────────────────────────────┐ │ │  │
│  │  │  │                                                     │ │ │  │
│  │  │  │  PUBLIC ROUTES        AUTHENTICATED ROUTES         │ │ │  │
│  │  │  │  ─────────────        ──────────────────           │ │ │  │
│  │  │  │  /auth (Login)         PublicLayout                │ │ │  │
│  │  │  │  /register             ├─ Navbar                   │ │ │  │
│  │  │  │                        └─ AuthenticatedLayout       │ │ │  │
│  │  │  │                             ├─ ProtectedRoute       │ │ │  │
│  │  │  │                             └─ Pages by Role:       │ │ │  │
│  │  │  │                                ├─ admin/auditoria   │ │ │  │
│  │  │  │                                ├─ trabajador/*      │ │ │  │
│  │  │  │                                ├─ gerente/dashboard │ │ │  │
│  │  │  │                                └─ cliente/*         │ │ │  │
│  │  │  │                                                     │ │ │  │
│  │  │  └─────────────────────────────────────────────────────┘ │ │  │
│  │  └───────────────────────────────────────────────────────────┘ │  │
│  └─────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘

=============================================================================
        FLUJO DE AUTENTICACIÓN Y ESTADO
=============================================================================

Login Page
    ▼
useLogin Hook → Auth Service (login)
    ▼
JWT Token recibido
    ▼
AuthContext.setUser(user, token)
    ▼
Token guardado en localStorage/cookies
    ▼
Redirect a Home o Dashboard por rol
    ▼
AuthContext proporciona estado a toda la app
    ▼
ProtectedRoute verifica role access
    ▼
Página renderizada o Redirect si no autorizado

=============================================================================
        FLUJO DE DATOS - PATRÓN DE COMPONENTES
=============================================================================

PAGE COMPONENT (e.g., /pages/trabajador-tienda/Productos.jsx)
    │
    ├──▶ useProductos Hook (obtiene datos)
    │        │
    │        └──▶ producto.service.js (llamada API)
    │               │
    │               ▼
    │          axios (HTTP client)
    │               │
    │               ▼
    │          Backend API
    │
    ├──▶ State Management (useState, hooks)
    │
    ├──▶ Render componentes reutilizables:
    │    ├── <Navbar />          (Navegación)
    │    ├── <Search />          (Búsqueda)
    │    ├── <Table />           (React Tabulator)
    │    └── <Form />            (Formulario)
    │
    └──▶ Render Popups/Modales:
         ├── <PopupCreateProducto />
         ├── <PopupUpdateProducto />
         └── <PopupDeleteProducto />

=============================================================================
        JERARQUÍA DE CARPETAS - RESUMEN VISUAL
=============================================================================

frontend/
│
├── CONFIG & BUILD
│   ├── vite.config.js          (Bundler config)
│   ├── package.json            (Dependencies)
│   ├── tailwind.config.js      (CSS framework)
│   ├── eslint.config.js        (Code linting)
│   └── postcss.config.js       (CSS processing)
│
├── PUBLIC
│   └── public/                 (Static assets)
│
└── SRC
    │
    ├── CORE (Application layer)
    │   ├── main.jsx            (Router setup)
    │   ├── index.html          (HTML entry)
    │   └── context/            (Global state - Auth)
    │
    ├── ROUTING & LAYOUT
    │   ├── pages/              (Full page components)
    │   │   ├── adm/
    │   │   ├── gerente/
    │   │   ├── trabajador-tienda/
    │   │   └── cliente-tienda/
    │   └── components/
    │       ├── Navbar.jsx      (Navigation)
    │       ├── ProtectedRoute/ (Auth guard)
    │       └── ... (other reusable components)
    │
    ├── BUSINESS LOGIC
    │   ├── hooks/              (React Hooks - 60+ hooks)
    │   │   ├── auth/
    │   │   ├── clientes/
    │   │   ├── productos/
    │   │   ├── materiales/
    │   │   ├── operaciones/
    │   │   └── ...
    │   │
    │   ├── services/           (API calls - 16 services)
    │   │   ├── auth.service.js
    │   │   ├── user.service.js
    │   │   ├── cliente.service.js
    │   │   └── ...
    │   │
    │   └── helpers/            (Utility functions)
    │       ├── formatData.js
    │       ├── validacion/
    │       └── material/
    │
    ├── FORMS & VALIDATION
    │   ├── validaciones/       (Form validation rules)
    │   └── components/         (Form components)
    │
    ├── STYLING
    │   └── styles/
    │       ├── main.css        (Tailwind setup)
    │       └── ...
    │
    └── ASSETS
        └── assets/             (Images, SVGs, etc)

=============================================================================
        COMPONENTES PRINCIPALES Y SUS DEPENDENCIAS
=============================================================================

┌──────────────────────────────────────────────────────────────────┐
│  Navbar                                                          │
├──────────────────────────────────────────────────────────────────┤
│ DEPENDENCIAS:                                                    │
│  • React Router (useNavigate, useLocation)                       │
│  • AuthContext (useAuth)                                         │
│  • React Icons                                                   │
│  • Tailwind CSS                                                  │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│  ProtectedRoute                                                  │
├──────────────────────────────────────────────────────────────────┤
│ DEPENDENCIAS:                                                    │
│  • React Router (Navigate)                                       │
│  • AuthContext (useAuth)                                         │
│  • Verifica: autenticación + rol                                 │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│  Table (React Tabulator)                                         │
├──────────────────────────────────────────────────────────────────┤
│ DEPENDENCIAS:                                                    │
│  • react-tabulator                                               │
│  • Custom hooks (useTable, useXXXX)                             │
│  • Formatters (helpers)                                          │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│  Form                                                            │
├──────────────────────────────────────────────────────────────────┤
│ DEPENDENCIAS:                                                    │
│  • react-hook-form                                               │
│  • validaciones/ (validation rules)                              │
│  • helpers/ (sweetAlert, formatters)                             │
│  • Services (save/update calls)                                  │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│  Popups/Modals                                                   │
├──────────────────────────────────────────────────────────────────┤
│ DEPENDENCIAS:                                                    │
│  • SweetAlert2 (modal base)                                      │
│  • Form component                                                │
│  • Hooks (create, update, delete)                               │
└──────────────────────────────────────────────────────────────────┘

=============================================================================
        SERVICIOS API - MAPEO DE ENTIDADES
=============================================================================

SERVICE FILE                  │ ENTIDAD            │ ENDPOINTS
─────────────────────────────┼────────────────────┼──────────────────────
auth.service.js              │ Autenticación      │ login, register, logout
user.service.js              │ Usuarios           │ CRUD usuarios
cliente.service.js           │ Clientes           │ CRUD clientes
clienteData.service.js       │ Datos Cliente      │ GET cliente detalle
producto.service.js          │ Productos          │ CRUD productos
materiales.service.js        │ Materiales         │ CRUD materiales + stock
proveedor.service.js         │ Proveedores        │ CRUD proveedores
operacion.service.js         │ Operaciones        │ CRUD operaciones
papeles.service.js           │ Papeles/Docs       │ CRUD documentos
encuesta.service.js          │ Encuestas          │ CRUD encuestas
correo.service.js            │ Correos            │ Envío/gestión correos
dashboard.service.js         │ Dashboard          │ GET stats, analytics
audit.service.js             │ Auditoría          │ GET audit logs
direccion.service.js         │ Direcciones        │ CRUD direcciones
trabajadorTienda.service.js  │ Trabajador Tienda  │ GET datos trabajador
root.service.js              │ Base Config        │ Config global, axios setup

=============================================================================
        HOOKS - ORGANIZACIÓN POR FUNCIONALIDAD
=============================================================================

AUTH HOOKS (2):
  • useLogin - login logic, token handling
  • useRegister - register form logic

CLIENTE HOOKS (7):
  • useCliente - single cliente detail
  • useClienteDetalle - client detail page
  • useClientes - list all clientes
  • useCreateCliente - create cliente
  • useDeleteCliente - delete cliente
  • useSearchClientes - search functionality
  • useUpdateCliente - update cliente

PRODUCTO HOOKS (2):
  • useProductos - list all products
  • useDeleteProducto - delete product

MATERIAL HOOKS (11):
  • useAlertasStock - stock alerts
  • useCreateMaterial - create
  • useDeleteMaterial - delete
  • useGetMaterialById - get by ID
  • useGetMateriales - list all
  • useMaterial - single detail
  • useMaterialRepresentante - supplier relation
  • useMateriales - list (alternative)
  • useMaterialesConRepresentantes - with suppliers
  • useUpdateMaterial - update
  • useUpdateStock - update stock quantity

OPERACION HOOKS (7):
  • useCreateOperacion - create
  • useDashboardOperaciones - dashboard data
  • useDeleteOperacion - delete
  • useEstadoOperacion - operation status
  • useOperacion - single detail
  • useOperaciones - list all
  • useUpdateOperacion - update

PROVEEDOR HOOKS (10):
  • useAnalisisProveedor - supplier analysis
  • useCreateProveedor - create
  • useCreateProveedorConRepresentante - create with rep
  • useDeleteProveedor - delete
  • useGetProveedorById - get by ID
  • useGetProveedores - list all
  • useProveedoresConRepresentantes - with reps
  • useProveedoresSafe - safe GET
  • useRepresentantes - supplier representatives
  • useUpdateProveedor - update

USUARIO HOOKS (5):
  • useAudit - audit logs
  • useDeleteUser - delete
  • useEditUser - edit/update
  • useGetUsers - list all
  • usePostUsers - create

OTROS HOOKS:
  • useTable - tabla utilities
  • useEncuesta - surveys
  • useCorreo - emails
  • useDashboard - dashboard data
  • useGerente - manager data
  • usePapeles - documents

=============================================================================

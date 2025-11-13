=============================================================================
        ESTRUCTURA DEL PROYECTO FRONTEND - CATALDO FURNITURE
=============================================================================

DIRECTORIO PRINCIPAL: /home/user/cataldoFinal/frontend/

=============================================================================
1. DIRECTORIO RAÍZ - ARCHIVOS DE CONFIGURACIÓN PRINCIPALES
=============================================================================

/home/user/cataldoFinal/frontend/
│
├── package.json                    - Dependencias y scripts del proyecto
├── package-lock.json               - Lock de versiones de dependencias
├── index.html                      - HTML principal (entry point)
│
├── vite.config.js                  - Configuración de Vite (bundler)
├── postcss.config.js               - Configuración de PostCSS
├── tailwind.config.js              - Configuración de Tailwind CSS v4
├── eslint.config.js                - Configuración de ESLint
├── .stylelintrc.json               - Configuración de Stylelint
│
├── .env                            - Variables de entorno
├── .gitignore                      - Archivos ignorados en git
│
├── public/                         - Recursos estáticos públicos
└── src/                            - CÓDIGO FUENTE PRINCIPAL

=============================================================================
2. ESTRUCTURA DEL DIRECTORIO /src
=============================================================================

src/
│
├── main.jsx                        - Punto de entrada de la aplicación
│                                     (Configuración de Router y AuthProvider)
│
├── components/                     - Componentes reutilizables
│   ├── Form.jsx                    - Componente de formulario genérico
│   ├── Navbar.jsx                  - Barra de navegación principal
│   ├── ProtectedRoute.jsx          - Componente para rutas protegidas (Auth)
│   ├── Search.jsx                  - Componente de búsqueda
│   ├── Table.jsx                   - Componente de tabla genérica
│   ├── icons/                      - Íconos personalizados
│   │   └── ClientesIcons.jsx
│   ├── operaciones/                - Componentes de operaciones
│   │   └── CrearOperacionModal.jsx
│   ├── popup/                      - Modales y popups
│   │   ├── adm/                    - Modales para administrador
│   │   │   ├── PopUpCreateUser.jsx
│   │   │   └── PopupUpdateUser.jsx
│   │   ├── gerente/                - Modales para gerente
│   │   │   ├── PopupCreateGer.jsx
│   │   │   └── PopupUpdateGer.jsx
│   │   └── trabajadorTienda/       - Modales para trabajador de tienda
│   │       ├── cliente/            - Gestión de clientes
│   │       ├── material/           - Gestión de materiales
│   │       ├── operacion/          - Gestión de operaciones
│   │       └── proveedor/          - Gestión de proveedores
│   └── trabajadorTienda/           - Componentes específicos del trabajador
│       ├── PopupCreateProducto.jsx
│       ├── PopupUpdateProducto.jsx
│       ├── Productos.jsx
│       └── dashboard/
│
├── pages/                          - Páginas principales (vistas completas)
│   ├── Login.jsx                   - Página de login
│   ├── Home.jsx                    - Página de inicio
│   ├── Register.jsx                - Página de registro
│   ├── Users.jsx                   - Gestión de usuarios (Admin)
│   ├── Error404.jsx                - Página de error 404
│   ├── GerenteDashboard.jsx        - Dashboard de gerente (duplicado)
│   ├── adm/                        - Páginas de administrador
│   │   └── AuditLogs.jsx           - Logs de auditoría
│   ├── gerente/                    - Páginas de gerente
│   │   └── gerenteDashboard.jsx    - Dashboard principal gerente
│   ├── trabajador-tienda/          - Páginas de trabajador de tienda
│   │   ├── TrabajadorDashboard.jsx - Dashboard del trabajador
│   │   ├── Productos.jsx           - Gestión de productos
│   │   ├── Materiales.jsx          - Gestión de materiales
│   │   ├── TrabajadorOperaciones.jsx - Gestión de operaciones
│   │   ├── Clientes.jsx            - Gestión de clientes
│   │   ├── Proveedores.jsx         - Gestión de proveedores
│   │   ├── Papeles.jsx             - Gestión de documentos/papeles
│   │   ├── ServicioCorreo.jsx      - Servicio de correo
│   │   └── Encuesta.jsx            - Encuestas
│   └── cliente-tienda/             - Páginas de cliente
│       ├── MisPedidos.jsx          - Mis pedidos
│       └── MiPerfil.jsx            - Mi perfil
│
├── context/                        - Context API para estado global
│   └── AuthContext.jsx             - Contexto de autenticación
│
├── hooks/                          - React Hooks personalizados (60+ hooks)
│   ├── Dashboard/
│   │   ├── useGerenteDashborad.jsx
│   │   └── useTrabajadorDashboard.jsx
│   ├── auth/                       - Hooks de autenticación
│   │   ├── useLogin.jsx
│   │   └── useRegister.jsx
│   ├── clientes/                   - Hooks para gestión de clientes
│   │   ├── useCliente.jsx
│   │   ├── useClienteDetalle.jsx
│   │   ├── useClientes.jsx
│   │   ├── useCreateCliente.jsx
│   │   ├── useDeleteCliente.jsx
│   │   ├── useSearchClientes.jsx
│   │   └── useUpdateCliente.jsx
│   ├── productos/                  - Hooks para productos
│   │   ├── useDeleteProducto.jsx
│   │   └── useProductos.jsx
│   ├── materiales/                 - Hooks para materiales (10+ hooks)
│   │   ├── useAlertasStock.jsx
│   │   ├── useCreateMaterial.jsx
│   │   ├── useDeleteMaterial.jsx
│   │   ├── useGetMaterialById.jsx
│   │   ├── useGetMateriales.jsx
│   │   ├── useMaterial.jsx
│   │   ├── useMaterialRepresentante.jsx
│   │   ├── useMateriales.jsx
│   │   ├── useMaterialesConRepresentantes.jsx
│   │   ├── useUpdateMaterial.jsx
│   │   └── useUpdateStock.jsx
│   ├── operaciones/                - Hooks para operaciones
│   │   ├── useCreateOperacion.jsx
│   │   ├── useDashboardOperaciones.jsx
│   │   ├── useDeleteOperacion.jsx
│   │   ├── useEstadoOperacion.jsx
│   │   ├── useOperacion.jsx
│   │   ├── useOperaciones.jsx
│   │   └── useUpdateOperacion.jsx
│   ├── prooveedores/               - Hooks para proveedores (10+ hooks)
│   │   ├── useAnalisisProveedor.jsx
│   │   ├── useCreateProveedor.jsx
│   │   ├── useCreateProveedorConRepresentante.jsx
│   │   ├── useDeleteProveedor.jsx
│   │   ├── useGetProveedorById.jsx
│   │   ├── useGetProveedores.jsx
│   │   ├── useProveedoresConRepresentantes.jsx
│   │   ├── useProveedoresSafe.jsx
│   │   ├── useRepresentantes.jsx
│   │   └── useUpdateProveedor.jsx
│   ├── users/                      - Hooks para gestión de usuarios
│   │   ├── useAudit.jsx
│   │   ├── useDeleteUser.jsx
│   │   ├── useEditUser.jsx
│   │   ├── useGetUsers.jsx
│   │   └── usePostUsers.jsx
│   ├── encuestas/                  - Hooks para encuestas
│   ├── correos/                    - Hooks para correos
│   ├── papeles/                    - Hooks para papeles/documentos
│   ├── dashboard/                  - Hooks de dashboard
│   ├── gerente/                    - Hooks para gerente
│   ├── table/                      - Hooks de tabla
│   └── otros hooks...
│
├── services/                       - Servicios API (16 servicios)
│   ├── auth.service.js             - Autenticación
│   ├── user.service.js             - Gestión de usuarios
│   ├── cliente.service.js          - Clientes
│   ├── clienteData.service.js      - Datos de cliente
│   ├── producto.service.js         - Productos
│   ├── materiales.service.js       - Materiales
│   ├── proveedor.service.js        - Proveedores
│   ├── operacion.service.js        - Operaciones
│   ├── papeles.service.js          - Papeles/Documentos
│   ├── encuesta.service.js         - Encuestas
│   ├── correo.service.js           - Correos
│   ├── dashboard.service.js        - Dashboard
│   ├── audit.service.js            - Auditoría
│   ├── direcci­on.service.js       - Direcciones
│   ├── trabajadorTienda.service.js - Trabajador tienda
│   └── root.service.js             - Servicio raíz/base
│
├── helpers/                        - Funciones auxiliares
│   ├── formatData.js               - Formateo de datos
│   ├── sweetAlert.js               - Utilidades de alertas
│   ├── validacion/                 - Validaciones específicas
│   │   ├── emailsDomains.js        - Validación de dominios de email
│   │   ├── fechaLatam.js           - Validación de fechas LATAM
│   │   └── rutRegex.js             - Validación de RUT
│   └── material/                   - Utilidades de materiales
│       ├── formatters.js           - Formateadores
│       └── materialUtils.js        - Utilidades generales
│
├── validaciones/                   - Validaciones de formularios
│   ├── index.js                    - Exportaciones principales
│   └── validaciones.js             - Reglas de validación
│
├── styles/                         - Estilos CSS
│   ├── main.css                    - Estilos principales (Tailwind)
│   └── trabajadorTienda/           - Estilos específicos
│
└── assets/                         - Recursos (imágenes, etc)

=============================================================================
3. FRAMEWORK Y LIBRERÍAS UTILIZADAS
=============================================================================

FRAMEWORK PRINCIPAL:
  - React 18.3.1       - Librería UI principal

ROUTING:
  - React Router DOM 6.26.1  - Enrutamiento SPA

FORMULAROS Y VALIDACIÓN:
  - React Hook Form 7.66.0  - Gestión de formularios
  - Validaciones personalizadas en /validaciones

TABLAS:
  - React Tabulator 0.21.0  - Tablas avanzadas

STYLING:
  - Tailwind CSS 4.1.13    - Framework CSS utilities
  - PostCSS 8.5.6          - Procesador CSS
  - Autoprefixer           - Prefijos de navegadores

UI COMPONENTS:
  - React Icons 5.5.0      - Íconos SVG
  - SweetAlert2 11.6.13    - Alertas personalizadas
  - React Toastify 11.0.5  - Notificaciones toast

UTILIDADES:
  - Axios 1.7.5            - Cliente HTTP
  - JWT Decode 4.0.0       - Decodificación de JWT
  - JS Cookie 3.0.5        - Manejo de cookies
  - Lodash 4.17.21         - Utilidades JavaScript
  - Rut.js 2.1.0           - Validación de RUT chileno
  - @FormKit/Tempo 0.1.2   - Manejo de fechas

BUILD TOOL:
  - Vite 5.4.1             - Bundler/Dev server
  - @Vitejs/plugin-react   - Plugin React para Vite

LINTING Y ANÁLISIS:
  - ESLint 9.9.0           - Linter JavaScript
  - Stylelint 16.24.0      - Linter CSS
  - ESLint plugins:
    * eslint-plugin-react
    * eslint-plugin-react-hooks
    * eslint-plugin-react-refresh

=============================================================================
4. ARQUITECTURA Y PATRONES
=============================================================================

PATRÓN DE ENRUTAMIENTO:
  - Rutas públicas (sin Navbar):
    * /auth (Login)
  - Rutas autenticadas (con Navbar):
    * Rutas por rol: administrador, gerente, trabajador_tienda, cliente

PROTECCIÓN DE RUTAS:
  - Componente ProtectedRoute en /components/ProtectedRoute.jsx
  - Verifica rol del usuario en AuthContext

GESTIÓN DE ESTADO:
  - AuthContext.jsx para autenticación global
  - Hooks personalizados para estado de negocio específico
  - React Query pattern con hooks CRUD

ARQUITECTURA DE SERVICIOS:
  - Servicios separados por entidad de negocio
  - Configuración centralizada en root.service.js
  - Client HTTP centralizado con axios

COMPONENTES:
  - Componentes por rol (adm, gerente, trabajador-tienda, cliente-tienda)
  - Componentes reutilizables genéricos
  - Popups/Modales centralizados

=============================================================================
5. ROLES DE USUARIO Y RUTAS ASOCIADAS
=============================================================================

ADMINISTRADOR ('administrador'):
  - /home                          - Home principal
  - /users                         - Gestión de usuarios
  - /admin/auditoria               - Logs de auditoría
  - /trabajador/dashboard          - Dashboard de trabajador
  - /trabajador/products           - Productos
  - /trabajador/materiales         - Materiales
  - /trabajador/operations         - Operaciones
  - /trabajador/clientes           - Clientes
  - /trabajador/proveedores        - Proveedores
  - /trabajador/papeles            - Papeles
  - /trabajador/correos            - Correos
  - /trabajador/encuestas          - Encuestas
  - /gerente/dashboard             - Dashboard gerente

GERENTE ('gerente'):
  - /home                          - Home principal
  - /trabajador/* (todas las rutas de trabajador)
  - /gerente/dashboard             - Dashboard gerente

TRABAJADOR TIENDA ('trabajador_tienda'):
  - /home                          - Home principal
  - /trabajador/* (todas las rutas de trabajador)

CLIENTE ('cliente'):
  - /home                          - Home principal
  - /cliente/pedidos               - Mis pedidos
  - /cliente/profile               - Mi perfil

=============================================================================
6. CARACTERÍSTICAS PRINCIPALES
=============================================================================

AUTENTICACIÓN:
  - Login/Register con JWT
  - AuthContext para estado global
  - Decodificación de tokens
  - Persistencia con cookies

GESTIÓN DE DATOS:
  - CRUD completo para múltiples entidades
  - Busca y filtrado avanzado
  - Validaciones personalizadas

INTERFAZ DE USUARIO:
  - Navbar con navegación por rol
  - Tablas interactivas con React Tabulator
  - Modales para crear/editar
  - Alertas y notificaciones personalizadas

ANÁLISIS:
  - Dashboards específicos por rol
  - Logs de auditoría
  - Análisis de proveedores

=============================================================================
7. SCRIPTS DISPONIBLES
=============================================================================

npm run dev              - Inicia servidor de desarrollo (Vite)
npm run build            - Construye para producción
npm run preview          - Previsualiza build de producción
npm run lint             - Ejecuta ESLint
npm run lint:css         - Ejecuta Stylelint

=============================================================================

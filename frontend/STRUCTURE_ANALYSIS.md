# ANÁLISIS COMPLETO DEL PROYECTO FRONTEND - CATALDO

## 1. ESTRUCTURA DEL PROYECTO

### 1.1 Estadísticas Generales
- **Total de archivos JS/JSX**: 132
- **Total de componentes**: 29 archivos
- **Total de hooks**: 58 archivos (el mayor volumen de código lógico)
- **Total de servicios**: 16 archivos
- **Tamaño total de código fuente**: 22,126 líneas

### 1.2 Estructura de Carpetas

```
src/
├── pages/                    # 14 páginas (componentes de ruta principal)
│   ├── adm/                 # Panel de administrador
│   ├── cliente-tienda/      # Páginas para clientes
│   ├── gerente/             # Panel de gerente
│   ├── trabajador-tienda/   # Panel para trabajadores
│   ├── Login.jsx            # Página de autenticación
│   ├── Home.jsx             # Página principal
│   ├── Users.jsx            # Gestión de usuarios
│   └── Error404.jsx         # Página de error
│
├── components/              # 29 componentes reutilizables
│   ├── popup/              # 13 componentes modales
│   │   ├── trabajadorTienda/
│   │   │   ├── cliente/
│   │   │   ├── proveedor/
│   │   │   ├── material/
│   │   │   └── operacion/
│   │   ├── gerente/
│   │   └── adm/
│   ├── trabajadorTienda/   # Componentes específicos
│   ├── operaciones/        # Lógica de operaciones
│   ├── icons/              # Iconografía
│   ├── Form.jsx            # Componente de formulario
│   ├── Table.jsx           # Tabla genérica
│   ├── Search.jsx          # Búsqueda
│   ├── Navbar.jsx          # Navegación principal
│   ├── ProtectedRoute.jsx  # Control de acceso
│   └── ...otros
│
├── hooks/                   # 58 hooks personalizados (CRÍTICO)
│   ├── auth/               # Autenticación
│   ├── clientes/           # Gestión de clientes
│   ├── materiales/         # Gestión de materiales
│   ├── prooveedores/       # Gestión de proveedores
│   ├── operaciones/        # Operaciones
│   ├── productos/          # Productos
│   ├── papeles/            # Papeles
│   ├── correos/            # Servicio de correos
│   ├── encuestas/          # Encuestas
│   ├── gerente/            # Gestión de gerente
│   ├── dashboard/          # Dashboard
│   ├── table/              # Lógica de tablas
│   ├── users/              # Gestión de usuarios
│   ├── shared/             # Hooks compartidos (useApi genérico)
│   └── ...otros
│
├── services/               # 16 servicios API
│   ├── auth.service.js     # Autenticación
│   ├── cliente.service.js
│   ├── proveedor.service.js
│   ├── producto.service.js
│   ├── materiales.service.js
│   ├── operacion.service.js
│   ├── papeles.service.js
│   ├── correo.service.js
│   ├── encuesta.service.js
│   ├── dashboard.service.js
│   ├── audit.service.js
│   ├── user.service.js
│   ├── trabajadorTienda.service.js
│   ├── clienteData.service.js
│   ├── direccion.service.js
│   └── root.service.js     # Axios configurado
│
├── context/                # Context API
│   └── AuthContext.jsx     # Contexto global de autenticación
│
├── helpers/                # Funciones auxiliares
│   ├── material/
│   └── validacion/
│
├── validaciones/           # Lógica de validación
│
├── styles/                 # Estilos (Tailwind)
│   ├── main.css
│   └── trabajadorTienda/
│
└── assets/                 # Recursos estáticos

```

## 2. DEPENDENCIAS PRINCIPALES

### 2.1 Dependencias Críticas (por impacto en tamaño)

| Dependencia | Versión | Tamaño Estimado | Uso | Criticidad |
|---|---|---|---|---|
| **react** | 18.3.1 | ~42KB | Core framework | CRÍTICA |
| **react-dom** | 18.3.1 | ~130KB | Renderizado DOM | CRÍTICA |
| **react-router-dom** | 6.26.1 | ~70KB | Enrutamiento | CRÍTICA |
| **sweetalert2** | 11.6.13 | ~80KB | Modales/Alertas | GRANDE |
| **react-toastify** | 11.0.5 | ~40KB | Notificaciones | MEDIANO |
| **react-hook-form** | 7.66.0 | ~30KB | Gestión de formularios | MEDIANO |
| **axios** | 1.7.5 | ~15KB | HTTP client | CRÍTICA |
| **react-icons** | 5.5.0 | ~500KB+ | Iconografía | GRANDE |
| **lodash** | 4.17.21 | ~70KB | Utilidades JS | MEDIANO |
| **js-cookie** | 3.0.5 | ~3KB | Manejo de cookies | PEQUEÑO |
| **jwt-decode** | 4.0.0 | ~2KB | Decodificar JWT | PEQUEÑO |
| **rut.js** | 2.1.0 | ~2KB | Validación RUT | PEQUEÑO |
| **@formkit/tempo** | 0.1.2 | ~20KB | Fechas | PEQUEÑO |

**Total aproximado de dependencias**: ~900KB (sin minificar)

### 2.2 DevDependencies
- Vite (5.4.1) - Build tool
- React plugin para Vite
- TailwindCSS (4.1.13) con PostCSS
- ESLint + plugins
- Stylelint

## 3. PÁGINAS Y RUTAS (Role-based)

### 3.1 Públicas (Sin autenticación)
- `/auth` - Login
- `/register` - Registro (potencial)

### 3.2 Por Rol (Autenticadas)

**ADMINISTRADOR** (manage-everything):
- `/home` - Inicio
- `/users` - Gestión de usuarios
- `/admin/auditoria` - Auditoría
- + Acceso a trabajador_tienda

**GERENTE** (manage-staff):
- `/home` - Inicio
- `/gerente/dashboard` - Dashboard analytics
- + Acceso a trabajador_tienda

**TRABAJADOR_TIENDA** (staff-operations):
- `/trabajador/dashboard` - Dashboard
- `/trabajador/products` - Gestión de productos
- `/trabajador/materiales` - Gestión de materiales
- `/trabajador/operations` - Operaciones
- `/trabajador/clientes` - Gestión de clientes
- `/trabajador/proveedores` - Gestión de proveedores
- `/trabajador/papeles` - Gestión de papeles
- `/trabajador/correos` - Servicio de correos
- `/trabajador/encuestas` - Encuestas
- `/trabajador/encuestas/:id` - Detalle de encuesta

**CLIENTE** (customer):
- `/cliente/pedidos` - Mis pedidos
- `/cliente/profile` - Mi perfil

## 4. COMPONENTES CRÍTICOS (Por Tamaño de Archivo)

| Archivo | Líneas | Tipo | Complejidad |
|---|---|---|---|
| Papeles.jsx | 1482 | Página | ALTA - Tabla compleja |
| popUpDetalleCliente.jsx | 904 | Modal | ALTA - Detalles cliente |
| PopupViewProveedorDetails.jsx | 879 | Modal | ALTA - Detalles proveedor |
| Proveedores.jsx | 750 | Página | ALTA - CRUD completo |
| TrabajadorDashboard.jsx | 746 | Página | ALTA - Dashboard |
| CrearOperacionModal.jsx | 729 | Modal | ALTA - Operaciones |
| Materiales.jsx | 715 | Página | ALTA - CRUD |
| gerenteDashboard.jsx | 706 | Página | ALTA - Analytics |
| Encuesta.jsx | 694 | Página | ALTA - CRUD encuestas |
| PopupCreateProveedorConRepresentante.jsx | 645 | Modal | ALTA - Creación compleja |

**Análisis**: Los 10 archivos más grandes suman ~7,200 líneas (32% del total). Son principalmente páginas y modales de entrada de datos complejos.

## 5. HOOKS POR CATEGORÍA

### 5.1 Distribución de Hooks

**Materiales (10 hooks)**
- useGetMateriales, useCreateMaterial, useUpdateMaterial, useDeleteMaterial
- useMaterialRepresentante, useMaterialesConRepresentantes
- useGetMaterialById, useAlertasStock, useUpdateStock
- useMateriales

**Proveedores (10 hooks)**
- useGetProveedores, useCreateProveedor, useUpdateProveedor, useDeleteProveedor
- useProveedoresConRepresentantes, useRepresentantes
- useProveedoreSafe, useGetProveedorById
- useCreateProveedorConRepresentante, useAnalisisProveedor

**Productos (6 hooks)**
- useGetProductos, useCreateProducto, useUpdateProducto, useDeleteProducto
- useProductoDetails, useProductosEnOperacion

**Operaciones (8 hooks)**
- useGetOperaciones, useCreateOperacion, useUpdateOperacion, useDeleteOperacion
- useOperacionesPendientes, useOperacionesCompletadas
- useOperacionDetails, useOperacionesPorProducto

**Clientes (9 hooks)**
- useGetClientes, useCreateCliente, useUpdateCliente, useDeleteCliente
- useClienteDetails, useClientesActivos
- useClienteBloqueo, useClientePedidos
- useClienteDatos

**Papeles (5 hooks)**
- useGetPapeles, useCreatePapeles, useUpdatePapeles, useDeletePapeles
- usePapelesDetalle

**Dashboard (7 hooks)**
- useMetricasVentas, useMetricasProductos, useMetricasClientes
- useTendencias, useGraficoVentas, useGraficoProductos
- useDashboardData

**Auth (4 hooks)**
- useLogin, useLogout, useRegister, useAuthState

**Otros (14 hooks)**
- Usuarios, correos, encuestas, tabla, búsqueda, compartidos

### 5.2 Hook Genérico Compartido
- **useApi** - Hook genérico para todas las llamadas API (centralizado)

## 6. ARQUITECTURA DE SERVICIOS

### 6.1 Patrón de Diseño
- **Root Service**: axios configurado con interceptores
- **Servicios específicos**: Cada uno importa root.service.js
- **Patrón**: Servicio → API REST → Backend

### 6.2 Servicios por Dominio
- **auth.service.js** - login, register, logout
- **client.service.js** - CRUD de clientes
- **proveedor.service.js** - CRUD de proveedores
- **producto.service.js** - CRUD de productos
- **materiales.service.js** - CRUD de materiales
- **operacion.service.js** - CRUD de operaciones
- **papeles.service.js** - CRUD de papeles
- **correo.service.js** - Servicio de correos
- **encuesta.service.js** - CRUD de encuestas
- **dashboard.service.js** - Datos de dashboard
- **audit.service.js** - Logs de auditoría
- **user.service.js** - Gestión de usuarios
- **trabajadorTienda.service.js** - Funciones específicas
- **clienteData.service.js** - Datos de cliente
- **direccion.service.js** - Gestión de direcciones

## 7. CONTEXTOS Y ESTADO GLOBAL

**AuthContext.jsx** - Único contexto global
- Maneja autenticación
- Usuario actual
- Token JWT
- Métodos login/logout
- Estado de carga

## 8. ESTILOS

- **TailwindCSS 4.1.13** - Framework de utilidades CSS
- **PostCSS** - Procesamiento de CSS
- **main.css** - Estilos globales
- **Estilos específicos en carpetas**

## 9. CONFIGURACIÓN BUILD (Vite)

### 9.1 Rutas Configuradas
```javascript
Aliases:
- @components → src/components
- @hooks → src/hooks
- @context → src/context
- @pages → src/pages
- @services → src/services
- @styles → src/styles
- @assets → src/assets
- @helpers → src/helpers
- @validaciones → src/validaciones
```

### 9.2 Configuración Actual
- **Build tool**: Vite (usa Rollup internamente)
- **Sin configuración manual de chunks** actual
- **React plugin** para optimizaciones


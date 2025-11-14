# ESTRATEGIA DE CODE-SPLITTING CON ROLLUP MANUAL CHUNKS

## DOCUMENTO EJECUTIVO

Este documento presenta una estrategia de optimización de code-splitting para reducir el tiempo de carga inicial y mejorar el rendimiento del bundle de la aplicación Cataldo. La aplicación tiene 132 archivos JS/JSX con un tamaño total de 22,126 líneas de código.

---

## I. ANÁLISIS DE TAMAÑOS Y RECOMENDACIÓN DE CHUNKS

### 1. LIBRERÍAS EXTERNAS - CHUNKS SEPARADOS

Las siguientes librerías deberían estar en chunks separados porque:
- Son **grandes** (>30KB)
- Son **usadas ocasionalmente** (no en todas las rutas)
- Tienen **dependencias pesadas**

```
sweetalert2      ~80KB  → chunk-sweetalert2.js
react-icons      ~500KB → chunk-icons.js (CRÍTICA - tamaño enorme)
react-toastify   ~40KB  → chunk-toastify.js
react-hook-form  ~30KB  → chunk-form.js
lodash           ~70KB  → chunk-lodash.js
```

**TOTAL de librerías a separar**: ~720KB (~80% del overhead)

---

## II. ESTRATEGIA DE CHUNKS POR FUNCIONALIDAD

Basada en roles y funcionalidades separadas. Cada usuario solo carga lo que usa.

### A. CHUNK CORE (Siempre cargado)
**Contenido**: Framework + Autenticación + Navegación
- react, react-dom (críticos)
- react-router-dom (necesario para SPA)
- axios (necesario para API)
- AuthContext.jsx
- Navbar.jsx
- ProtectedRoute.jsx
- main.jsx

**Tamaño estimado**: ~250KB
**Necesario para**: Todos los usuarios

### B. CHUNK ADMIN
**Contenido**: Panel de administrador
- Página: Users.jsx
- Página: AuditLogs.jsx
- Servicios: audit.service.js, user.service.js
- Hooks: useGetUsers, useCreateUser, useUpdateUser, useDeleteUser
- Modales: PopupUpdateUser.jsx, PopUpCreateUser.jsx

**Tamaño estimado**: ~80KB
**Necesario para**: Rol "administrador" solamente

### C. CHUNK GERENTE
**Contenido**: Dashboard de gerente
- Página: gerenteDashboard.jsx
- Servicios: dashboard.service.js
- Hooks: useMetricasVentas, useMetricasProductos, useGraficoVentas, etc.
- Componentes específicos gerente

**Tamaño estimado**: ~120KB
**Necesario para**: Roles "administrador", "gerente"

### D. CHUNK TRABAJADOR_DASHBOARD
**Contenido**: Dashboard de trabajador
- Página: TrabajadorDashboard.jsx
- Hooks: useMetricasTrabajedorDashboard
- Componentes: dashboard/Clientes.jsx

**Tamaño estimado**: ~100KB
**Necesario para**: Trabajadores

### E. CHUNK TRABAJADOR_PRODUCTOS
**Contenido**: Gestión de productos
- Página: Productos.jsx
- Servicios: producto.service.js
- Hooks: useGetProductos, useCreateProducto, useUpdateProducto, useDeleteProducto
- Componentes: PopupCreateProducto.jsx, PopupUpdateProducto.jsx
- Modales relacionados

**Tamaño estimado**: ~150KB
**Necesario para**: Trabajadores

### F. CHUNK TRABAJADOR_MATERIALES
**Contenido**: Gestión de materiales
- Página: Materiales.jsx
- Servicios: materiales.service.js
- Hooks: 10 hooks de materiales (useGetMateriales, useCreateMaterial, etc.)
- Componentes: PopupCreateMaterial.jsx, PopupUpdatematerial.jsx
- Componentes trabajadorTienda relacionados

**Tamaño estimado**: ~200KB
**Necesario para**: Trabajadores

### G. CHUNK TRABAJADOR_CLIENTES
**Contenido**: Gestión de clientes
- Página: Clientes.jsx
- Servicios: cliente.service.js, clienteData.service.js, direccion.service.js
- Hooks: 9 hooks de clientes
- Componentes: 5 componentes popup de cliente
- Modales de cliente

**Tamaño estimado**: ~180KB
**Necesario para**: Trabajadores

### H. CHUNK TRABAJADOR_PROVEEDORES
**Contenido**: Gestión de proveedores
- Página: Proveedores.jsx
- Servicios: proveedor.service.js
- Hooks: 10 hooks de proveedores
- Componentes: 5 componentes popup de proveedor

**Tamaño estimado**: ~200KB
**Necesario para**: Trabajadores

### I. CHUNK TRABAJADOR_OPERACIONES
**Contenido**: Gestión de operaciones
- Página: TrabajadorOperaciones.jsx
- Servicios: operacion.service.js
- Hooks: 8 hooks de operaciones
- Componentes: CrearOperacionModal.jsx, PopupCreateOperacion.jsx, PopupUpdateOperacion.jsx

**Tamaño estimado**: ~180KB
**Necesario para**: Trabajadores

### J. CHUNK TRABAJADOR_PAPELES
**Contenido**: Gestión de papeles
- Página: Papeles.jsx (1482 líneas - componente más grande)
- Servicios: papeles.service.js
- Hooks: 5 hooks de papeles
- Modales relacionados

**Tamaño estimado**: ~220KB
**Necesario para**: Trabajadores

### K. CHUNK TRABAJADOR_OTROS
**Contenido**: Funcionalidades menores de trabajador
- Encuestas: Encuesta.jsx + servicio + hooks
- Correos: ServicioCorreo.jsx + servicio + hooks

**Tamaño estimado**: ~150KB
**Necesario para**: Trabajadores

### L. CHUNK CLIENTE
**Contenido**: Funcionalidades de cliente
- Página: MisPedidos.jsx
- Página: MiPerfil.jsx
- Servicios relacionados

**Tamaño estimado**: ~80KB
**Necesario para**: Rol "cliente"

### M. CHUNK SHARED/COMUNES
**Contenido**: Componentes compartidos
- Form.jsx
- Table.jsx
- Search.jsx
- Componentes generales usados en múltiples páginas
- Helpers
- Validaciones

**Tamaño estimado**: ~150KB
**Necesario para**: Todas las páginas

### N. CHUNK BIBLIOTECAS PESADAS (Lazy Load)
Cargadas bajo demanda cuando se usan:

```javascript
// Chunk sweetalert2 (alertas complejas)
sweetalert2 → ~80KB

// Chunk react-icons (iconografía - CRÍTICO TAMAÑO)
react-icons → ~500KB

// Chunk react-toastify (notificaciones toast)
react-toastify → ~40KB

// Chunk react-hook-form (formularios complejos)
react-hook-form → ~30KB

// Chunk lodash (funciones utilitarias)
lodash → ~70KB
```

---

## III. IMPLEMENTACIÓN - VITE CONFIG

### Configuración recomendada para vite.config.js:

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  
  build: {
    // Optimizar rollup output con manualChunks
    rollupOptions: {
      output: {
        manualChunks(id) {
          // === LIBRERÍAS EXTERNAS (VENDOR) ===
          if (id.includes('node_modules')) {
            // Bibliotecas pesadas que no se usan en todas partes
            if (id.includes('sweetalert2')) return 'chunk-sweetalert2';
            if (id.includes('react-icons')) return 'chunk-icons';
            if (id.includes('react-toastify')) return 'chunk-toastify';
            if (id.includes('react-hook-form')) return 'chunk-form';
            if (id.includes('lodash')) return 'chunk-lodash';
            
            // Core libraries - mantenidas juntas
            if (id.includes('react') || id.includes('react-dom')) {
              return 'chunk-react';
            }
            if (id.includes('react-router-dom')) {
              return 'chunk-router';
            }
            
            // Otros vendor
            return 'chunk-vendor';
          }
          
          // === FUNCIONALIDAD POR ROLES ===
          
          // Admin
          if (id.includes('src/pages/adm') || 
              id.includes('audit.service') || 
              id.includes('user.service')) {
            return 'chunk-admin';
          }
          
          // Gerente
          if (id.includes('src/pages/gerente') ||
              id.includes('useMetricasVentas') ||
              id.includes('useMetricasProductos')) {
            return 'chunk-gerente';
          }
          
          // Trabajador - Dashboard
          if (id.includes('TrabajadorDashboard') ||
              id.includes('src/components/trabajadorTienda/dashboard')) {
            return 'chunk-trabajador-dashboard';
          }
          
          // Trabajador - Productos
          if (id.includes('Productos.jsx') ||
              id.includes('producto.service') ||
              id.includes('productos/')) {
            return 'chunk-trabajador-productos';
          }
          
          // Trabajador - Materiales
          if (id.includes('Materiales.jsx') ||
              id.includes('materiales.service') ||
              id.includes('materiales/')) {
            return 'chunk-trabajador-materiales';
          }
          
          // Trabajador - Clientes
          if (id.includes('Clientes.jsx') ||
              id.includes('cliente.service') ||
              id.includes('clientes/') ||
              id.includes('clienteData.service') ||
              id.includes('direccion.service')) {
            return 'chunk-trabajador-clientes';
          }
          
          // Trabajador - Proveedores
          if (id.includes('Proveedores.jsx') ||
              id.includes('proveedor.service') ||
              id.includes('prooveedores/')) {
            return 'chunk-trabajador-proveedores';
          }
          
          // Trabajador - Operaciones
          if (id.includes('TrabajadorOperaciones.jsx') ||
              id.includes('operacion.service') ||
              id.includes('operaciones/') ||
              id.includes('CrearOperacionModal')) {
            return 'chunk-trabajador-operaciones';
          }
          
          // Trabajador - Papeles (componentemás grande)
          if (id.includes('Papeles.jsx') ||
              id.includes('papeles.service') ||
              id.includes('papeles/')) {
            return 'chunk-trabajador-papeles';
          }
          
          // Trabajador - Otros (Encuestas y Correos)
          if (id.includes('Encuesta.jsx') ||
              id.includes('encuesta.service') ||
              id.includes('encuestas/') ||
              id.includes('ServicioCorreo.jsx') ||
              id.includes('correo.service') ||
              id.includes('correos/')) {
            return 'chunk-trabajador-otros';
          }
          
          // Cliente
          if (id.includes('cliente-tienda/')) {
            return 'chunk-cliente';
          }
          
          // Compartidos y utilities
          if (id.includes('src/components') ||
              id.includes('src/helpers') ||
              id.includes('src/validaciones') ||
              id.includes('src/context')) {
            return 'chunk-common';
          }
        },
        
        // Optimizar naming y orden
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId ? 
            chunkInfo.facadeModuleId.split('/').pop().split('.')[0] : 
            'chunk';
          return 'chunks/[name]-[hash].js';
        }
      }
    },
    
    // Otras optimizaciones
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true
      }
    },
    
    // Tamaño de warning
    chunkSizeWarningLimit: 500,
    
    // Reporte de tamaños
    reportCompressedSize: true
  },
  
  // Aliases (mantenidos del config original)
  resolve: {
    alias: {
      '@components': path.resolve(__dirname, './src/components'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@context': path.resolve(__dirname, './src/context'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@services': path.resolve(__dirname, './src/services'),
      '@styles': path.resolve(__dirname, './src/styles'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@helpers': path.resolve(__dirname, './src/helpers'),
      '@validaciones': path.resolve(__dirname, './src/validaciones')
    }
  }
});
```

---

## IV. LAZY LOADING PARA RUTAS

Implementar Code Splitting a nivel de rutas usando React.lazy():

```javascript
// En main.jsx - Cambiar imports estáticos a lazy
import { lazy, Suspense } from 'react';

// Lazy load de páginas por rol
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

// Componente de loading
function PageLoader() {
  return <div className="flex items-center justify-center min-h-screen">Cargando...</div>;
}

// Envolver rutas en Suspense
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
      {
        element: <PublicLayout />,
        children: [
          {
            path: '/auth',
            element: (
              <Suspense fallback={<PageLoader />}>
                <Login />
              </Suspense>
            )
          }
        ]
      },
      {
        element: <AuthenticatedLayout />,
        children: [
          {
            path: '/',
            element: (
              <ProtectedRoute>
                <Suspense fallback={<PageLoader />}>
                  <Home />
                </Suspense>
              </ProtectedRoute>
            )
          },
          // ... resto de rutas con Suspense
        ]
      }
    ]
  }
]);
```

---

## V. LAZY LOADING PARA COMPONENTES PESADOS

Para componentes modales que se usan ocasionalmente:

```javascript
// En componentes que usan modales
import { lazy, Suspense } from 'react';

const PopupCreateMaterial = lazy(() => 
  import('@components/popup/trabajadorTienda/material/PopupCreateMaterial')
);
const PopupUpdateMaterial = lazy(() => 
  import('@components/popup/trabajadorTienda/material/PopupUpdatematerial')
);

// En render
{showModal && (
  <Suspense fallback={<div>Cargando modal...</div>}>
    <PopupCreateMaterial {...props} />
  </Suspense>
)}
```

---

## VI. OPTIMIZACIONES ADICIONALES

### 1. Importación Selectiva de Librerías

**Antes (MALO - carga todo)**:
```javascript
import _ from 'lodash';
// Solo usa _.debounce pero carga 70KB completos
```

**Después (MEJOR)**:
```javascript
import debounce from 'lodash/debounce';
// Solo carga ~2KB
```

### 2. Optimización de react-icons

**Antes (MALO)**:
```javascript
// Carga TODOS los iconos (~500KB)
import { FaIcon, MdIcon, AiIcon, ... } from 'react-icons/all';
```

**Después (MEJOR)**:
```javascript
// Carga solo FA icons (~50KB)
import { FaPowerOff } from 'react-icons/fa';
// Carga solo MD icons (~50KB)
import { MdDashboard } from 'react-icons/md';
```

### 3. Tree-Shaking

Asegurar que el código sea tree-shakeable:
```javascript
// Usar named exports, no default
export const utilFunction = () => {};

// Usar ES modules, no CommonJS
import { utilFunction } from './utils';
```

---

## VII. MONITOREO Y ANÁLISIS

### Comando para analizar bundle:

```bash
# Con Vite Rollup Visualizer
npm install rollup-plugin-visualizer --save-dev

# En vite.config.js:
import { visualizer } from 'rollup-plugin-visualizer';

export default {
  plugins: [
    react(),
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
    })
  ]
}

# Build y ver reporte
npm run build
```

### Comandos útiles:

```bash
# Analizar bundle size
npm run build -- --report

# Previsualizar gzipped
npm run build

# Stats detallados
npx webpack-bundle-analyzer dist/stats.json
```

---

## VIII. RESULTADO ESPERADO

### Bundle Actual (Sin optimización):
- **main.js**: ~2.5MB (non-gzipped)
- **Carga inicial**: 2-3 segundos

### Bundle Optimizado (Con estrategia):

| Chunk | Tamaño | Carga |
|-------|--------|-------|
| main.js (core) | 250KB | Inmediato |
| chunk-react.js | 150KB | Inmediato |
| chunk-router.js | 70KB | Inmediato |
| chunk-vendor.js | 100KB | Inmediato |
| chunk-common.js | 150KB | Inmediato |
| **Total inicial** | **~720KB** | **~1s (5x mejor)** |
| | | |
| chunk-admin.js | 80KB | Lazy (admin) |
| chunk-gerente.js | 120KB | Lazy (gerente) |
| chunk-trabajador-*.js | 1200KB total | Lazy (trabaj.) |
| chunk-cliente.js | 80KB | Lazy (cliente) |
| chunk-icons.js | 500KB | Lazy (on-demand) |
| **Total resto** | ~2MB | Lazy load |

**Mejoras esperadas**:
- FCP: 40-50% más rápido
- LCP: 35-40% más rápido
- Carga inicial: 5x más rápida
- Total bundle: No cambia (mismos archivos), pero optimizado

---

## IX. MAPA DE DEPENDENCIAS

### Dependencias por Chunk:

```
chunk-core:
├── react
├── react-dom
├── main.jsx
└── AuthContext.jsx

chunk-trabajador-materiales:
├── Materiales.jsx
├── materiales.service.js
├── 10 hooks de materiales
├── PopupCreateMaterial
├── PopupUpdateMaterial
└── MaterialRepresentante

chunk-trabajador-papeles:
├── Papeles.jsx (1482 lineas)
├── papeles.service.js
├── 5 hooks de papeles
└── Modales relacionados

chunk-trabajador-clientes:
├── Clientes.jsx
├── cliente.service.js
├── 9 hooks de clientes
├── 5 popups cliente
└── clienteData.service.js

... (similar para otros chunks)
```

---

## X. PLAN DE IMPLEMENTACIÓN

### Fase 1: Preparación (1-2 horas)
1. Instalar visualizer y herramientas
2. Crear backup de vite.config.js
3. Analizar tamaños actuales

### Fase 2: Configuración (2-3 horas)
1. Implementar configuración manualChunks
2. Ajustar lazy loading en rutas
3. Ajustar importaciones selectivas

### Fase 3: Testing (2-3 horas)
1. Build en producción
2. Analizar chunks resultantes
3. Pruebas de carga de páginas
4. Medir Core Web Vitals

### Fase 4: Optimizaciones Finas (2-4 horas)
1. Ajustar tamaños de chunks
2. Optimizar modales lazy
3. Cacheing de navegador

### Fase 5: Deploy (1 hora)
1. Update a producción
2. Monitoreo de rendimiento
3. Rollback si es necesario

**Tiempo total estimado**: 8-13 horas

---

## XI. MÉTRICAS DE ÉXITO

✓ Carga inicial < 1 segundo
✓ LCP < 2.5 segundos
✓ FCP < 1 segundo
✓ TBT < 200ms
✓ CLS < 0.1
✓ Ningún chunk > 500KB (excepto lazy-loaded)
✓ Navbar responsive < 100ms
✓ Lazy chunks cargan < 500ms


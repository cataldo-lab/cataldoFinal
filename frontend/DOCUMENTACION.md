# Documentación del Frontend - Cataldo Furniture

Esta carpeta contiene documentación completa sobre la estructura, arquitectura y guías del proyecto frontend.

## Documentos Disponibles

### 1. RESUMEN.md
**Resumen ejecutivo del proyecto**
- Información general del proyecto
- Tecnologías utilizadas
- Estructura general
- Cantidad de archivos por tipo
- Modelo de datos
- Roles de usuario y permisos
- Características principales
- Áreas observadas y recomendaciones

**Cuándo usar:** Cuando necesitas una visión general rápida del proyecto

### 2. ESTRUCTURA.md
**Estructura detallada de carpetas y archivos**
- Directorios principales y configuración
- Descripción completa de cada carpeta en /src
- Lista detallada de todos los componentes (30+)
- Lista de todas las páginas (19)
- Lista de todos los hooks (60+)
- Lista de todos los servicios API (16)
- Helpers, validaciones y estilos
- Configuración de Vite
- Scripts disponibles

**Cuándo usar:** Cuando necesitas encontrar un archivo específico o entender la organización completa

### 3. ARQUITECTURA.md
**Diagramas y patrones de arquitectura**
- Diagrama de flujo de la aplicación
- Flujo de autenticación
- Flujo de datos
- Jerarquía de carpetas visual
- Componentes principales y dependencias
- Mapeo de servicios API
- Organización de hooks por funcionalidad

**Cuándo usar:** Cuando necesitas entender cómo interactúan los componentes y servicios

### 4. REFERENCIA.md
**Guía rápida de referencia**
- Tablas con directorios clave
- Comandos importantes
- Rutas principales por rol
- Servicios API y funciones
- Componentes reutilizables
- Tecnologías y versiones
- Patrones y convenciones
- Estructura típica de hooks y servicios
- Aliases de importación
- Tips y atajos útiles

**Cuándo usar:** Cuando necesitas consultar algo rápidamente

## Estructura del Proyecto

```
frontend/
├── src/
│   ├── components/           (30+ componentes reutilizables)
│   ├── pages/                (19 páginas principales)
│   ├── hooks/                (60+ custom hooks)
│   ├── services/             (16 servicios API)
│   ├── context/              (AuthContext para autenticación)
│   ├── helpers/              (Funciones auxiliares)
│   ├── validaciones/         (Reglas de validación)
│   ├── styles/               (CSS con Tailwind)
│   ├── assets/               (Recursos)
│   └── main.jsx              (Punto de entrada)
├── public/                   (Recursos estáticos)
├── package.json              (Dependencias)
├── vite.config.js            (Configuración Vite)
├── tailwind.config.js        (Tailwind CSS)
├── eslint.config.js          (ESLint)
└── DOCUMENTACION.md          (Este archivo)
```

## Tecnologías Principales

- **React 18.3.1** - Framework UI
- **Vite 5.4.1** - Bundler
- **React Router DOM 6.26.1** - Enrutamiento
- **Tailwind CSS 4.1.13** - Styling
- **React Hook Form 7.66.0** - Formularios
- **Axios 1.7.5** - Cliente HTTP
- **React Tabulator** - Tablas interactivas

## Roles de Usuario

1. **Administrador** - Acceso completo, gestión de usuarios
2. **Gerente** - Gestión operativa, dashboards
3. **Trabajador Tienda** - Operaciones de tienda
4. **Cliente** - Acceso a tienda online

## Scripts Principales

```bash
npm run dev          # Desarrollo (localhost:5173)
npm run build        # Build producción
npm run lint         # ESLint
npm run lint:css     # Stylelint
```

## Cómo Empezar

1. Lee **RESUMEN.md** para entender qué es el proyecto
2. Consulta **ESTRUCTURA.md** cuando necesites ubicar un archivo
3. Usa **ARQUITECTURA.md** para entender cómo interactúan los componentes
4. Referencia **REFERENCIA.md** para comandos, rutas y patrones

## Puntos Clave de Arquitectura

- **MVC Pattern**: Views (pages) → Controllers (hooks) → Models (services)
- **State Management**: AuthContext global + hooks locales
- **Protección de Rutas**: ProtectedRoute con validación de rol
- **Code Splitting**: Lazy loading automático
- **API Layer**: Servicios centralizados con Axios

## Áreas Observadas

1. Dashboard de gerente duplicado (consolidar)
2. Hooks similares para mismos datos (revisar)
3. Validaciones en múltiples ubicaciones (centralizar)

## Próximos Pasos Recomendados

- Consolidar componentes duplicados
- Agregar tests (Jest + React Testing Library)
- Considerar state management centralizado (Redux/Zustand)
- Mejorar documentación de componentes

## Contacto y Cambios

Esta documentación fue generada el 2025-11-13 basada en el análisis del código.
Se recomienda actualizar estos documentos cuando haya cambios significativos en la estructura.

---

**Nota**: Para consultas rápidas, usa REFERENCIA.md. Para análisis profundos, usa ARQUITECTURA.md.

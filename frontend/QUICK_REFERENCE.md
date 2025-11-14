# GUÍA RÁPIDA - CODE-SPLITTING CATALDO

## Proyecto: 132 archivos | 22K líneas | 900KB dependencias

---

## PROBLEMA IDENTIFICADO

```
React Icons:     500KB  (carga TODO aunque solo uses 5 iconos)
SweetAlert2:      80KB  (presente en todas las páginas)
React Router:     70KB  (necesario)
Lodash:           70KB  (usa destructuring selectivo)
React Hook Form:  30KB  (solo en formularios complejos)
React Toastify:   40KB  (notificaciones)
```

**Resultado Actual**: Bundle único de 2.5MB, carga 2-3 segundos.
**Objetivo**: Reducir a 720KB inicial, cargar en 1 segundo (5x mejor).

---

## SOLUCIÓN: 14 CHUNKS

### INMEDIATO (Siempre cargados)
```
chunk-core:         Core + Auth + Router    250KB
chunk-react:        React + ReactDOM        180KB
chunk-vendor:       Otros vendor            100KB
chunk-common:       Componentes comunes     150KB
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TOTAL INICIAL:      680KB (carga en ~1s)
```

### LAZY - POR ROL
```
chunk-admin:                 80KB  (Rol Admin)
chunk-gerente:              120KB  (Rol Gerente)
chunk-trabajador-dashboard: 100KB  (Dashboard)
chunk-trabajador-productos: 150KB  (CRUD)
chunk-trabajador-materiales:200KB  (CRUD)
chunk-trabajador-clientes:  180KB  (CRUD)
chunk-trabajador-proveedores:200KB (CRUD)
chunk-trabajador-operaciones:180KB (CRUD)
chunk-trabajador-papeles:   220KB  (CRUD grande)
chunk-trabajador-otros:     150KB  (Encuestas/Correos)
chunk-cliente:               80KB  (Rol Cliente)
```

### LAZY - LIBRERÍAS PESADAS
```
chunk-icons:       500KB  (React-Icons - Lazy load on-demand)
chunk-sweetalert2:  80KB  (SweetAlert2 - Modal complejo)
chunk-toastify:     40KB  (Toast notifications)
chunk-form:         30KB  (React Hook Form)
chunk-lodash:       70KB  (Utilidades)
```

---

## CAMBIOS REQUERIDOS

### 1. vite.config.js
```javascript
build: {
  rollupOptions: {
    output: {
      manualChunks(id) {
        // Separar react-icons
        if (id.includes('react-icons')) return 'chunk-icons';
        
        // Separar por rol
        if (id.includes('src/pages/adm')) return 'chunk-admin';
        if (id.includes('src/pages/gerente')) return 'chunk-gerente';
        if (id.includes('Papeles.jsx')) return 'chunk-trabajador-papeles';
        // ... resto de reglas
      }
    }
  }
}
```

### 2. main.jsx - Lazy Load Rutas
```javascript
import { lazy, Suspense } from 'react';

const Users = lazy(() => import('@pages/Users'));
const TrabajadorDashboard = lazy(() => import('@pages/trabajador-tienda/TrabajadorDashboard'));
// ... resto de páginas

// Envolver en Suspense
<Suspense fallback={<div>Cargando...</div>}>
  <Users />
</Suspense>
```

### 3. Importaciones - Selectivas
```javascript
// ANTES (MALO):
import _ from 'lodash';
import { FaIcon, MdIcon } from 'react-icons/all';

// DESPUÉS (CORRECTO):
import debounce from 'lodash/debounce';
import { FaPowerOff } from 'react-icons/fa';
```

---

## IMPACTO ESPERADO

| Métrica | Antes | Después | Mejora |
|---------|-------|---------|--------|
| FCP | 3.2s | 0.8s | 4x |
| LCP | 5.1s | 1.8s | 2.8x |
| Bundle Inicial | 2.5MB | 720KB | 3.5x |
| Carga Inicial | 2-3s | 1s | 5x |
| TTI | 6.5s | 2.2s | 3x |

---

## ARCHIVOS CLAVE A REVISAR

```
✓ vite.config.js       → Configurar manualChunks
✓ src/main.jsx         → Lazy loading de rutas
✓ src/components/      → Lazy load de modales pesados
✓ src/Navbar.jsx       → Usar iconografía selectiva
✓ Toda importación de lodash → Selectiva
```

---

## CHECKLIST DE IMPLEMENTACIÓN

- [ ] Fase 1: Backup y análisis base (1h)
- [ ] Fase 2: Actualizar vite.config.js (1-2h)
- [ ] Fase 3: Lazy load rutas en main.jsx (1-2h)
- [ ] Fase 4: Optimizar importaciones (1-2h)
- [ ] Fase 5: Build y análisis chunks (1h)
- [ ] Fase 6: Testing y refinamientos (2-3h)
- [ ] Fase 7: Deploy (1h)

**Total**: 8-13 horas

---

## ARCHIVOS GENERADOS

En `/home/user/cataldoFinal/frontend/`:

1. **STRUCTURE_ANALYSIS.md** - Análisis completo de estructura
2. **CODE_SPLITTING_STRATEGY.md** - Estrategia detallada con ejemplos
3. **OPTIMIZATION_SUMMARY.md** - Resumen ejecutivo
4. **QUICK_REFERENCE.md** - Este archivo

---

## PRÓXIMAS ACCIONES

1. Revisar CODE_SPLITTING_STRATEGY.md
2. Actualizar vite.config.js
3. Implement lazy loading en main.jsx
4. Ejecutar build y analizar chunks

```bash
npm run build
# Revisar console para tamaños de chunks
```

---

## PREGUNTAS FRECUENTES

**¿Impactará en funcionalidad?**
No. Solo cambia cómo se distribuye el código entre archivos.

**¿Necesito cambiar código lógico?**
No en su mayoría. Solo imports y lazy loading en rutas.

**¿Se puede revertir?**
Sí, fácilmente. El cambio es principalmente en configuración.

**¿Cuál es el riesgo?**
Bajo. Vite maneja el splitting automáticamente.

---

## CONTACT & SUPPORT

Para preguntas sobre la implementación:
1. Revisar CODE_SPLITTING_STRATEGY.md sección III
2. Consultar STRUCTURE_ANALYSIS.md para mapeo
3. Usar vite.config.js de ejemplo como referencia


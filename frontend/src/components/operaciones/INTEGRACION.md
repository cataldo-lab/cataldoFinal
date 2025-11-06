# Integración del Modal de Creación de Operaciones

## Archivos Creados

1. **Hook**: `/hooks/papeles/useCrearOperacion.js`
   - Maneja la lógica de creación de operaciones
   - Estados: loading, error, success, operacionCreada

2. **Componente**: `/components/operaciones/CrearOperacionModal.jsx`
   - Modal completo para crear operaciones con productos
   - Interfaz intuitiva con validaciones

## Cómo Integrar en Papeles.jsx

### Paso 1: Importar el componente y hook

```jsx
import CrearOperacionModal from '@components/operaciones/CrearOperacionModal';
import { useState } from 'react';
```

### Paso 2: Agregar estado para el modal

```jsx
const Papeles = () => {
    // Estados existentes...

    // Nuevo estado para el modal
    const [showCrearModal, setShowCrearModal] = useState(false);

    // ... resto del código
};
```

### Paso 3: Agregar botón para abrir el modal

```jsx
{/* En el header o donde prefieras */}
<button
    onClick={() => setShowCrearModal(true)}
    className="px-4 py-2 bg-stone-600 text-white rounded-lg hover:bg-stone-700 transition-colors flex items-center gap-2"
>
    <FaPlus />
    Nueva Operación
</button>
```

### Paso 4: Incluir el modal en el render

```jsx
return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100 py-8 px-4">
        {/* Contenido existente */}

        {/* Modal de Crear Operación */}
        <CrearOperacionModal
            isOpen={showCrearModal}
            onClose={() => setShowCrearModal(false)}
            onSuccess={(nuevaOperacion) => {
                // Actualizar lista de clientes
                fetchClientes();
                setShowCrearModal(false);
                // Opcional: mostrar notificación de éxito
                alert(`Operación #${nuevaOperacion.id_operacion} creada exitosamente`);
            }}
            clientes={clientes}
            productos={productos} // Necesitas obtener lista de productos
        />
    </div>
);
```

### Paso 5: Obtener lista de productos

Necesitas agregar un hook o servicio para obtener productos activos:

```jsx
// En el componente Papeles.jsx
const [productos, setProductos] = useState([]);

useEffect(() => {
    const fetchProductos = async () => {
        try {
            const response = await getProductos(); // Desde tu servicio de productos
            setProductos(response.data || []);
        } catch (error) {
            console.error('Error al cargar productos:', error);
        }
    };

    fetchProductos();
}, []);
```

## Ejemplo Completo de Integración

```jsx
// frontend/src/pages/trabajador-tienda/Papeles.jsx
import { useState, useEffect } from 'react';
import { useGetClientesConCompras } from '@hooks/papeles/useGetClientesConCompras';
import { getProductos } from '@services/producto.service'; // Asume que existe
import CrearOperacionModal from '@components/operaciones/CrearOperacionModal';
import { FaPlus } from 'react-icons/fa';

const Papeles = () => {
    const { clientes, fetchClientes } = useGetClientesConCompras(true);
    const [showCrearModal, setShowCrearModal] = useState(false);
    const [productos, setProductos] = useState([]);

    // Cargar productos
    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const response = await getProductos();
                setProductos(response.data || []);
            } catch (error) {
                console.error('Error al cargar productos:', error);
            }
        };
        fetchProductos();
    }, []);

    const handleOperacionCreada = (nuevaOperacion) => {
        fetchClientes(); // Refrescar lista
        setShowCrearModal(false);
        alert(`✅ Operación #${nuevaOperacion.id_operacion} creada con éxito`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100 py-8 px-4">
            <div className="max-w-7xl mx-auto pt-20">
                {/* Header con botón de nueva operación */}
                <div className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-bold text-stone-800">
                            Papeles - Clientes con Compras
                        </h1>
                        <p className="text-stone-600">Gestión de clientes y operaciones</p>
                    </div>
                    <button
                        onClick={() => setShowCrearModal(true)}
                        className="px-6 py-3 bg-stone-600 text-white rounded-lg hover:bg-stone-700 transition-colors flex items-center gap-2 shadow-lg hover:shadow-xl"
                    >
                        <FaPlus />
                        Nueva Operación
                    </button>
                </div>

                {/* Contenido existente... */}

                {/* Modal */}
                <CrearOperacionModal
                    isOpen={showCrearModal}
                    onClose={() => setShowCrearModal(false)}
                    onSuccess={handleOperacionCreada}
                    clientes={clientes}
                    productos={productos}
                />
            </div>
        </div>
    );
};

export default Papeles;
```

## Características del Modal

### ✅ Validaciones
- Cliente requerido
- Al menos 1 producto
- Cantidades > 0
- Precios válidos

### ✅ Funcionalidades
- Selección de cliente
- Estados de operación (cotización, orden de trabajo, pendiente, en proceso)
- Agregar múltiples productos
- Especificaciones personalizadas por producto
- Precios se cargan automáticamente del producto
- Precios pueden ser editados manualmente
- Abono inicial opcional
- Fecha de entrega estimada
- Cálculo automático de totales
- Cálculo de saldo pendiente

### ✅ UX
- Interfaz intuitiva
- Feedback visual de errores
- Mensaje de éxito
- Loading states
- Responsive design
- Confirmación antes de cerrar

## Flujo de Usuario

1. Usuario hace clic en "Nueva Operación"
2. Se abre el modal
3. Selecciona cliente
4. Selecciona estado (cotizacion, orden_trabajo, etc.)
5. Agrega productos uno por uno:
   - Selecciona producto del dropdown
   - Especifica cantidad
   - Precio se carga automáticamente (puede editarse)
   - Agrega especificaciones opcionales
   - Hace clic en "Agregar"
6. Ve la lista de productos agregados con totales
7. Opcionalmente ingresa abono inicial y fecha de entrega
8. Hace clic en "Crear Operación"
9. Sistema valida y crea la operación
10. Muestra mensaje de éxito
11. Cierra el modal
12. Refresca la lista de clientes con la nueva operación

## Validaciones del Backend

El modal se integra perfectamente con las validaciones del backend:
- ✅ User existe y tiene rol cliente
- ✅ User tiene perfil de cliente completo
- ✅ Productos existen y están activos
- ✅ Cantidades válidas
- ✅ Historial se crea según estado

## Notas

- El componente es completamente autónomo
- No modifica el componente Papeles.jsx existente
- Fácil de integrar en cualquier página
- Puede reusarse en otras partes de la aplicación
- Estilos consistentes con el diseño existente

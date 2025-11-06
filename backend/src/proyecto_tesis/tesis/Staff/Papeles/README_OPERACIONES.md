# Creación de Operaciones con Productos

## Flujo de Enlace de Entidades

Cuando se crea una operación, se enlazan las siguientes entidades en orden:

```
1. User (rol: "cliente")
   ↓ (relación 1:1)
2. Cliente (tabla clientes)
   ↓ (User tiene operaciones)
3. Operacion (tabla operacion)
   ↓ (tabla intermedia N:N)
4. ProductoOperacion (tabla producto_operacion)
   ↓ (relación N:1)
5. Producto (tabla producto)

Y además:
3. Operacion
   ↓ (relación 1:N)
6. Historial (tabla historial)
```

## Validaciones en Orden

### 1. Validación de User y Cliente
- ✅ **User existe**
- ✅ **User tiene rol "cliente"**
- ✅ **User tiene registro en tabla Cliente** (NEW)
- ❌ Si falta alguno → Error 400

### 2. Validación de Productos
- ✅ Al menos 1 producto
- ✅ Cada producto existe
- ✅ Cada producto está activo
- ✅ Cada cantidad > 0

### 3. Creación en Transacción
1. Crear **Operacion** enlazada a User
2. Crear registros en **ProductoOperacion** (tabla intermedia)
3. Crear **Historial** inicial según estado

## Historial según Estado

El historial se inicializa con el campo correspondiente en `true`:

| estado_operacion | Campo en Historial |
|-----------------|-------------------|
| cotizacion | `cotizacion = true` |
| orden_trabajo | `orden_trabajo = true` |
| pendiente | `pendiente = true` |
| en_proceso | `en_proceso = true` |
| terminada | `terminada = true` |
| completada | `completada = true` |
| pagada | `pagada = true` |
| entregada | `entregada = true` |
| anulada | `anulada = true` |

**Todos los demás campos quedan en `false`**.

## Ejemplos de Uso

### Ejemplo 1: Cotización
```json
POST /api/papeles/operacion
{
  "operacion": {
    "id_cliente": 1,
    "estado_operacion": "cotizacion",
    "descripcion_operacion": "Cotización juego de sala"
  },
  "productos": [
    { "id_producto": 1, "cantidad": 1 }
  ]
}
```

**Resultado**:
- Historial: `cotizacion = true`, resto `false`

### Ejemplo 2: Orden de Trabajo
```json
POST /api/papeles/operacion
{
  "operacion": {
    "id_cliente": 1,
    "estado_operacion": "orden_trabajo",
    "descripcion_operacion": "Muebles de cocina",
    "cantidad_abono": 200000,
    "fecha_entrega_estimada": "2025-02-28"
  },
  "productos": [
    {
      "id_producto": 3,
      "cantidad": 1,
      "precio_unitario": 500000,
      "especificaciones": "Mueble bajo mesón 3m"
    }
  ]
}
```

**Resultado**:
- Historial: `orden_trabajo = true`, resto `false`
- Costo total: $500,000
- Saldo pendiente: $300,000

## Casos de Error

### Error 1: Usuario sin rol cliente
```json
{
  "operacion": { "id_cliente": 5 },  // Usuario es "gerente"
  "productos": [...]
}
```
**Respuesta**: 400 - "Usuario no tiene rol de cliente"

### Error 2: Usuario sin perfil de cliente
```json
{
  "operacion": { "id_cliente": 10 },  // User sin registro en tabla Cliente
  "productos": [...]
}
```
**Respuesta**: 400 - "No tiene perfil de cliente completo"

### Error 3: Sin productos
```json
{
  "operacion": { "id_cliente": 1 },
  "productos": []
}
```
**Respuesta**: 400 - "Debe incluir al menos un producto"

## Pruebas Bruno Disponibles

1. ✅ `createOperacionConProductos.bru` - Caso exitoso básico
2. ✅ `createOperacionUnProducto.bru` - Un solo producto
3. ✅ `createOperacionMultiplesProductos.bru` - Múltiples productos
4. ✅ `createOperacionCotizacion.bru` - Estado: cotizacion
5. ✅ `createOperacionOrdenTrabajo.bru` - Estado: orden_trabajo
6. ✅ `createOperacionErrorClienteInvalido.bru` - Error: cliente no existe
7. ✅ `createOperacionErrorSinProductos.bru` - Error: array vacío
8. ✅ `createOperacionErrorSinPerfilCliente.bru` - Error: user sin cliente

## Transacciones

Todas las operaciones usan **transacciones** para garantizar:
- ✅ Atomicidad (todo o nada)
- ✅ Rollback automático en caso de error
- ✅ Integridad referencial
- ✅ Consistencia de datos

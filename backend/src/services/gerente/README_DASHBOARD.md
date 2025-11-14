# 📊 Dashboard de Gerente - Documentación

Sistema completo de métricas y análisis para la gestión de la mueblería.

## 🎯 Endpoints Disponibles

Todos los endpoints requieren autenticación (JWT token) y rol de **gerente** o **administrador**.

Base URL: `http://localhost:3000/api/dashboard`

---

### 1. **Resumen General**

```
GET /api/dashboard/resumen
```

**Descripción:** Vista rápida del estado del negocio (mes actual).

**Respuesta:**
```json
{
  "success": true,
  "message": "Resumen general obtenido exitosamente",
  "data": {
    "periodo": {
      "mes": 12,
      "año": 2024,
      "desde": "2024-12-01T00:00:00.000Z",
      "hasta": "2024-12-31T23:59:59.000Z"
    },
    "operaciones": {
      "total_mes": 25,
      "por_estado": {
        "pendiente": { "cantidad": 5, "monto_total": 1500000 },
        "en_proceso": { "cantidad": 8, "monto_total": 3200000 },
        "completada": { "cantidad": 12, "monto_total": 4800000 }
      }
    },
    "ingresos": {
      "total_operaciones": 9500000,
      "total_abonado": 7200000,
      "pendiente_cobro": 2300000,
      "porcentaje_abonado": "75.79"
    },
    "clientes": {
      "activos_mes": 18,
      "total_registrados": 150
    }
  }
}
```

---

### 2. **Métricas de Ventas**

```
GET /api/dashboard/ventas?desde=2024-01-01&hasta=2024-12-31
```

**Parámetros de Query:**
- `desde` (opcional): Fecha de inicio (YYYY-MM-DD). Default: inicio del mes actual
- `hasta` (opcional): Fecha de fin (YYYY-MM-DD). Default: fin del mes actual

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "periodo": {
      "desde": "2024-01-01T00:00:00.000Z",
      "hasta": "2024-12-31T23:59:59.000Z"
    },
    "top_productos": [
      {
        "nombre": "Mesa de Comedor 6 personas",
        "categoria": "Mesas",
        "total_vendido": 15,
        "ingresos_generados": 2700000
      }
    ],
    "por_categoria": [
      {
        "categoria": "Mesas",
        "num_operaciones": 20,
        "unidades_vendidas": 25,
        "ingresos": 4500000
      }
    ],
    "productos_vs_servicios": {
      "productos": {
        "cantidad": 45,
        "ingresos": 8100000
      },
      "servicios": {
        "cantidad": 10,
        "ingresos": 1200000
      }
    },
    "totales": {
      "ventas_totales": 9300000,
      "num_operaciones": 55
    }
  }
}
```

---

### 3. **Estado de Inventario**

```
GET /api/dashboard/inventario
```

**Descripción:** Alertas de materiales con stock crítico o bajo.

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "alertas": {
      "criticos": {
        "cantidad": 3,
        "materiales": [
          {
            "id": 5,
            "nombre": "Tablero MDF 18mm",
            "existencia": 2,
            "stock_minimo": 10,
            "porcentaje_stock": "20.0",
            "proveedor": "Materiales de Construcción",
            "unidad_medida": "unidad"
          }
        ]
      },
      "bajo_stock": {
        "cantidad": 5,
        "materiales": [...]
      }
    },
    "inventario_total": {
      "valor_total": 15500000,
      "total_materiales": 45,
      "total_unidades": 1250
    },
    "por_categoria": [
      {
        "categoria": "longitud",
        "cantidad_materiales": 15,
        "total_existencia": 500
      }
    ]
  }
}
```

---

### 4. **Estadísticas de Clientes**

```
GET /api/dashboard/clientes
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "por_categoria": [
      {
        "categoria": "premium",
        "cantidad": 25,
        "descuento_promedio": "15.50"
      },
      {
        "categoria": "vip",
        "cantidad": 40,
        "descuento_promedio": "20.00"
      },
      {
        "categoria": "regular",
        "cantidad": 85,
        "descuento_promedio": "5.00"
      }
    ],
    "nuevos_mes": 12,
    "con_operaciones_activas": 28,
    "top_clientes": [
      {
        "id": 45,
        "nombre": "María Elena González Pérez",
        "categoria": "vip",
        "total_operaciones": 18,
        "total_gastado": 5400000
      }
    ]
  }
}
```

---

### 5. **Satisfacción de Clientes**

```
GET /api/dashboard/satisfaccion?desde=2024-01-01&hasta=2024-12-31
```

**Parámetros de Query:**
- `desde` (opcional): Fecha de inicio
- `hasta` (opcional): Fecha de fin

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "periodo": {
      "desde": "2024-01-01T00:00:00.000Z",
      "hasta": "2024-12-31T23:59:59.000Z"
    },
    "promedios": {
      "nota_pedido": "6.25",
      "nota_repartidor": "6.50",
      "total_encuestas": 48
    },
    "distribucion": {
      "pedido": [
        { "nota": 7, "cantidad": 25 },
        { "nota": 6, "cantidad": 15 },
        { "nota": 5, "cantidad": 5 },
        { "nota": 4, "cantidad": 2 },
        { "nota": 3, "cantidad": 1 }
      ],
      "repartidor": [...]
    },
    "alertas_bajas": [
      {
        "id_encuesta": 123,
        "nota_pedido": 3,
        "nota_repartidor": 4,
        "comentario": "El producto llegó con un pequeño rayón...",
        "fecha": "2024-11-15T10:30:00.000Z",
        "cliente": "Jorge Luis Fernández Torres",
        "id_operacion": 456
      }
    ]
  }
}
```

---

### 6. **Indicadores Operacionales**

```
GET /api/dashboard/operaciones?desde=2024-01-01&hasta=2024-12-31
```

**Parámetros de Query:**
- `desde` (opcional): Fecha de inicio
- `hasta` (opcional): Fecha de fin

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "periodo": {
      "desde": "2024-01-01T00:00:00.000Z",
      "hasta": "2024-12-31T23:59:59.000Z"
    },
    "conversion": {
      "cotizaciones": 35,
      "ventas": 65,
      "porcentaje_conversion": "65.00"
    },
    "abonos": {
      "total_costo": 9500000,
      "total_abonado": 7800000,
      "porcentaje_abonado": "82.11"
    },
    "operaciones_completadas": 52,
    "proyeccion_ingresos": {
      "total_proyectado": 4500000,
      "ya_abonado": 2200000,
      "por_cobrar": 2300000,
      "num_operaciones_pendientes": 15
    }
  }
}
```

---

## 🔐 Autenticación

Todos los endpoints requieren un token JWT en el header:

```bash
Authorization: Bearer <tu_token_jwt>
```

**Roles permitidos:**
- `gerente`
- `administrador`

---

## 📝 Ejemplos de Uso

### Con cURL:

```bash
# 1. Login
curl -X POST http://localhost:3000/api/session/verify \
  -H "Content-Type: application/json" \
  -d '{"email":"gerente@example.com","password":"password123"}'

# Guardar el token de la respuesta

# 2. Obtener resumen general
curl -X GET http://localhost:3000/api/dashboard/resumen \
  -H "Authorization: Bearer <tu_token>"

# 3. Obtener ventas del último trimestre
curl -X GET "http://localhost:3000/api/dashboard/ventas?desde=2024-10-01&hasta=2024-12-31" \
  -H "Authorization: Bearer <tu_token>"

# 4. Obtener estado de inventario
curl -X GET http://localhost:3000/api/dashboard/inventario \
  -H "Authorization: Bearer <tu_token>"
```

### Con JavaScript (Axios):

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});

// Obtener resumen
const resumen = await api.get('/dashboard/resumen');
console.log(resumen.data);

// Obtener ventas con fechas
const ventas = await api.get('/dashboard/ventas', {
  params: {
    desde: '2024-01-01',
    hasta: '2024-12-31'
  }
});
console.log(ventas.data);
```

---

## 🎨 Casos de Uso Frontend

### 1. **Vista Principal del Dashboard**
```javascript
// Cargar todos los datos principales al montar el componente
useEffect(() => {
  const cargarDashboard = async () => {
    const [resumen, inventario, clientes] = await Promise.all([
      api.get('/dashboard/resumen'),
      api.get('/dashboard/inventario'),
      api.get('/dashboard/clientes')
    ]);

    setDatos({ resumen, inventario, clientes });
  };

  cargarDashboard();
}, []);
```

### 2. **Filtrar Ventas por Período**
```javascript
const filtrarVentas = async (fechaInicio, fechaFin) => {
  const response = await api.get('/dashboard/ventas', {
    params: {
      desde: fechaInicio.toISOString().split('T')[0],
      hasta: fechaFin.toISOString().split('T')[0]
    }
  });

  setVentas(response.data);
};
```

### 3. **Alertas de Inventario**
```javascript
const verificarAlertas = async () => {
  const { data } = await api.get('/dashboard/inventario');

  if (data.alertas.criticos.cantidad > 0) {
    mostrarNotificacion(`⚠️ ${data.alertas.criticos.cantidad} materiales críticos`);
  }
};
```

---

## 📊 Métricas Calculadas

| Métrica | Fórmula | Descripción |
|---------|---------|-------------|
| **Porcentaje Abonado** | `(total_abonado / total_costo) × 100` | % del costo total que ha sido abonado |
| **Tasa de Conversión** | `(ventas / (ventas + cotizaciones)) × 100` | % de cotizaciones que se convierten en ventas |
| **Porcentaje Stock** | `(existencia / stock_minimo) × 100` | % del stock actual respecto al mínimo |
| **Promedio Satisfacción** | `AVG(nota_pedido)` | Promedio de notas en escala 1-7 |

---

## 🚀 Próximas Mejoras

- [ ] Exportar reportes a PDF/Excel
- [ ] Gráficos de tendencias mensuales
- [ ] Comparativas año anterior
- [ ] Alertas automáticas por email
- [ ] Dashboard en tiempo real con WebSockets
- [ ] Análisis predictivo de ventas
- [ ] Cálculo de ROI por producto

---

## 🐛 Troubleshooting

### Error: "Token inválido"
- Verifica que el token JWT sea válido
- Asegúrate de incluir "Bearer " antes del token

### Error: "Acceso denegado"
- Verifica que tu usuario tenga rol `gerente` o `administrador`

### Datos vacíos en respuesta
- Verifica que haya datos en la base de datos para el período solicitado
- Revisa las fechas del filtro (formato YYYY-MM-DD)

---

**Autor:** Sistema de Dashboard para Mueblería
**Versión:** 1.0.0
**Última actualización:** Diciembre 2024

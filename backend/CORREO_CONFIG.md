# Configuración del Servicio de Correos

Este documento describe cómo configurar el servicio de correos electrónicos en el sistema.

## Variables de Entorno Requeridas

Agrega las siguientes variables a tu archivo `.env` en el directorio `backend`:

```bash
# Configuración de Correo Electrónico
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu-correo@gmail.com
EMAIL_PASS=tu-contraseña-de-aplicacion
EMAIL_FROM="Cataldo Imprenta <tu-correo@gmail.com>"
```

## Configuración para Gmail

### 1. Habilitar autenticación de dos factores
- Ve a tu cuenta de Google: https://myaccount.google.com/
- Seguridad → Verificación en dos pasos
- Activa la verificación en dos pasos

### 2. Generar contraseña de aplicación
- Ve a: https://myaccount.google.com/apppasswords
- Selecciona "Correo" y el dispositivo que uses
- Copia la contraseña generada (16 caracteres)
- Úsala como valor de `EMAIL_PASS`

### 3. Ejemplo de configuración Gmail

```bash
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=cataldoimprenta@gmail.com
EMAIL_PASS=abcd efgh ijkl mnop  # Contraseña de aplicación (sin espacios)
EMAIL_FROM="Cataldo Imprenta <cataldoimprenta@gmail.com>"
```

## Configuración para otros proveedores

### Outlook/Hotmail
```bash
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_USER=tu-correo@outlook.com
EMAIL_PASS=tu-contraseña
EMAIL_FROM="Tu Nombre <tu-correo@outlook.com>"
```

### Servidor SMTP personalizado
```bash
EMAIL_HOST=smtp.tuservidor.com
EMAIL_PORT=587  # o 465 para SSL
EMAIL_USER=usuario@tuservidor.com
EMAIL_PASS=tu-contraseña
EMAIL_FROM="Tu Empresa <noreply@tuservidor.com>"
```

## Puertos comunes

- **587**: TLS/STARTTLS (recomendado)
- **465**: SSL (legacy)
- **25**: Sin cifrado (no recomendado)

## Endpoints de la API

### Enviar correo
```
POST /api/correos/enviar
```

Body:
```json
{
  "destinatario": "cliente@example.com",
  "asunto": "Cotización de pedido",
  "mensaje": "Estimado cliente...",
  "tipo": "cotizacion"  // opcional
}
```

### Obtener historial
```
GET /api/correos/historial?page=1&limit=20
```

Filtros opcionales:
- `destinatario`: Filtrar por email
- `estado`: enviado, fallido, pendiente
- `tipo`: cotizacion, confirmacion, entrega, seguimiento, personalizado
- `fecha_desde`: YYYY-MM-DD
- `fecha_hasta`: YYYY-MM-DD

### Obtener un correo específico
```
GET /api/correos/:id
```

### Obtener estadísticas
```
GET /api/correos/estadisticas/general
```

## Estructura de la Base de Datos

La tabla `correos` se crea automáticamente con los siguientes campos:

- `id`: Identificador único
- `destinatario`: Email del destinatario
- `asunto`: Asunto del correo
- `mensaje`: Contenido del mensaje
- `tipo`: Tipo de plantilla (cotizacion, confirmacion, etc.)
- `estado`: Estado del envío (enviado, fallido, pendiente)
- `error_mensaje`: Mensaje de error si falló
- `fecha_envio`: Timestamp del envío
- `id_usuario_emisor`: FK al usuario que envió (opcional)

## Troubleshooting

### Error: "Invalid login"
- Verifica que EMAIL_USER y EMAIL_PASS sean correctos
- Para Gmail, asegúrate de usar una contraseña de aplicación, no tu contraseña normal

### Error: "Connection timeout"
- Verifica que EMAIL_HOST y EMAIL_PORT sean correctos
- Asegúrate de que tu firewall permita conexiones SMTP salientes

### Error: "Self signed certificate"
- Algunos servidores usan certificados autofirmados
- Puedes desactivar la verificación (no recomendado en producción):
```javascript
// En correo.service.js
const transporter = nodemailer.createTransport({
  // ... otras opciones
  tls: {
    rejectUnauthorized: false
  }
});
```

## Testing

Para probar el servicio sin enviar correos reales, puedes usar [Ethereal Email](https://ethereal.email/):

1. Crea una cuenta de prueba en https://ethereal.email/create
2. Usa las credenciales generadas en tu `.env`:

```bash
EMAIL_HOST=smtp.ethereal.email
EMAIL_PORT=587
EMAIL_USER=usuario-generado@ethereal.email
EMAIL_PASS=contraseña-generada
EMAIL_FROM="Test <test@ethereal.email>"
```

Los correos enviados se pueden ver en https://ethereal.email/messages

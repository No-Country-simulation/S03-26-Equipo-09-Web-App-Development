# Integración WhatsApp Cloud API - Guía Técnica

## 📱 Descripción General

El CRM permite enviar y recibir mensajes de WhatsApp utilizando **WhatsApp Cloud API** de Meta. Esto incluye:

✅ Envío de mensajes de texto  
✅ Envío de mensajes con plantillas  
✅ Registro automático de conversaciones  
✅ Recepción de mensajes (Webhooks)  
✅ Gestión de contactos desde WhatsApp  

---

## 🔧 Configuración

### Paso 1: Crear una App en Meta Developers

1. Ir a [https://developers.facebook.com](https://developers.facebook.com)
2. Crear una nueva aplicación (Tipo: Negocio)
3. Agregar producto "WhatsApp" a la app
4. Ir a "Configuración" → "Credenciales básicas" y copiar:
   - **App ID**
   - **App Secret**

### Paso 2: Configurar WhatsApp Business Account

1. En Meta → WhatsApp → Primeros pasos
2. Crear o conectar una cuenta de WhatsApp Business
3. Obtener:
   - **Phone Number ID** (ID del número de teléfono)
   - **Business Account ID** (ID de la cuenta de negocio)

### Paso 3: Generar Access Token

1. En Meta Developers → WhatsApp → API Setup
2. Generar un **Temporary Access Token** (válido 1 hora)
3. Para producción, usar **System User Token**

### Paso 4: Configurar Variables de Entorno

Agregar al archivo `.env` o `application-prod.properties`:

```properties
WHATSAPP_PHONE_NUMBER_ID=123456789012345
WHATSAPP_BUSINESS_ACCOUNT_ID=987654321098765
WHATSAPP_ACCESS_TOKEN=EAABmhzKxxxxxxxxxxxxxxxxxxxxxxx
```

O en `application.properties` (no recomendado para producción):

```properties
whatsapp.phone-number-id=123456789012345
whatsapp.business-account-id=987654321098765
whatsapp.access-token=EAABmhzKxxxxxxxxxxxxxxxxxxxxxxx
```

---

## 📡 Endpoints de API

### 1. Enviar Mensaje Simple

```bash
POST /api/whatsapp/enviar
Content-Type: application/json

{
  "phoneNumber": "+34612345678",
  "message": "Hola, este es un mensaje de prueba desde el CRM"
}
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "data": {
    "success": true,
    "messageId": "wamid.xxxxx"
  },
  "error": null
}
```

**Formato del número:** `+[Código país][Número]`
- España: `+34...`
- México: `+52...`
- Colombia: `+57...`
- Argentina: `+54...`

---

### 2. Enviar Mensaje y Registrar en Conversaciones

```bash
POST /api/whatsapp/enviar-registrar/{contactoId}?mensaje=Hola
```

**Parámetros:**
- `contactoId`: ID del contacto (Path)
- `mensaje`: Contenido del mensaje (Query)

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "success": true,
    "messageId": "wamid.xxxxx",
    "conversacionRegistrada": true
  },
  "error": null
}
```

---

### 3. Enviar Mensaje con Plantilla

```bash
POST /api/whatsapp/enviar-template?phoneNumber=+34612345678&templateName=hello_world&parameters=Juan
```

**Parámetros:**
- `phoneNumber`: Número de teléfono del destinatario
- `templateName`: Nombre de la plantilla (creada en WhatsApp Business)
- `parameters`: Parámetros para la plantilla (múltiples valores soportados)

**Crear plantillas en Meta:**
1. WhatsApp Manager → Plantillas de mensaje
2. Nueva plantilla → Agregar variables con `{{1}}`, `{{2}}`, etc.
3. El `templateName` es la referencia a usar en el API

---

### 4. Webhook para Recibir Mensajes

```bash
POST /api/whatsapp/webhook
```

Meta enviará los mensajes recibidos aquí automáticamente.

#### Verificar Webhook (Requerido por Meta)

```bash
GET /api/whatsapp/webhook?hub.mode=subscribe&hub.challenge=123456&hub.verify_token=tu_token_secreto
```

---

### 5. Obtener Estado de la Integración

```bash
GET /api/whatsapp/status
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "integracion": "WhatsApp Cloud API",
    "version": "v18.0",
    "estado": "activo",
    "descripcion": "Integración con Meta WhatsApp Business API"
  },
  "error": null
}
```

---

## 🔄 Flujo de Webhooks

### Configurar Webhook en Meta Developers

1. WhatsApp → Configuración → Webhook
2. URL callback: `https://tudominio.com/api/whatsapp/webhook`
3. Token de verificación: Ingresar un token aleatorio
4. Campos a suscribirse: `messages` (obligatorio)

### Procesar Mensajes Recibidos

Cuando un usuario envía un mensaje a tu número de WhatsApp:

1. Meta envía un POST a `/api/whatsapp/webhook`
2. El servicio procesa el mensaje
3. Se crea automáticamente un contacto (si no existe)
4. Se registra la conversación en la BD

---

## 💼 Ejemplo Completo: Flujo de Interacción

### Escenario: Responder a un cliente de WhatsApp

```bash
# 1. Cliente envía mensaje → Webhook lo registra automáticamente

# 2. Agente (interior del CRM) ve la conversación
# 3. Agente responde desde el CRM:

curl -X POST http://localhost:8080/api/whatsapp/enviar-registrar/1 \
  -H "Content-Type: application/json" \
  -d 'mensaje=Gracias por contactarnos. ¿En qué podemos ayudarte?'

# 4. Mensaje se envía por WhatsApp y se registra en conversaciones
# 5. Cliente recibe el mensaje en WhatsApp
# 6. Ciclo continúa...
```

---

## 🛡️ Seguridad

### Token de Verificación

El token que configures en Meta debe:
- Ser secreto y único
- NO estar en código fuente
- Estar en variables de entorno
- Cambiar regularmente en producción

Actualizar en `WhatsAppController.java`:

```java
String expectedToken = System.getenv("WHATSAPP_WEBHOOK_TOKEN");
```

### Validar Remitentes

```java
// En procesarMensajeRecibido() agregar:
if (!whatsAppService.validarNumeroPermitido(fromNumber)) {
    logger.warn("Mensaje de número no permitido: {}", fromNumber);
    return;
}
```

---

## 📊 Integración con Conversaciones

Los mensajes se registran automáticamente en la tabla `conversaciones`:

| Campo | Valor |
|-------|-------|
| canal | WhatsApp |
| contenido | Mensaje recibido/enviado |
| fecha_hora | Timestamp actual |
| contacto_id | ID del contacto |

**Consultar conversaciones de WhatsApp:**

```bash
GET /api/conversaciones
```

Filtrar en el frontend por `canal = 'WhatsApp'`

---

## ⚙️ Configuración Avanzada

### Rate Limiting

WhatsApp Cloud API tiene límites:
- Plan Estándar: 1,000 mensajes /día
- Plan Profesional: Sin límite

### Reintentos

El servicio NO incluye reintentos automáticos. Para producción:

```java
@Retry(maxAttempts = 3, delay = 1000)
public Map<String, Object> enviarMensaje(String phoneNumber, String message) {
    // ...
}
```

### Monitoreo de Fallos

Implementar logging robusto:

```java
if (!success) {
    // Guardar en tabla de errores
    errorRepository.save(new ErrorLog("WhatsApp", phoneNumber, error));
}
```

---

## 🧪 Prueba en Sandbox

Meta ofrece un **Sandbox** para pruebas sin números reales:

1. WhatsApp → API Setup → Sandbox
2. Agregar números de teléfono de prueba
3. Usar esos números con credenciales de sandbox

**Ventajas:**
- No gastar mensajes reales
- Pruebas ilimitadas
- Crear números virtuales

---

## 📝 Ejemplo de Integración en Frontend

### React - Enviar Mensaje

```jsx
import { useState } from 'react';

function WhatsAppWidget({ contactoId }) {
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);

  const enviarMensaje = async () => {
    setCargando(true);
    try {
      const response = await fetch(
        `/api/whatsapp/enviar-registrar/${contactoId}?mensaje=${encodeURIComponent(mensaje)}`,
        { method: 'POST' }
      );
      const data = await response.json();
      
      if (data.success) {
        alert('✅ Mensaje enviado exitosamente');
        setMensaje('');
      } else {
        alert('❌ Error: ' + data.error);
      }
    } catch (error) {
      alert('❌ Error: ' + error.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="whatsapp-widget">
      <h3>📱 Enviar WhatsApp</h3>
      <textarea
        value={mensaje}
        onChange={(e) => setMensaje(e.target.value)}
        placeholder="Escribe tu mensaje..."
      />
      <button 
        onClick={enviarMensaje}
        disabled={cargando || !mensaje}
      >
        {cargando ? 'Enviando...' : 'Enviar por WhatsApp'}
      </button>
    </div>
  );
}

export default WhatsAppWidget;
```

---

## 🔍 Troubleshooting

| Problema | Causa | Solución |
|----------|-------|----------|
| `401 Unauthorized` | Token inválido o expirado | Regenerar token en Meta |
| `400 Bad Request` | Número mal formateado | Usar formato `+[código][número]` |
| `402 Payment Required` | Sin cuota de mensajes | Verificar plan en Meta |
| `500 Internal Error` | Error de servidor | Revisar logs del backend |
| Webhook no recibe mensajes | Webhook no configurado en Meta | Configurar en Meta Developers |

---

## 📚 Recursos Útiles

- [Documentación Oficial Meta WhatsApp Cloud API](https://developers.facebook.com/docs/whatsapp/cloud-api)
- [Referencia de API](https://developers.facebook.com/docs/whatsapp/cloud-api/reference)
- [Guía de Webhooks](https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks)
- [Gestión de Plantillas](https://www.whatsapp.com/business/downloads/WhatsApp_Business_Platform_Message_Template_Best_Practices.pdf)

---

## 🚀 Próximos Pasos

- [ ] Implementar reintentos automáticos
- [ ] Agregar soporte para adjuntos (imágenes, PDFs)
- [ ] Crear plantillas personalizadas
- [ ] Dashboard de estadísticas de WhatsApp
- [ ] Integración con CRM analytics
- [ ] Chatbot automático con IA


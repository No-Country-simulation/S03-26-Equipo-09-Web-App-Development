# API Endpoints - CRM Backend

## Resumen de Mejoras Implementadas

### 1. **Gestión de Contactos con Segmentación** ✅
**Base:** `/api/contactos`

#### Endpoints de Segmentación:
- `GET /api/contactos/segmentacion/por-estado?estado=LEAD_ACTIVO` - Filtrar por estado específico
- `GET /api/contactos/segmentacion/leads-activos` - Obtener todos los leads activos
- `GET /api/contactos/segmentacion/en-seguimiento` - Obtener contactos en seguimiento
- `GET /api/contactos/segmentacion/clientes` - Obtener todos los clientes
- `GET /api/contactos/segmentacion/leads-calificados` - Obtener leads calificados

#### Estados del Funnel:
- `LEAD_ACTIVO` - Lead nuevo activo
- `EN_SEGUIMIENTO` - En proceso de seguimiento
- `CALIFICADO` - Lead calificado
- `CLIENTE` - Cliente confirmado

### 2. **Recordatorios Automáticos** ✅
**Implementado con `@Scheduled` en `ReminderScheduler.java`**

- **Cada 24h (09:00 AM):** Envía recordatorios de seguimientos pendientes por email
- **Cada 6 horas:** Notifica sobre tareas próximas a vencer (próximas 3 días)
- **Cada lunes:** Limpia seguimientos antiguos (más de 30 días completados)

### 3. **Panel de Métricas y Analítica** ✅
**Base:** `/api/metricas`

#### Endpoints Disponibles:

##### Resumen General
```
GET /api/metricas/resumen
```
Retorna:
- `totalContactos` - Total de contactos en el sistema
- `totalConversaciones` - Total de conversaciones registradas
- `totalSeguimientos` - Total de tareas de seguimiento
- `seguimientosCompletados` - Seguimientos completados
- `seguimientosPendientes` - Seguimientos pendientes
- `tasaCompletitudSeguimientos` - Porcentaje de completitud (%)
- `contactosPorEstado` - Desglose por estado (LEAD_ACTIVO, EN_SEGUIMIENTO, CALIFICADO, CLIENTE)
- `comunicacionPorCanal` - Distribución por canal (Email, WhatsApp, Otros)

##### Embudo de Ventas (Funnel)
```
GET /api/metricas/funnel
```
Retorna:
- `leadsActivos` - Cantidad de leads activos
- `enSeguimiento` - Cantidad en seguimiento
- `calificados` - Cantidad calificados
- `clientes` - Cantidad de clientes
- `tasaConversion_LED_a_Seguimiento` - % de conversión
- `tasaConversion_Seguimiento_a_Calificado` - % de conversión
- `tasaConversion_Calificado_a_Cliente` - % de conversión

##### Estadísticas de Seguimientos
```
GET /api/metricas/seguimientos
```
Retorna:
- `totalSeguimientos` - Total de seguimientos
- `completados` - Completados
- `pendientes` - Pendientes
- `porcentajeCompletados` - % completados
- `porcentajePendientes` - % pendientes

##### Estadísticas de Conversaciones
```
GET /api/metricas/conversaciones
```
Retorna:
- `totalConversaciones` - Total de conversaciones
- `promedioConversacionesPorContacto` - Promedio

##### Canales de Comunicación
```
GET /api/metricas/canales
```
Retorna distribución por canal:
- `Email` - Conversaciones por email
- `WhatsApp` - Conversaciones por WhatsApp
- `Otros` - Otros canales

#### Exportación de Datos ✅

##### Descargar Resumen en PDF
```
GET /api/metricas/descargar/resumen-pdf
```
**Retorna:** Archivo PDF con resumen general de métricas
- Descargado como: `CRM_Resumen_Metricas.pdf`
- Contiene: Resumen general, contactos por estado, canales de comunicación

##### Descargar Embudo de Ventas en PDF
```
GET /api/metricas/descargar/funnel-pdf
```
**Retorna:** Archivo PDF con embudo de ventas
- Descargado como: `CRM_Funnel_Ventas.pdf`
- Contiene: Etapas del funnel, cantidades, tasas de conversión

##### Descargar Seguimientos en PDF
```
GET /api/metricas/descargar/seguimientos-pdf
```
**Retorna:** Archivo PDF con estadísticas de seguimientos
- Descargado como: `CRM_Seguimientos.pdf`
- Contiene: Total, completados, pendientes, porcentajes

##### Descargar Resumen en CSV
```
GET /api/metricas/descargar/resumen-csv
```
**Retorna:** Archivo CSV con resumen general
- Descargado como: `CRM_Resumen_Metricas.csv`
- Compatible con Excel, Google Sheets, etc.

##### Descargar Embudo de Ventas en CSV
```
GET /api/metricas/descargar/funnel-csv
```
**Retorna:** Archivo CSV con embudo de ventas
- Descargado como: `CRM_Funnel_Ventas.csv`

##### Descargar Seguimientos en CSV
```
GET /api/metricas/descargar/seguimientos-csv
```
**Retorna:** Archivo CSV con seguimientos
- Descargado como: `CRM_Seguimientos.csv`

### 4. **Email Service** ✅
**Endpoint:** `POST /api/email/enviar`

Métodos disponibles:
- `enviarEmail(destinatario, asunto, contenido)` - Enviar email simple
- `enviarEmailYRegistrar(contacto, asunto, contenido)` - Enviar y registrar en conversaciones
- `enviarEmailConPlantilla(destinatario, asunto, plantilla, variables)` - Con templates

### 5. **Gestión de Conversaciones** ✅
**Base:** `/api/conversaciones`

Endpoints CRUD:
- `GET /api/conversaciones` - Listar todas
- `GET /api/conversaciones/{id}` - Obtener por ID
- `POST /api/conversaciones` - Crear
- `PUT /api/conversaciones/{id}` - Actualizar
- `DELETE /api/conversaciones/{id}` - Eliminar

### 7. **Gestión de Seguimientos** ✅
**Base:** `/api/seguimientos`

Endpoints CRUD:
- `GET /api/seguimientos` - Listar todas
- `GET /api/seguimientos/{id}` - Obtener por ID
- `POST /api/seguimientos` - Crear
- `PUT /api/seguimientos/{id}` - Actualizar
- `DELETE /api/seguimientos/{id}` - Eliminar

---

## **8. Integración WhatsApp Cloud API** ✅
**Base:** `/api/whatsapp`

### Envío de Mensajes:

#### Enviar Mensaje Simple
```
POST /api/whatsapp/enviar
{
  "phoneNumber": "+34612345678",
  "message": "Hola desde CRM"
}
```

#### Enviar Mensaje y Registrar
```
POST /api/whatsapp/enviar-registrar/{contactoId}?mensaje=Texto
```

#### Enviar con Plantilla
```
POST /api/whatsapp/enviar-template?phoneNumber=+34...&templateName=hello_world&parameters=param1,param2
```

### Webhooks:

#### Webhook para Recibir Mensajes
```
POST /api/whatsapp/webhook
```

#### Verificar Webhook Token
```
GET /api/whatsapp/webhook?hub.mode=subscribe&hub.challenge=token&hub.verify_token=secret
```

#### Estado de Integración
```
GET /api/whatsapp/status
```

---

## Formato de Respuesta API

Todas las respuestas siguen el formato `ApiResponse`:

```json
{
  "success": true,
  "data": {
    // Contenido específico del endpoint
  },
  "error": null
}
```

### Ejemplo: Obtener Resumen de Métricas
```bash
curl -X GET http://localhost:8080/api/metricas/resumen
```

Respuesta:
```json
{
  "success": true,
  "data": {
    "totalContactos": 5,
    "totalConversaciones": 0,
    "totalSeguimientos": 0,
    "seguimientosCompletados": 0,
    "seguimientosPendientes": 0,
    "tasaCompletitudSeguimientos": 0.0,
    "contactosPorEstado": {
      "LEAD_ACTIVO": 1,
      "EN_SEGUIMIENTO": 1,
      "CALIFICADO": 0,
      "CLIENTE": 0
    },
    "comunicacionPorCanal": {
      "Email": 0,
      "WhatsApp": 0,
      "Otros": 0
    }
  },
  "error": null
}
```

---

## Requisitos Funcionales Cubiertos

✅ **Gestión de contactos y segmentación por estado del funnel**
- Endpoints de segmentación implementados
- Filtrado por estado disponible

✅ **Integración de canales de comunicación**
- Email y Conversaciones implementados
- WhatsApp Cloud API integrado
- Estadísticas de canales disponibles

✅ **Envío y registro de emails con etiquetas y plantillas**
- EmailService con soporte para plantillas
- Registro automático en conversaciones

✅ **Recordatorios automáticos para tareas y seguimientos**
- ReminderScheduler con @Scheduled
- Envío automático de notificaciones por email

✅ **Panel de métricas y analítica**
- MetricasController con 5 endpoints de consulta
- Resumen, funnel, seguimientos, conversaciones, canales

✅ **Exportación de datos en CSV o PDF**
- 6 endpoints de descarga (3 en PDF, 3 en CSV)
- Reportes listos para compartir con stakeholders
- Compatible con Excel, Google Sheets, Adobe Reader

✅ **Integración WhatsApp Cloud API** (NUEVA)
- Envío de mensajes de texto
- Envío de mensajes con plantillas
- Recepción de mensajes vía Webhooks
- Registro automático de conversaciones
- Compatible con Meta Business API v18.0

⚠️ **Configuración de etiquetas, vistas y filtros guardados**
- Requiere modelo adicional de Etiquetas (próxima fase)

---

## Próximas Mejoras (Fase 2)

1. **Modelo de Etiquetas** - Crear entidad para etiquetar contactos
2. **Integración WhatsApp Cloud API** - Endpoint para enviar mensajes
3. **Exportación PDF/CSV** - Descargar datos de métricas
4. **Vistas y Filtros Guardados** - Guardar búsquedas personalizadas
5. **Webhooks** - Para integraciones externas


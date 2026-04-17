# 🔄 Flujo de Estados de Conversación - Omnicanal (WhatsApp + Email)

**Fecha:** 16 de Abril, 2026  
**Estado:** ✅ IMPLEMENTADO Y COMPILADO  

---

## 📋 Descripción General

Se implementó un flujo de estados omnicanal completo para conversaciones en el Inbox:

- **PENDIENTE** → Nuevo mensaje requiere atención
- **RESPONDIDO** → El equipo ya respondió
- **CERRADO** → Caso resuelto (manual)

---

## 🛠️ Cambios Implementados

### BACKEND (Spring Boot)

#### 1. **Actualización de Enum** (`EstadoConversacion.java`)
```java
// Estados disponibles:
NO_LEIDO      // = PENDIENTE (para frontend)
LEIDO         // Visto pero sin respuesta
RESPONDIDO    // Ya hay respuesta del equipo
CERRADO       // Cerrado manualmente
FALLIDO       // Error
```

#### 2. **Nuevos Métodos en Servicio** (`ConversacionService.java`)

| Método | Descripción | Automático/Manual |
|--------|-------------|-------------------|
| `procesarMensajeExterno()` | Si está CERRADO → reabre a NO_LEIDO | Automático |
| `procesarRespuestaEnviada()` | Cambiar a RESPONDIDO al enviar | Automático |
| `cerrarConversacion()` | Cierre manual a CERRADO | Manual |
| `getPendientesPorVendedor()` | Filtrar por NO_LEIDO | - |
| `getRespondidosPorVendedor()` | Filtrar por RESPONDIDO | - |
| `getCerradosPorVendedor()` | Filtrar por CERRADO | - |

#### 3. **Nuevos Endpoints** (`ConversacionController.java`)

```
PUT  /api/conversaciones/{id}/mensaje-externo
     └─ Procesa mensaje entrante (reabre si CERRADO)

PUT  /api/conversaciones/{id}/respuesta-enviada
     └─ Marca como RESPONDIDO al enviar

PUT  /api/conversaciones/{id}/cerrar
     └─ Cierre manual (usuario elige)

GET  /api/conversaciones/por-vendedor/{id}/pendientes
     └─ Listar conversaciones PENDIENTES

GET  /api/conversaciones/por-vendedor/{id}/respondidos
     └─ Listar conversaciones RESPONDIDAS

GET  /api/conversaciones/por-vendedor/{id}/cerrados
     └─ Listar conversaciones CERRADAS
```

#### 4. **Actualización de Repositorio** (`ConversacionRepository.java`)
```java
// Nuevo método de paginación con filtro de estado:
Page<Conversacion> findByVendedorAsignadoIdAndEstado(
    Long vendedorId, 
    EstadoConversacion estado, 
    Pageable pageable
);
```

---

### FRONTEND (React + TypeScript)

#### 1. **Actualización de API Client** (`apiClient.ts`)

Nuevos métodos en `conversacionService`:

```typescript
// Marcar como respondido automáticamente
marcarRespondido(conversacionId: number)

// Procesar mensaje externo (reabre si cerrada)
procesarMensajeExterno(conversacionId: number)

// Cerrar conversación (manual)
cerrar(conversacionId: number)
```

Cada método:
- ✅ Envía Authorization header con JWT
- ✅ Maneja errores correctamente
- ✅ Retorna la conversación actualizada

#### 2. **Actualización de InboxAdmin** (`InboxAdmin.tsx`)

**Nuevo método:**
```typescript
handleCerrarConversacion = async () => {
  // Confirma con el usuario
  // Llama a backend: conversacionService.cerrar()
  // Actualiza estado localmente
  // Actualiza lista
}
```

**Actualización en handleEnviarRespuesta:**
```typescript
// Antes de actualizar estado localmente:
await conversacionService.marcarRespondido(id);
```

**Nueva UI:**
- 🔒 Botón "Cerrar Conversación" (rojo, centrado)
- Deshabilitado si estado = 'cerrado'
- Requiere confirmación

#### 3. **Actualización de InboxVendedor** (`InboxVendedor.tsx`)

Cambios idénticos a InboxAdmin:
- Método `handleCerrarConversacion`
- Actualización de `handleEnviarRespuesta`
- Botón "Cerrar Conversación"

#### 4. **Filtros en UI**

Los filtros ya estaban implementados:
```
Filtro Estado: 
  ⚠️ Todos | 📧 Pendiente | 📧 Respondido | ✅ Cerrado
```

---

## 🔁 Flujo Completo de Estados

```
┌─────────────────────────────────────────────────────────┐
│  LLEGADA DE MENSAJE EXTERNO (WhatsApp o Email)          │
│  PUT /api/conversaciones/{id}/mensaje-externo           │
└─────────────────────────────────┬───────────────────────┘
                                  ↓
                    ┌─────────────────────────────┐
                    │ ¿Estaba CERRADO?            │
                    └──────┬──────────────┬───────┘
                           │ Sí           │ No
                           ↓              ↓
                  SÍ: NO_LEIDO  →   Mantiene estado
                  (reabierto)
                           │
                           ↓
                    ┌─────────────────┐
                    │  PENDIENTE ✏️    │
                    └────────┬────────┘
                             │
           ┌─────────────────┼─────────────────┐
           │                 │                 │
           ↓                 ↓                 ↓
      Vendedor        Admin lee         Usuario cierra
      responde        (sin responder)
           │                 │                 │
           ↓                 ↓                 ↓
     Automat:         Puede responder      Cambia a
    RESPONDIDO        o cerrar   RESPONDIDO/CERRADO
           │                 │                 │
           ↓                 ↓                 ↓
    ┌─────────────┐   ┌──────────┐   ┌─────────────┐
    │ RESPONDIDO  │   │ PENDIENTE │   │   CERRADO   │
    │   (estado)  │   │ (estado)  │   │    (estado) │
    └──────┬──────┘   └─────┬────┘   └─────┬───────┘
           │                │              │
           └────────────────┼──────────────┘
                            ↓
              Nuevo mensaje externo ↓
              PUT /mensaje-externo
                            ↓
                     REABRE a PENDIENTE
                            ↓
                         (ciclo)
```

---

## ✅ Checklist de Testing

### Test 1: Automatización - Mensaje Nuevo → PENDIENTE
```
1. Login como admin@crm.local / admin123
2. Ir a Inbox Admin
3. Filtrar: Estado = Cerrado
4. Seleccionar conversación cerrada
5. Simular entrada de mensaje (via Postman a /webhook/whatsapp)
6. ✅ Esperado: Conversación pasa a PENDIENTE automáticamente
```

### Test 2: Automatización - Respuesta Enviada → RESPONDIDO
```
1. Seleccionar conversación en PENDIENTE
2. Escribir respuesta en el textarea
3. Hacer clic en "✉️ Enviar"
4. ✅ Esperado:
   - Estado cambia a RESPONDIDO automáticamente
   - Boton VERDE confirma: "✅ Conversación marcada como RESPONDIDO"
```

### Test 3: Cierre Manual → CERRADO
```
1. Seleccionar conversación en RESPONDIDO
2. Hacer clic en "🔒 Cerrar Conversación"
3. Confirmar en modal
4. ✅ Esperado:
   - Estado cambia a CERRADO
   - Botón se deshabilita
   - Aparece en filtro "Cerrado"
```

### Test 4: Reapertura Automática
```
1. Seleccionar conversación CERRADO
2. Simular mensaje entrante (Postman)
3. ✅ Esperado: Automáticamente pasa a PENDIENTE
```

### Test 5: Filtros Funcionan
```
1. Filtro Estado = "Pendiente" → Solo NO_LEIDO
2. Filtro Estado = "Respondido" → Solo RESPONDIDO
3. Filtro Estado = "Cerrado" → Solo CERRADO
4. Filtro Estado = "Todos" → Todos
5. ✅ Esperado: Filtrado correcto en lista
```

---

## 📍 Archivos Modificados

### Backend
```
✅ crm-backend/src/main/java/com/startupcrm/crm_backend/
  ├── model/EstadoConversacion.java (actualizado)
  ├── service/ConversacionService.java (6 nuevos métodos)
  ├── controller/ConversacionController.java (4 nuevos endpoints)
  └── repository/ConversacionRepository.java (1 nuevo método)
```

### Frontend
```
✅ Frontend/src/
  ├── common/apiClient.ts (3 nuevos métodos)
  ├── features/inbox/components/
  │   ├── InboxAdmin.tsx (botón + lógica)
  │   └── InboxVendedor.tsx (botón + lógica)
```

---

## 🚀 Deployment

### Build Backend
```bash
cd Backend/crm-backend
mvn clean package -DskipTests
# Output: target/crm-backend-0.0.1-SNAPSHOT.jar
```

### Run Backend
```bash
java -jar target/crm-backend-0.0.1-SNAPSHOT.jar
# Puerto: 8080
```

### Run Frontend
```bash
cd Frontend
npm run dev
# Puerto: 5173
```

---

## 📊 Resumen de Cambios

| Componente | Cambios | Líneas |
|-----------|---------|--------|
| Backend Service | 6 nuevos métodos | ~80 |
| Backend Controller | 4 nuevos endpoints | ~40 |
| Backend Repository | 1 nuevo método | ~5 |
| Frontend API Client | 3 nuevos métodos | ~50 |
| Frontend InboxAdmin | Botón + lógica | ~80 |
| Frontend InboxVendedor | Botón + lógica | ~80 |

**Total:** ~335 líneas de código nuevo

---

## 🎯 Próximos Pasos (Post-MVP)

1. **Webhook Automático:** Integración real con WhatsApp Cloud API
2. **WebSocket:** Actualizar UI en tiempo real sin refresh
3. **Notificaciones:** Alertas cuando conversación se reabre
4. **Métricas:** Dashboard de estados (pendientes, respondidos, cerrados)
5. **SLA:** Tiempo promedio en cada estado

---

## ⚙️ Configuración de Ambiente

```properties
# Backend (application.yml)
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQL13Dialect
server.port=8080

# Frontend (.env)
VITE_API_URL=http://localhost:8080/api
```

---

**Implementado por:** GitHub Copilot  
**Fecha Compilación:** 2026-04-16 20:25:05  
**Status:** ✅ LISTO PARA TESTING

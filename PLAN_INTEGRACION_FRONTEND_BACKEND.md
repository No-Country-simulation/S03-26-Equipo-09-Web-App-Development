# 📋 PLAN DE INTEGRACIÓN FRONTEND-BACKEND

**Fecha:** 14 de abril de 2026  
**Estado:** En análisis  
**Objetivo:** Adecuar el backend para que se integre funcional con la arquitectura modular del frontend

---

## 🎯 RESUMEN EJECUTIVO

El **frontend tiene una arquitectura modular limpia** con:
- ✅ 4 features con servicios placeholder (inbox, contactos, metricas, plantillas)
- ✅ Types y mocks centralizados
- ✅ Hooks reutilizables
- ⏳ **Servicios listos para conectar a API real**

El **backend tiene 90% de la API implementada** pero necesita:
- 🔧 Ajustes en endpoints según convención del frontend
- 🔧 Respuestas en formato consistente
- 🔧 Validación de DTOs
- 🔧 Integración real de plantillas (no existe)

---

## 📊 ANÁLISIS DE FEATURES

### **1. INBOX** ✅ LISTO
**Frontend Espera:**
- `GET /api/conversaciones` - Todas las conversaciones (Admin)
- `GET /api/conversaciones/por-vendedor/{vendedorId}` - Del vendedor
- `GET /api/conversaciones/{id}` - Detalle
- `POST /api/conversaciones` - Crear
- `POST /api/whatsapp/enviar` - Enviar mensaje
- `GET /api/usuarios` - Listar vendedores

**Backend Tiene:** ✅ TODOS IMPLEMENTADOS
- Conversaciones: CRUD + filtros por vendedor/contacto
- WhatsApp: Enviar + webhook + templates
- Usuarios: CRUD + por rol

**Acciones:** Verificar respuestas en ApiResponse ➜ **TEST**

---

### **2. CONTACTOS** ✅ LISTO
**Frontend Espera:**
- `GET /api/contactos` - Listar
- `GET /api/contactos/{id}` - Detalle
- `POST /api/contactos` - Crear
- `PUT /api/contactos/{id}` - Actualizar
- `DELETE /api/contactos/{id}` - Eliminar
- `GET /api/contactos/segmentacion/*` - 5 endpoints segmentación
- `GET /api/usuarios` - Para asignaciones

**Backend Tiene:** ✅ TODOS IMPLEMENTADOS
- ContactoController: CRUD completo
- 5 endpoints segmentación por estado
- Estados: LEAD_ACTIVO, EN_SEGUIMIENTO, CALIFICADO, CLIENTE

**Acciones:** Verificar tipos de datos ➜ **TEST**

---

### **3. METRICAS** ✅ LISTO
**Frontend Espera:**
- `GET /api/metricas/resumen` - Dashboard KPIs
- `GET /api/metricas/funnel` - Embudo ventas
- `GET /api/metricas/conversaciones` - Stats conversaciones
- `GET /api/metricas/descargar/resumen-pdf` - PDF export
- `GET /api/metricas/descargar/resumen-csv` - CSV export

**Backend Tiene:** ✅ TODOS IMPLEMENTADOS
- MetricasService: Resumen, funnel, seguimientos, conversaciones
- PdfExportService: 3 PDFs
- CsvExportService: Resumen CSV

**Acciones:** Verificar formato JSON de respuestas ➜ **TEST**

---

### **4. PLANTILLAS** ⚠️ FALTA
**Frontend Espera:**
- `GET /api/plantillas` - Listar plantillas de email/WhatsApp
- `GET /api/plantillas/{id}` - Detalle
- `POST /api/plantillas` - Crear
- `PUT /api/plantillas/{id}` - Editar
- `DELETE /api/plantillas/{id}` - Eliminar
- `POST /api/plantillas/enviar` - Usar plantilla

**Backend Tiene:** ❌ NO EXISTE
- No hay Entidad `Plantilla`
- No hay Controller para plantillas
- No hay Repository

**Acciones Necesarias:**
1. Crear `Plantilla.java` (Entity)
2. Crear `PlantillaRepository.java`
3. Crear `PlantillaService.java`
4. Crear `PlantillaController.java` ✅ **TODO #1**

---

### **5. SEGUIMIENTOS** ✅ LISTO (Pero no usado en frontend)
**Backend Tiene:**
- SeguimientoController: CRUD completo
- Tareas de seguimiento con fecha y estado

**Frontend:** Aún no integrado en mocks  
**Acciones:** Agregar a features/metricas o crear feature/seguimientos ➜ **OPCIONAL**

---

## 🔧 CAMBIOS NECESARIOS EN BACKEND

### **TIER 1: Críicos (Funcionalidad básica)**

#### 1. Crear Feature PLANTILLAS ✅ **PRIORIDAD ALTA**

**Archivo: `Plantilla.java`**
```java
@Entity
@Table(name = "plantillas")
public class Plantilla {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String nombre;           // "Bienvenida Lead"
    private String tipo;             // "EMAIL" | "WHATSAPP"
    private String asunto;           // [Para EMAIL]
    private String contenido;        // {var} para variables
    private Boolean activa;
    private LocalDateTime createdAt;
}
```

**Archivo: `PlantillaController.java`**
```java
@RestController
@RequestMapping("/api/plantillas")
public class PlantillaController {
    @GetMapping              // GET /api/plantillas
    @GetMapping("/{id}")     // GET /api/plantillas/{id}
    @PostMapping             // POST /api/plantillas
    @PutMapping("/{id}")     // PUT /api/plantillas/{id}
    @DeleteMapping("/{id}")  // DELETE /api/plantillas/{id}
}
```

**Archivo: `data.sql` - INSERT ejemplos**
```sql
INSERT INTO plantillas (nombre, tipo, asunto, contenido, activa) VALUES
('Bienvenida', 'EMAIL', 'Bienvenido a nuestro CRM', 'Hola {nombre}...', true),
('Seguimiento', 'EMAIL', 'Seguimiento de tu solicitud', 'Hola {nombre}...', true),
('Oferta WhatsApp', 'WHATSAPP', null, 'Hola {nombre}, te envío nuestra oferta: {oferta}', true);
```

---

#### 2. Validar formato ApiResponse en todos los endpoints

**Problema:** Algunos endpoints retornan `List<T>` directo en lugar de `ApiResponse<List<T>>`

**Solución:**
```java
// ❌ ANTES (inconsistente)
@GetMapping
public List<Conversacion> getAll() { ... }

// ✅ DESPUÉS (consistente)
@GetMapping
public ResponseEntity<ApiResponse<List<Conversacion>>> getAll() {
    return ResponseEntity.ok(new ApiResponse<>(true, conversaciones, null));
}
```

**Archivos a revisar:**
- ConversacionController.java ✓
- ContactoController.java ✓
- UsuarioController.java ✓
- SeguimientoController.java ✓

---

#### 3. Validar response content-type en exports

**Para PDF/CSV:**
```java
@GetMapping("/descargar/resumen-pdf")
public ResponseEntity<?> descargarPdf() {
    byte[] pdf = pdfService.generar();
    return ResponseEntity.ok()
        .header("Content-Type", "application/pdf")
        .header("Content-Disposition", "attachment; filename=reporte.pdf")
        .body(pdf);
}
```

---

### **TIER 2: Mejoras (Robustez)**

#### 4. Agregar paginación (Opcional pero recomendado)

```java
@GetMapping
public Page<Conversacion> getAll(
    @PageableDefault(size = 20) Pageable pageable
) { ... }
```

---

#### 5. CORS Configuration - Ajustar para localhost frontend

**Archivo: `SecurityConfig.java`**
```java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration config = new CorsConfiguration();
    config.setAllowedOrigins(Arrays.asList(
        "http://localhost:5173",      // Dev frontend
        "http://192.168.40.10:5173"   // Network access
    ));
    config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE"));
    config.setAllowedHeaders(Collections.singletonList("*"));
    config.setAllowCredentials(true);
    
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", config);
    return source;
}
```

---

## 📝 CHECKLIST DE IMPLEMENTACIÓN

### **FASE 1: Plantillas (1-2 horas)**
- [ ] Crear `Plantilla.java` Entity
- [ ] Crear `PlantillaRepository.java`
- [ ] Crear `PlantillaService.java`
- [ ] Crear `PlantillaController.java`
- [ ] Agregar INSERT en `data.sql`
- [ ] Test: `GET /api/plantillas` → 3 plantillas ejemplo
- [ ] Commit: "feat: agregar CRUD de plantillas"

### **FASE 2: Validación de Respuestas (1 hora)**
- [ ] Revisar todos los endpoints retornan `ApiResponse<T>`
- [ ] Verificar status codes HTTP (200, 201, 400, 404, 500)
- [ ] Test cada endpoint en Postman
- [ ] Commit: "refactor: estandarizar ApiResponse en todos endpoints"

### **FASE 3: CORS & Security (30 min)**
- [ ] Actualizar `SecurityConfig.java` con origins permitidos
- [ ] Test request desde `http://localhost:5173`
- [ ] Verificar headers `Access-Control-Allow-*`
- [ ] Commit: "config: ajustar CORS para dev frontend"

### **FASE 4: Test Integration (1-2 horas)**
- [ ] Backend: `mvn spring-boot:run` en puerto 8080
- [ ] Frontend: `pnpm run dev` en puerto 5173
- [ ] Test cada feature:
  - [ ] **Inbox:** GET conversaciones, POST mensaje
  - [ ] **Contactos:** GET, POST, PUT, DELETE contactos + segmentación
  - [ ] **Metricas:** GET resumen, descargar PDF
  - [ ] **Plantillas:** GET, POST, PUT plantillas
- [ ] Capture de pantalla de requests exitosos
- [ ] Commit: "integration: Frontend-Backend integration testing complete"

---

## 🔍 ENDPOINTS A VERIFICAR/AJUSTAR

### Conversaciones
```
GET  /api/conversaciones
GET  /api/conversaciones/{id}
GET  /api/conversaciones/por-vendedor/{vendedorId}
GET  /api/conversaciones/por-contacto/{contactoId}
POST /api/conversaciones
PUT  /api/conversaciones/{id}
DELETE /api/conversaciones/{id}
```

### Contactos
```
GET  /api/contactos
GET  /api/contactos/{id}
GET  /api/contactos/segmentacion/por-estado?estado=LEAD_ACTIVO
GET  /api/contactos/segmentacion/leads-activos
GET  /api/contactos/segmentacion/en-seguimiento
GET  /api/contactos/segmentacion/clientes
GET  /api/contactos/segmentacion/leads-calificados
POST /api/contactos
PUT  /api/contactos/{id}
DELETE /api/contactos/{id}
```

### Plantillas ❌ FALTA
```
GET  /api/plantillas
GET  /api/plantillas/{id}
POST /api/plantillas
PUT  /api/plantillas/{id}
DELETE /api/plantillas/{id}
```

### Metricas
```
GET  /api/metricas/resumen
GET  /api/metricas/funnel
GET  /api/metricas/conversaciones
GET  /api/metricas/descargar/resumen-pdf
GET  /api/metricas/descargar/resumen-csv
```

---

## 📌 NOTAS IMPORTANTES

1. **Base de datos:** PostgreSQL en `localhost:5432` ya configurado
2. **API Base URL:** Frontend espera `http://localhost:8080/api`
3. **Variables de entorno:** Backend necesita:
   - `MAIL_HOST`, `MAIL_USERNAME`, `MAIL_PASSWORD` (Email)
   - `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_BUSINESS_ACCOUNT_ID`, `WHATSAPP_ACCESS_TOKEN` (Meta)
4. **DTOs:** Fronted espera respuestas con propiedades en camelCase
5. **Errores:** Frontend espera campo `error` en ApiResponse cuando hay fallo

---

## 🚀 SIGUIENTE PASO

**Opción A:** Crear todas las features de Plantillas ahora (Recomendado)  
**Opción B:** Empezar testing con features existentes, agregar Plantillas después

¿Cuál prefieres?

# PLAN FASE 2: Frontend Integration + E2E Testing

**Estado:** En Progreso  
**Fecha Inicio:** 16 de Abril 2026  
**Objetivo:** Conectar frontend con backend RBAC + JWT + Inbox Unificado

---

## 📋 ANÁLISIS ACTUAL

### ✅ Lo que funciona
- Login.tsx → POST /api/usuarios/login (JWT real)
- Authentication via localStorage + Bearer tokens
- apiClient.ts estructura lista para integración
- useAuth hook extrae rol/token correctamente
- Metricas públicas cargando

### ⚠️ Lo que necesita ajustes
- Register.tsx usa mock tokens (convertir a API real)
- Inbox.tsx/MiInbox.tsx probablemente usan CONVERSACIONES_MOCK_VENDEDOR
- Endpoints de conversaciones privadas ausentes en SecurityConfig
- Dashboard.tsx fallbacks a mockData (validar cuáles endpoints fallan)
- localStorage no es seguro (MVP OK, producción → httpOnly cookies)

### ❌ Bloqueadores identificados
1. `/api/conversaciones/por-vendedor/{id}` - Necesita estar público O estar autenticado
2. `/api/seguimientos` endpoints - Validar si están mapeados
3. `/api/whatsapp/enviar` - Validar autorización
4. `/api/email/enviar` - Validar autorización
5. Admin Inbox en `/api/admin/conversaciones/todas` - Solo para ADMIN ✅

---

## 🎯 PLAN DE TRABAJO

### BLOQUE 1: Seguridad Backend (Validar Endpoints)
**Duración estimada:** 30 min

- [ ] 1.1 Revisar SecurityConfig.java
  - [ ] ¿/api/conversaciones/por-vendedor/** es público?
  - [ ] ¿/api/seguimientos es público?
  - [ ] ¿/api/whatsapp/enviar está protegido?
  - [ ] ¿/api/email/enviar está protegido?

- [ ] 1.2 Actualizar SecurityConfig si faltan endpoints
  - Permitir GET /api/conversaciones/por-vendedor/** (vendedores ven sus datos)
  - Permitir GET/POST /api/seguimientos (vendedores crean)
  - Proteger POST /api/whatsapp/enviar (vendedores autenticados)
  - Proteger POST /api/email/enviar (vendedores autenticados)

- [ ] 1.3 Recompile + Restart Backend

### BLOQUE 2: Frontend Register Real
**Duración estimada:** 20 min

- [ ] 2.1 Editar Register.tsx
  - Reemplazar mock token por POST /api/usuarios
  - Capturar token real del response
  - Guardar en localStorage
  - Redirigir a Dashboard

- [ ] 2.2 Testear Register
  - Crear usuario con email válido
  - Verificar token en localStorage
  - Verificar que redirige a Dashboard
  - Verificar que rol es VENDEDOR (default)

### BLOQUE 3: Frontend Inbox - Conectar a API Real
**Duración estimada:** 40 min

- [ ] 3.1 Editar Inbox.tsx (Admin)
  - Reemplazar CONVERSACIONES_MOCK
  - Llamar GET /api/admin/conversaciones/todas
  - Parsear response a ConversacionDTO[]
  - Soportar paginación

- [ ] 3.2 Editar MiInbox.tsx (Vendedor)
  - Llamar GET /api/conversaciones/por-vendedor/{vendedorId}
  - Filtrar visible solo props del vendedor
  - Actualizar tabla en tiempo real

- [ ] 3.3 Crear hook useConversaciones
  - Wrapper para GET /api/conversaciones (todos)
  - GET /api/admin/conversaciones/todas (admin)
  - GET /api/conversaciones/por-vendedor/{id} (vendedor)
  - Manejo de errors + loading

### BLOQUE 4: Frontend Dashboard - Validar Datos Reales
**Duración estimada:** 20 min

- [ ] 4.1 Auditar Dashboard.tsx
  - ¿Qué endpoints llama?
  - ¿Dónde cae a mockData?
  - ¿Cuáles están funcionando?

- [ ] 4.2 Conectar Dashboard con Metricas Reales
  - GET /api/metricas/resumen (ya funciona ✅)
  - GET /api/metricas/vendedor/{id}
  - Mostrar datos reales en cards

### BLOQUE 5: Testing End-to-End
**Duración estimada:** 60 min

- [ ] 5.1 Crear test e2e plan
  - [ ] Login → token en localStorage
  - [ ] Register usuario nuevo → auto-login
  - [ ] Admin ve inbox con todas conversaciones
  - [ ] Vendedor ve solo sus conversaciones
  - [ ] Dashboard carga métricas reales
  - [ ] Desconectar sesión → localStorage limpio

- [ ] 5.2 Manual testing
  - Ejecutar flujo completo como ADMIN
  - Ejecutar flujo completo como VENDEDOR
  - Verificar permisos respetados
  - Validar errores 403 manejados correctamente

- [ ] 5.3 Registrar resultados
  - Documentar casos pasados
  - Documentar bugs encontrados
  - Listar mejoras futuras (refresh tokens, httpOnly cookies, rate limit)

### BLOQUE 6: Documentación + Cleanup
**Duración estimada:** 20 min

- [ ] 6.1 Crear FASE2_RESULTS.md
  - Resumen de cambios realizados
  - Endpoints integrados
  - Tests ejecutados
  - Status de production readiness

- [ ] 6.2 Commit final
  - `git add -A`
  - `git commit -m "Fase 2: Frontend Integration Complete"`
  - `git push`

---

## 🔗 ENDPOINTS A VALIDAR

| Endpoint | Método | Esperado | Estado |
|----------|--------|----------|--------|
| /api/usuarios/login | POST | 200 + JWT | ✅ Working |
| /api/usuarios | POST | 201 | ? |
| /api/admin/conversaciones/todas | GET | 200 | ✅ Working |
| /api/conversaciones/por-vendedor/{id} | GET | 200 | ? |
| /api/seguimientos | GET/POST | 200/201 | ? |
| /api/whatsapp/enviar | POST | 200 | ? |
| /api/email/enviar | POST | 200 | ? |
| /api/metricas/resumen | GET | 200 | ✅ Working |
| /api/metricas/vendedor/{id} | GET | 200 | ? |

---

## ⏱️ TIMELINE ESTIMADO

| Bloque | Tiempo | Total |
|--------|--------|-------|
| 1. Backend Security | 30 min | 30 min |
| 2. Register Real | 20 min | 50 min |
| 3. Inbox Integration | 40 min | 90 min |
| 4. Dashboard Validation | 20 min | 110 min |
| 5. E2E Testing | 60 min | 170 min |
| 6. Documentation | 20 min | 190 min |
| **TOTAL** | - | **3h 10 min** |

---

## 🎬 PRÓXIMO PASO

**Recomendación:** Comenzar con **BLOQUE 1** (Backend Security)

1. Revisar SecurityConfig.java actual
2. Identificar qué endpoints faltan permisos
3. Permitir acceso público a endpoints de lectura (GET)
4. Proteger endpoints de escritura (POST/PUT/DELETE) con autenticación

¿Comenzamos?

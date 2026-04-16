# 📊 EXPORTACIÓN DE BASE DE DATOS POBLADA

## Descripción

`data_poblada.sql` es un archivo de backup completo de la base de datos `crm_backend` con estructura y datos de ejemplo.

**Ubicación:** `Backend/crm-backend/src/main/resources/data_poblada.sql`

---

## 📋 Contenido del Dump

El archivo contiene:

### 🗂️ Tablas y Datos:
- ✅ **usuarios** (4 usuarios: 1 admin, 3 vendedores)
- ✅ **contactos** (5 leads con asignaciones)
- ✅ **conversaciones** (5 conversaciones WhatsApp/Email)
- ✅ **plantillas** (6 plantillas de mensajes)
- ✅ **seguimientos** (2 tareas de seguimiento)

### 📊 Estadísticas:
```
Tamaño: 15 KB
Líneas: 423
Tablas: 5
Registros: 17+ registros de datos
```

---

## 🔧 Opciones de Exportación Usadas

```bash
pg_dump \
  -h localhost \
  -U postgres \
  -d crm_backend \
  --column-inserts \      # ✅ INSERTs legibles con nombres de columnas
  --no-owner \            # ✅ Sin referencias a usuario "harold"
  --no-privileges \       # ✅ Sin permisos específicos del sistema
  > data_poblada.sql
```

**Ventajas:**
- 🟢 Legible y mantenible
- 🟢 Compatible entre usuarios diferentes
- 🟢 Sin conflictos de permisos
- 🟢 Fácil de versionar en Git

---

## ⚙️ Carga Automática en Spring Boot

### Configuración en `application.properties`:

```properties
spring.jpa.hibernate.ddl-auto=update
spring.sql.init.mode=always
spring.sql.init.data-locations=classpath:data_poblada.sql
spring.jpa.defer-datasource-initialization=true
```

### ¿Qué hace?

1. **Crear tablas** (si no existen): `ddl-auto=update`
2. **Cargar datos** siempre: `init.mode=always`
3. **Desde archivo**: `data-locations=classpath:data_poblada.sql`
4. **Deferir inicialización**: `defer-datasource-initialization=true`

**Resultado:** Al ejecutar `./mvnw spring-boot:run`, la BD se puebla automáticamente.

---

## 👥 Datos de Acceso de Prueba

### Usuarios en la base de datos:

| Email | Rol | Password | Activo |
|-------|-----|----------|--------|
| admin@crm.local | ADMIN | admin123 | ✅ |
| carlos.lopez@crm.local | VENDEDOR | carlos123 | ✅ |
| ana.sanchez@crm.local | VENDEDOR | ana123 | ✅ |
| pedro.gomez@crm.local | VENDEDOR | pedro123 | ✅ |

### Leads de Ejemplo:

```
- Roberto Martínez (roberto.martinez@empresa.com) → LEAD_ACTIVO
- Laura Fernández (laura.fernandez@startup.io) → INACTIVO
- David López (david.lopez@empresa.es) → CLIENTE
- Patricia González (patricia.gonzalez@company.com) → CLIENTE
- Francisco Ruiz (francisco.ruiz@negocio.es) → CLIENTE
```

---

## 🚀 Cómo Usar en el Equipo

### Al clonar el repo:

```bash
# 1. Clonar y setup normal
git clone <repo>
cd proyecto
bash setup.sh

# 2. Configurar .env (base de datos local)
cd Backend/crm-backend
nano .env

# 3. Arrancar backend - se puebla automáticamente
./mvnw spring-boot:run

# ✅ La BD crm_backend se crea y puebla automáticamente
# ✅ Puedes acceder con usuario admin@crm.local / admin123
```

---

## 🔄 Regenerar el Dump Cuando Haya Cambios

Si agregas nuevos datos y quieres compartirlos:

```bash
cd Backend/crm-backend/src/main/resources

# Exportar nuevamente
pg_dump -h localhost -U postgres -d crm_backend \
  --column-inserts \
  --no-owner \
  --no-privileges \
  > data_poblada.sql

# Verificar que está limpio (sin credenciales reales)
grep -E "password=|harold" data_poblada.sql
# ❌ Si aparece algo → editarlo manualmente

# Commitear
git add data_poblada.sql
git commit -m "Update populated database with new data"
git push
```

---

## 📌 Notas Importantes

### ✅ SEGURIDAD:
- El archivo NO contiene contraseñas reales
- Las contraseñas de test (`admin123`, `carlos123`) son genéricas
- Las credenciales de BD se cargan desde `.env`

### ✅ COMPATIBILIDAD:
- Funciona en PostgreSQL 12+
- Portable entre diferentes máquinas
- Compatible con Docker/contenedores

### ⚠️ IMPORTANTE:
- Si cambias `spring.sql.init.mode` de `always` a `on-create`, los datos solo se cargan una vez
- Para resetear: `DROP DATABASE crm_backend; CREATE DATABASE crm_backend;`

---

## 🐛 Troubleshooting

### Error: "relation already exists"

**Causa:** El script intenta crear tablas que ya existen

**Solución:**
```bash
# Option 1: Limpiar base de datos
psql -U postgres -c "DROP DATABASE crm_backend; CREATE DATABASE crm_backend;"

# Option 2: Cambiar config a "on-create" (solo primera vez)
# En application.properties:
# spring.sql.init.mode=on-create
```

### Error: "password authentication failed"

**Causa:** Las credenciales en `.env` son incorrectas

**Solución:**
```bash
# Verificar credenciales
psql -h localhost -U postgres -d crm_backend -c "SELECT COUNT(*) FROM usuarios;"

# Si falla, editar .env con credenciales correctas
nano .env
```

### Datos no cargan

**Causa:** `data_poblada.sql` no se encuentra

**Solución:**
```bash
# Verificar que el archivo existe
ls -la src/main/resources/data_poblada.sql

# Verificar que application.properties tiene la línea:
grep "sql.init.data-locations" src/main/resources/application.properties
```

---

## 📝 Cambios Recientes

| Fecha | Cambio |
|-------|--------|
| 15/04/2026 | ✅ Exportado database completa a `data_poblada.sql` |
| 15/04/2026 | ✅ Configurado Spring Boot para cargar automáticamente |
| 15/04/2026 | ✅ Documentación creada |

---

## 👥 Para el Equipo

Este archivo hace que:
1. ✅ Cada developer tenga datos de prueba idénticos
2. ✅ No haya necesidad de crear datos manualmente
3. ✅ Los tests tengan datos consistentes
4. ✅ Las demos funcionen con datos reales

**Solo nivel:** El archivo se actualiza cuando hay cambios importantes en el modelo de datos.

---

## 📞 Preguntas Frecuentes

### P: ¿Puedo modificar los datos de prueba?
**R:** Sí, pero los cambios no persisten en Git. Solo para testing local. Para cambios permanentes, edita `data_poblada.sql` y haz push.

### P: ¿Cómo agrego más datos de prueba?
**R:** Agrega a través de la interfaz, luego exporta nuevamente con el comando `pg_dump` indicado arriba.

### P: ¿Esto sobrescribe mi base de datos local?
**R:** Solo en arranque. Si cambias a `spring.sql.init.mode=on-create`, no se ejecutará nuevamente. Para forzar, borra la BD.

### P: ¿Funciona en Docker?
**R:** Sí, el archivo se copia automáticamente en el contenedor si está en `src/main/resources`.

---

**Estado:** 🟢 Listo para distribuir
**Última actualización:** 15/04/2026

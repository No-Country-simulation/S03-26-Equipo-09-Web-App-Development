# 🔐 CONFIGURACIÓN SEGURA DEL PROYECTO

## Descripción

Este documento explica cómo configurar correctamente el proyecto después de clonar el repositorio, manteniendo las credenciales seguras y privadas.

## ⚠️ IMPORTANTE: NO COMPARTIR ARCHIVOS DE CONFIGURACIÓN

Los siguientes archivos **NUNCA** deben ser compartidos ni commiteados:
- `.env` (variables de entorno locales)
- `application.properties` (credenciales de base de datos)
- Cualquier archivo con contraseñas o tokens

Estos archivos están incluidos en `.gitignore` para protección automática.

---

## 🚀 SETUP INICIAL

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-equipo/repo-crm.git
cd repo-crm
```

### 2. Backend - Configurar variables de entorno

#### Linux/macOS:

```bash
cd Backend/crm-backend

# Copiar template de variables de entorno
cp .env.example .env

# Editar con tus credenciales locales
nano .env
```

#### Windows (PowerShell):

```bash
cd Backend\crm-backend
copy .env.example .env
notepad .env
```

#### Variables necesarias en `.env`:

```properties
# Base de datos PostgreSQL
DB_URL=jdbc:postgresql://localhost:5432/crm_backend
DB_USER=postgres
DB_PASSWORD=tu_contraseña_local

# Email (Brevo/Gmail)
MAIL_HOST=smtp-relay.brevo.com
MAIL_PORT=587
MAIL_USERNAME=tu_email@ejemplo.com
MAIL_PASSWORD=tu_token_brevo

# WhatsApp (opcional)
WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_BUSINESS_ACCOUNT_ID=
WHATSAPP_ACCESS_TOKEN=
```

### 3. Frontend - Configurar variables de entorno

#### Linux/macOS:

```bash
cd Frontend

# Copiar template
cp .env.example .env.local

# Editar (normalmente solo necesita la URL del backend)
nano .env.local
```

#### Windows:

```bash
cd Frontend
copy .env.example .env.local
notepad .env.local
```

#### Contenido de `.env.local`:

```properties
VITE_API_URL=http://localhost:8080
```

---

## 🗄️ CONFIGURACIÓN DE BASE DE DATOS

### Requisitos:
- PostgreSQL 12+ instalado en tu máquina
- Usuario `postgres` con contraseña

### Crear base de datos:

```bash
# Conectar a PostgreSQL
psql -U postgres

# Dentro de psql:
CREATE DATABASE crm_backend;
\q
```

El backend creará automáticamente las tablas cuando inicie (configurado con `spring.jpa.hibernate.ddl-auto=update`).

---

## ✅ INICIAR LOS SERVICIOS

### 1. Terminal 1 - Backend

```bash
cd Backend/crm-backend
./mvnw spring-boot:run
```

**Esperado:** El servidor inicia en `http://localhost:8080`

```
Started CrmBackendApplication in X.XXX seconds
```

### 2. Terminal 2 - Frontend

```bash
cd Frontend
pnpm install  # Primera vez solamente
pnpm run dev
```

**Esperado:** La aplicación inicia en `http://localhost:5173`

---

## 🔧 VARIABLES DE ENTORNO DISPONIBLES

### Backend (.env)

| Variable | Valor Defecto | Descripción |
|----------|---------------|-------------|
| `DB_URL` | `jdbc:postgresql://localhost:5432/crm_backend` | URL conexión PostgreSQL |
| `DB_USER` | `postgres` | Usuario de base de datos |
| `DB_PASSWORD` | `changeme` | Contraseña BD (CAMBIAR) |
| `MAIL_HOST` | `smtp-relay.brevo.com` | Servidor SMTP |
| `MAIL_PORT` | `587` | Puerto SMTP |
| `MAIL_USERNAME` | - | Tu email de Brevo |
| `MAIL_PASSWORD` | - | Token de Brevo |
| `MAIL_FROM` | `noreply@crm.com` | Email de origen |
| `WHATSAPP_PHONE_NUMBER_ID` | - | ID de número WhatsApp |
| `WHATSAPP_BUSINESS_ACCOUNT_ID` | - | ID cuenta negocio |
| `WHATSAPP_ACCESS_TOKEN` | - | Token de acceso Meta |

### Frontend (.env.local)

| Variable | Valor Defecto | Descripción |
|----------|---|-------------|
| `VITE_API_URL` | `http://localhost:8080` | URL del backend |

---

## 🛡️ SEGURIDAD

### Buenas prácticas:

1. ✅ **Archivos .env son privados**
   - `.gitignore` los protege automáticamente
   - Cada desarrollador tiene su propio `.env` local

2. ✅ **Credenciales en variables de entorno**
   - No hardcodear en código
   - Spring Boot carga automáticamente desde `.env`

3. ✅ **Rotación de credenciales**
   - Si se expone una contraseña, cambiarla inmediatamente
   - Compartir nueva contraseña por canal seguro

4. ✅ **Logs limpios**
   - Backend no imprime contraseñas en logs
   - Frontend usa `console.log` solo en desarrollo

---

## 🐛 TROUBLESHOOTING

### Error: "Failed to connect to database"

```
❌ Cannot get JDBC Connection; nested exception is java.sql.SQLException: 
No suitable driver found for jdbc:postgresql://localhost:5432/crm_backend
```

**Solución:**
- Verificar que PostgreSQL está corriendo: `psql -U postgres`
- Verificar credenciales en `.env`
- Verificar que la base de datos existe: `CREATE DATABASE crm_backend;`

### Error: "MAIL_PASSWORD is empty"

**Solución:**
- Copiar plantilla: `cp .env.example .env`
- Editar `.env` con credenciales reales
- Reiniciar backend

### Frontend no se conecta al backend

**Solución:**
- Verificar `VITE_API_URL` en `.env.local`
- Verificar que backend está corriendo en puerto 8080
- Revisar CORS en backend (si hay problemas)

---

## 📝 NOTAS PARA EL EQUIPO

1. **Pull request sin .env:**
   - Los revisores NO deben ver `.env` modificado
   - Si aparece, rechazar PR

2. **Compartir credenciales:**
   - Usar password manager (1Password, Bitwarden)
   - O canal privado (Slack DM, Discord)
   - Nunca en email sin encriptar

3. **Variables nuevas:**
   - Actualizar `.env.example` con nuevas variables
   - Documentar qué hace cada una
   - Avisar al equipo del cambio

---

## 🚀 DEPLOYMENT (Producción)

En producción:
- Password manager (AWS Secrets Manager, HashiCorp Vault)
- Variables de entorno del servidor (no archivos .env)
- HTTPS y credenciales rotadas
- Auditoría de acceso a credenciales

---

## 📞 SOPORTE

Si todos los servicios están corriendo pero algo falla:
1. Revisar logs del backend: `./mvnw spring-boot:run`
2. Revisar logs del frontend: `pnpm run dev`
3. Usar DevTools del navegador (F12 → Console)
4. Consultar con el equipo 👥

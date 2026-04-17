# CRM Backend

Proyecto backend para un CRM básico con **Spring Boot** y **PostgreSQL**.  
Incluye entidades de **Contacto**, **Conversación** y **Seguimiento**, con endpoints CRUD listos para probar en Postman.

---

## 🚀 Requisitos

- Java 17+
- Maven
- PostgreSQL (ejemplo: versión 15)
- pgAdmin4 (opcional, para inspección de la base)

---

## ⚙️ Configuración

1. Crear la base de datos en PostgreSQL:
   ```sql
   CREATE DATABASE crm_backend;
   ```

2. Configurar `src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/crm_backend
   spring.datasource.username=postgres
   spring.datasource.password=tu_password
   spring.jpa.hibernate.ddl-auto=update
   spring.jpa.show-sql=true
   ```

3. (Opcional) Poblar datos iniciales con `data.sql`:
   ```sql
   INSERT INTO contactos (id, nombre, email, telefono, estado)
   VALUES
   (1, 'Carlos Pérez', 'carlos.perez@example.com', '555-1234', 'LEAD_ACTIVO'),
   (2, 'María López', 'maria.lopez@example.com', '555-5678', 'EN_SEGUIMIENTO'),
   (3, 'Juan García', 'juan.garcia@example.com', '555-9012', 'CLIENTE');

   INSERT INTO conversaciones (id, canal, contenido, fecha_hora, contacto_id)
   VALUES
   (1, 'WhatsApp', 'Primera conversación con Carlos', '2026-03-20 10:00:00', 1),
   (2, 'Email', 'Propuesta enviada a María', '2026-03-21 15:30:00', 2);

   INSERT INTO seguimientos (id, completado, fecha, tarea, contacto_id)
   VALUES
   (1, false, '2026-03-25', 'Llamar a Carlos para seguimiento', 1),
   (2, false, '2026-03-28', 'Revisar propuesta enviada a María', 2),
   (3, true, '2026-03-23', 'Confirmar entrega con Juan', 3);
   ```

---

## ▶️ Levantar el backend


El backend quedará disponible en `http://localhost:8080`.

---

## 📡 Endpoints disponibles

### Contactos
- `GET /api/contactos` → lista todos los contactos
- `GET /api/contactos/{id}` → obtiene un contacto por ID
- `POST /api/contactos` → crea un nuevo contacto
- `PUT /api/contactos/{id}` → actualiza un contacto
- `DELETE /api/contactos/{id}` → elimina un contacto

### Conversaciones
- `GET /api/conversaciones`
- `POST /api/conversaciones`
- `PUT /api/conversaciones/{id}`
- `DELETE /api/conversaciones/{id}`

### Seguimientos
- `GET /api/seguimientos`
- `POST /api/seguimientos`
- `PUT /api/seguimientos/{id}`
- `DELETE /api/seguimientos/{id}`

---

## 🧪 Pruebas rápidas en Postman

Ejemplo `GET`:
```
http://localhost:8080/api/contactos
```

Ejemplo `POST` (crear seguimiento):
```json
{
  "tarea": "Revisar contrato con Pedro",
  "fecha": "2026-04-01",
  "completado": false,
  "contacto": {
    "id": 1
  }
}
```

## 📌 Notas

- La seguridad está deshabilitada para pruebas (`permitAll()` en `SecurityConfig`).
- Para producción, se recomienda configurar usuarios y roles.
- Evita subir contraseñas reales en `application.properties`. Usa variables de entorno si es necesario.
```



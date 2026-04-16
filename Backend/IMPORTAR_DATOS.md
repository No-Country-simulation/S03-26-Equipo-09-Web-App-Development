# 📊 Importar Datos Base en la BD

El proyecto ahora viene **SIN datos precargados**. Si necesitas cargar datos de ejemplo para desarrollo/testing, sigue estos pasos:

## Opción 1: Importar archivo SQL (Recomendado)

Cuando el líder comparta el archivo `data_poblada.sql`:

```bash
# Desde la carpeta del Backend
psql -h localhost -U postgres -d crm_backend < ruta/al/archivo/data_poblada.sql
```

O en Windows (PowerShell):
```powershell
& 'C:\Program Files\PostgreSQL\16\bin\psql.exe' -h localhost -U postgres -d crm_backend < "ruta\al\archivo\data_poblada.sql"
```

## Opción 2: Importar desde pgAdmin (GUI)

1. Abre **pgAdmin**
2. Conéctate a tu servidor PostgreSQL local
3. Selecciona la base de datos `crm_backend`
4. Haz clic derecho → **Restore...**
5. Selecciona el archivo `data_poblada.sql`
6. Ejecuta

## Opción 3: Importar desde DBeaver

1. Abre **DBeaver** → Conéctate a `crm_backend`
2. Menú: `SQL → Execute Script`
3. Selecciona el archivo `data_poblada.sql`
4. Click en Execute

## ⚠️ Notas Importantes

- La **contraseña de PostgreSQL** debe ser: `crm123456`
- Las **tablas se crean automáticamente** al iniciar Spring Boot (gracias a Hibernate)
- Solo necesitas importar los **datos**, no las tablas

## Usuarios de ejemplo (si se importan datos)

```
usuario@email.com | contraseña | rol
admin@crm.local | admin123 | ADMIN
carlos@crm.local | pass123 | VENDEDOR
ana@crm.local | pass123 | VENDEDOR
pedro@crm.local | pass123 | VENDEDOR
```

---

**¿Preguntas?** Contacta al líder del proyecto para obtener el archivo `data_poblada.sql`.

# Software Test Document - STD - CRM

## 1. Objetivo 
Definir la estrategia inicial de pruebas a utilizar en el CRM, con un enfoque en los flujos principales del MVP.

## 2. Alcance
- Gestión de Contactos
- Integración con WhatsApp y Correo electrónico 
- Envío de correos con etiquetas y plantillas 
- Funnel
- Panel de Métricas y Analítica
- Exportación de datos
- Configuración de etiquetas y filtros

## 3. Estrategia de Testing
- Testing Manual
- Pruebas en el navegador
- Pruebas con Postman

## 4. Flujos principales

### Gestión de contactos
- Crear contacto
- Editar contacto
- Eliminar contacto
- Visualizar lista de contactos

---

### Comunicación (WhatsApp / Email)
- Enviar mensaje a un contacto
- Recibir y visualizar mensajes
- Registrar historial de conversaciones
- Validar envío de correos con plantillas

---

### Funnel (Gestión de leads)
- Crear lead
- Cambiar estado del lead (ej: nuevo → contacto → seguimiento)
- Visualizar estado actual del lead
- Filtrar contactos por estado

---

### Panel de métricas
- Visualizar métricas principales (contactos activos, mensajes enviados, tasa de respuesta)
- Validar que los datos mostrados sean correctos

---

### Exportación de datos
- Exportar contactos a CSV o PDF
- Validar que el archivo contenga la información correcta

---

### Configuración (etiquetas y filtros)
- Crear etiquetas
- Asignar etiquetas a contactos
- Filtrar contactos por etiquetas
- Guardar filtros personalizados
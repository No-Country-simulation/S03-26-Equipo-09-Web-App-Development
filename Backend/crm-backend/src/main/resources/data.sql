-- ===============================================
-- SEED DATA - DATOS DE PRUEBA INICIALES
-- ===============================================

-- Limpiar datos anteriores
DELETE FROM plantillas WHERE id > 0;
DELETE FROM seguimientos WHERE id > 0;
DELETE FROM conversaciones WHERE id > 0;
DELETE FROM contactos WHERE id > 0;
DELETE FROM usuarios WHERE id > 0;

-- ===============================================
-- USUARIOS (1 ADMIN + 3 VENDEDORES)
-- ===============================================
INSERT INTO usuarios (id, nombre, email, password, role, telefono, activo)
VALUES
(1, 'Harold Admin', 'admin@crm.local', 'admin123', 'ADMIN', '+34 911 234 567', true),
(2, 'Carlos López', 'carlos.lopez@crm.local', 'carlos123', 'VENDEDOR', '+34 601 111 111', true),
(3, 'Ana María Sánchez', 'ana.sanchez@crm.local', 'ana123', 'VENDEDOR', '+34 602 222 222', true),
(4, 'Pedro Gómez', 'pedro.gomez@crm.local', 'pedro123', 'VENDEDOR', '+34 603 333 333', true);

-- ===============================================
-- CONTACTOS (5 LEADS/CONTACTOS)
-- ===============================================
INSERT INTO contactos (id, nombre, email, telefono, estado, vendedor_asignado_id)
VALUES
(1, 'Roberto Martínez', 'roberto.martinez@empresa.com', '+34 650 123 456', 'LEAD_ACTIVO', 2),
(2, 'Laura Fernández', 'laura.fernandez@startup.io', '+34 651 234 567', 'INACTIVO', 3),
(3, 'David López', 'david.lopez@empresa.es', '+34 652 345 678', 'CLIENTE', 4),
(4, 'Patricia González', 'patricia.gonzalez@company.com', '+34 653 456 789', 'CLIENTE', 2),
(5, 'Francisco Ruiz', 'francisco.ruiz@negocio.es', '+34 654 567 890', 'CLIENTE', 3);

-- ===============================================
-- CONVERSACIONES (WEBHOOK SIMULATOR + MANUALES)
-- ===============================================
INSERT INTO conversaciones (id, canal, contenido, fecha_hora, contacto_id, vendedor_asignado_id)
VALUES
-- Conversaciones WhatsApp
(1, 'WhatsApp', '¿Cuál es el precio de vuestro producto premium?', '2026-04-14 10:30:00', 1, 2),
(2, 'WhatsApp', 'Tengo un problema con la integración de API', '2026-04-14 12:15:00', 2, 3),
(3, 'WhatsApp', '¿Tienen disponibilidad para llamada de demostración?', '2026-04-14 14:45:00', 4, 2),
-- Conversaciones Email
(4, 'Email', 'Solicitud de información sobre plan empresarial', '2026-04-14 09:00:00', 3, 4),
(5, 'Email', 'Renovación de suscripción - Facturación', '2026-04-14 11:30:00', 5, 3);

-- ===============================================
-- PLANTILLAS EMAIL
-- ===============================================
INSERT INTO plantillas (nombre, tipo, asunto, contenido, activa, created_at, updated_at)
VALUES
('Bienvenida Cliente', 'EMAIL', 'Bienvenido a nuestro servicio', 
'Hola {nombre},

Fábrica por tu interés en nuestro servicio. Estamos emocionados de trabajar contigo.

Tu cuenta ha sido creada exitosamente. Puedes acceder con tus credenciales en: https://crm.local

Cualquier duda, no dudes en contactarnos.

Saludos,
Equipo CRM', true, NOW(), NOW()),

('Seguimiento', 'EMAIL', 'Seguimiento de tu solicitud',
'Hola {nombre},

Queremos darte seguimiento sobre tu solicitud #{referencia}.

¿Hay algo en lo que podamos ayudarte? Estamos a tu disposición.

Saludos,
{vendedor}', true, NOW(), NOW()),

('Cierre Venta', 'EMAIL', 'Confirmación de tu compra',
'Hola {nombre},

¡Gracias por tu compra! Tu pedido ha sido confirmado.

Detalles:
- Número de pedido: {pedido}
- Monto: {monto}
- Fecha de envío: {fecha_envio}

Puedes rastrear tu envío usando el tracking: {tracking}

Saludos,
{vendedor}', true, NOW(), NOW()),

('Propuesta Comercial', 'EMAIL', 'Propuesta personalizada para {nombre}',
'Hola {nombre},

Te adjuntamos nuestra propuesta personalizada basada en tus necesidades.

Presupuesto: {presupuesto}
Plazo: {plazo} días
Beneficios incluidos: {beneficios}

¿Te gustaría agendar una llamada para discutirla?

Saludos,
{vendedor}', true, NOW(), NOW());

-- ===============================================
-- PLANTILLAS WHATSAPP
-- ===============================================
INSERT INTO plantillas (nombre, tipo, asunto, contenido, activa, created_at, updated_at)
VALUES
('Oferta Especial', 'WHATSAPP', NULL,
'Hola {nombre}! 🚀

Tenemos una oferta especial solo para ti:
🎁 {oferta}
💰 Precio: {precio}
⏰ Válido hasta: {fecha_limite}

¿Te interesa conocer más detalles? 💬', true, NOW(), NOW()),

('Recordatorio Reunión', 'WHATSAPP', NULL,
'Hola {nombre}! 📅

Solo recordarte que tienes una reunión programada:
📆 Fecha: {fecha}
⏰ Hora: {hora}
📍 Ubicación: {ubicacion}

¿Está de acuerdo con estos detalles? ✅', true, NOW(), NOW()),

('Agradecimiento', 'WHATSAPP', NULL,
'Hola {nombre}! 👋

¡Gracias por ser parte de nuestro equipo! 
Valoramos tu confianza y apoyo. 🙏

¿Hay algo en lo que podamos ayudarte hoy? 💪', true, NOW(), NOW()),

('Confirmación de Compra', 'WHATSAPP', NULL,
'¡Hola {nombre}! 🎉

Tu pedido ha sido confirmado exitosamente ✅

📦 Pedido: {pedido}
💵 Total: {monto}
🚚 Entrega estimada: {fecha_entrega}

Tracking: {tracking}

¿Alguna pregunta? Estamos aquí para ayudarte 😊', true, NOW(), NOW());

-- ===============================================
-- SEGUIMIENTOS
-- ===============================================
INSERT INTO seguimientos (id, completado, fecha, tarea, contacto_id)
VALUES
(1, false, '2026-04-16', 'Llamar a Roberto Martínez - seguimiento primera conversación', 1),
(2, false, '2026-04-17', 'Enviar propuesta a Laura Fernández', 2),
(3, true, '2026-04-14', 'Confirmación de compra con David López', 3),
(4, false, '2026-04-18', 'Demostración de API a Patricia González', 4),
(5, false, '2026-04-19', 'Negociación de términos con Francisco Ruiz', 5);

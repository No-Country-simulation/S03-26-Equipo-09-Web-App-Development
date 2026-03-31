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

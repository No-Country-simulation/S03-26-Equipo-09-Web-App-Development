-- Usuarios
INSERT INTO usuarios (id, nombre, email, password, role, telefono, activo)
VALUES
(1, 'Admin User', 'admin@example.com', 'admin123', 'ADMIN', '555-0000', true),
(2, 'Juan Vendedor', 'juan.vendedor@example.com', 'juan123', 'VENDEDOR', '555-1111', true),
(3, 'María Vendedora', 'maria.vendedora@example.com', 'maria123', 'VENDEDOR', '555-2222', true),
(4, 'Carlos Vendedor', 'carlos.vendedor@example.com', 'carlos123', 'VENDEDOR', '555-3333', true);

-- Contactos
INSERT INTO contactos (id, nombre, email, telefono, estado)
VALUES
(1, 'Carlos Pérez', 'carlos.perez@example.com', '555-1234', 'LEAD_ACTIVO'),
(2, 'María López', 'maria.lopez@example.com', '555-5678', 'EN_SEGUIMIENTO'),
(3, 'Juan García', 'juan.garcia@example.com', '555-9012', 'CLIENTE');

-- Conversaciones (asignadas a vendedores)
INSERT INTO conversaciones (id, canal, contenido, fecha_hora, contacto_id, vendedor_asignado_id)
VALUES
(1, 'WhatsApp', 'Primera conversación con Carlos', '2026-03-20 10:00:00', 1, 2),
(2, 'Email', 'Propuesta enviada a María', '2026-03-21 15:30:00', 2, 3),
(3, 'WhatsApp', 'Confirmación de compra con Juan', '2026-03-22 14:00:00', 3, 4);

-- Seguimientos
INSERT INTO seguimientos (id, completado, fecha, tarea, contacto_id)
VALUES
(1, false, '2026-03-25', 'Llamar a Carlos para seguimiento', 1),
(2, false, '2026-03-28', 'Revisar propuesta enviada a María', 2),
(3, true, '2026-03-23', 'Confirmar entrega con Juan', 3);

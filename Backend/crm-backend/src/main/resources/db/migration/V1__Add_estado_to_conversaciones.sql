-- Flyway Migration: V1__Add_estado_to_conversaciones.sql
-- Agregar el campo 'estado' a la tabla 'conversaciones'

ALTER TABLE conversaciones
ADD COLUMN IF NOT EXISTS estado VARCHAR(20) DEFAULT 'NO_LEIDO' NOT NULL;

-- Crear índice para búsquedas rápidas por estado
CREATE INDEX IF NOT EXISTS idx_conversaciones_estado ON conversaciones(estado);

-- Crear índice compuesto para vendedor + estado (común en queries del Inbox)
CREATE INDEX IF NOT EXISTS idx_conversaciones_vendedor_estado 
    ON conversaciones(vendedor_asignado_id, estado);

-- Crear índice para búsquedas por canal
CREATE INDEX IF NOT EXISTS idx_conversaciones_canal ON conversaciones(canal);

COMMENT ON COLUMN conversaciones.estado IS 'Estado de la conversación: NO_LEIDO, LEIDO, RESPONDIDO, CERRADO, FALLIDO';

package com.startupcrm.crm_backend.model;

/**
 * Estados posibles de una conversación en el sistema.
 * 
 * FLUJO DE ESTADOS TÍPICO:
 * 1. Mensaje entrante → NO_LEIDO (PENDIENTE para frontend)
 * 2. Vendedor ve/lee → LEIDO (sigue siendo PENDIENTE para frontend)
 * 3. Vendedor responde → RESPONDIDO (respuesta enviada)
 * 4. Admin/Vendedor cierra → CERRADO (caso resuelto)
 * 5. Nuevo mensaje en CERRADO → vuelve a NO_LEIDO (PENDIENTE)
 * 
 * AUTOMATIZACIÓN:
 * - NO_LEIDO = PENDIENTE (estado mostrado al frontend)
 * - Mensaje externo en CERRADO → automático a NO_LEIDO
 * - Respuesta enviada → automático a RESPONDIDO
 * - Cierre → solo manual de RESPONDIDO a CERRADO
 * 
 * @author Backend Team
 * @version 2.0 - Flujo de Estados Omnicanal
 */
public enum EstadoConversacion {
    NO_LEIDO("No Leído"),
    LEIDO("Leído"),
    RESPONDIDO("Respondido"),
    CERRADO("Cerrado"),
    FALLIDO("Fallido");

    private final String descripcion;

    EstadoConversacion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getDescripcion() {
        return descripcion;
    }
}

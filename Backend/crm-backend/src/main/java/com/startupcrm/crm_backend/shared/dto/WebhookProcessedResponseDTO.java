package com.startupcrm.crm_backend.shared.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO de respuesta para confirmación de webhook procesado.
 * 
 * Incluye información del contacto y la conversación creada.
 * Enviado como JSON al webhook requester (para validación).
 * 
 * @author Backend Team
 * @version 1.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WebhookProcessedResponseDTO {

    /**
     * ID de la conversación creada en BD.
     * Usado para debugging y auditoría
     */
    private Long conversacionId;

    /**
     * ID del contacto asociado.
     */
    private Long contactoId;

    /**
     * Nombre del contacto (para validación rápida).
     */
    private String contactoNombre;

    /**
     * Canal del mensaje (WhatsApp | Email).
     */
    private String canal;

    /**
     * Estado del procesamiento.
     * Valores: SUCCESS, CONTACT_NOT_FOUND, ERROR
     */
    private String status; // SUCCESS | CONTACT_NOT_FOUND | ERROR

    /**
     * Mensaje descriptivo del resultado.
     */
    private String message;

    /**
     * Timestamp de procesamiento en el backend.
     */
    private LocalDateTime processedAt;

    /**
     * Vendedor asignado al contacto (si existe).
     */
    private String vendedorAsignadoNombre;

    /**
     * Trace ID para debugging distribuido.
     */
    private String traceId;

    /**
     * Factory method para éxito
     */
    public static WebhookProcessedResponseDTO success(
            Long conversacionId, Long contactoId, String contactoNombre, 
            String canal, String vendedorNombre, String traceId) {
        return WebhookProcessedResponseDTO.builder()
                .conversacionId(conversacionId)
                .contactoId(contactoId)
                .contactoNombre(contactoNombre)
                .canal(canal)
                .status("SUCCESS")
                .message("Mensaje procesado y almacenado correctamente")
                .processedAt(LocalDateTime.now())
                .vendedorAsignadoNombre(vendedorNombre)
                .traceId(traceId)
                .build();
    }

    /**
     * Factory method para contacto no encontrado
     */
    public static WebhookProcessedResponseDTO contactNotFound(String telefono, String traceId) {
        return WebhookProcessedResponseDTO.builder()
                .status("CONTACT_NOT_FOUND")
                .message("No se encontró contacto con teléfono: " + telefono)
                .processedAt(LocalDateTime.now())
                .traceId(traceId)
                .build();
    }

    /**
     * Factory method para error
     */
    public static WebhookProcessedResponseDTO error(String errorMessage, String traceId) {
        return WebhookProcessedResponseDTO.builder()
                .status("ERROR")
                .message(errorMessage)
                .processedAt(LocalDateTime.now())
                .traceId(traceId)
                .build();
    }
}

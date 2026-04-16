package com.startupcrm.crm_backend.shared.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para recibir mensajes de Email vía Brevo webhook (SendGrid alternativa).
 * 
 * Consumo: application/json
 * Formato: Email estándar con campos mínimos
 * 
 * @author Backend Team
 * @version 1.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmailWebhookDTO {

    /**
     * Remitente del email (dirección completa).
     * Ejemplo: "cliente@example.com"
     */
    @NotBlank(message = "El email del remitente es obligatorio")
    @Email(message = "Formato de email inválido")
    private String from;

    /**
     * Receptor del email (nuestra bandeja).
     * Ejemplo: "soporte@crm.example.com"
     * Opcional: se valida pero puede no estar presente
     */
    @Email(message = "Formato de email receptor inválido (si está presente)")
    private String to;

    /**
     * Asunto del email.
     * Ejemplo: "Consulta sobre servicios de CRM"
     */
    @NotBlank(message = "El asunto es obligatorio")
    private String subject;

    /**
     * Cuerpo del email (texto plano).
     * Se guardaría en campo 'contenido' de conversación
     */
    @NotBlank(message = "El cuerpo del email es obligatorio")
    private String text;

    /**
     * Email del remitente alternativo (Reply-To).
     * Opcional: si existe, usar como contacto alterno
     */
    private String replyTo;

    /**
     * ID externo del email para auditoría (Brevo/SendGrid).
     * Ejemplo: "sg-1234567890"
     */
    private String externalId;

    /**
     * Timestamp ISO-8601 del email.
     * Ejemplo: "2026-04-14T14:30:00Z"
     */
    private String timestamp;

    /**
     * Log para debugging
     */
    @Override
    public String toString() {
        return String.format(
            "EmailWebhook {from: %s, subject: %s, bodyLength: %d}",
            from, subject, text.length()
        );
    }
}

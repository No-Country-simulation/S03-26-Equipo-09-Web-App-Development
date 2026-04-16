package com.startupcrm.crm_backend.shared.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para recibir mensajes de WhatsApp vía Twilio webhook.
 * 
 * Consumo: application/x-www-form-urlencoded
 * Formato: Twilio WhatsApp Cloud API standard
 * 
 * @author Backend Team
 * @version 1.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WhatsAppWebhookDTO {

    /**
     * Contenido del mensaje enviado por el usuario.
     * Ejemplo: "Hola, quiero información sobre los servicios"
     */
    @NotBlank(message = "El contenido del mensaje es obligatorio")
    private String body;

    /**
     * Número de teléfono del remitente (formato internacional).
     * Ejemplo: "+34 600 123 456" o "34600123456"
     * Parser debe normalizar a formato de búsqueda en BD
     */
    @NotBlank(message = "El número de teléfono es obligatorio")
    private String from;

    /**
     * ID único del mensaje desde Twilio (para idempotencia).
     * Ejemplo: "wamid.HBEUGVhlMzYzYjM5ZTA="
     */
    @JsonProperty("MessageSid")
    private String messageSid;

    /**
     * Timestamp UTC cuando Twilio recibió el mensaje.
     * Formato: epoch unix timestamp en segundos
     */
    @JsonProperty("Timestamp")
    private String timestamp;

    /**
     * ID de la cuenta Twilio remitente.
     * Opcional: para auditoría y validación
     */
    @JsonProperty("AccountSid")
    private String accountSid;

    /**
     * Número de la línea WhatsApp (el nuestro - receptor).
     * Ejemplo: "+34 666 777 888"
     */
    @JsonProperty("To")
    private String to;

    /**
     * Log para debugging
     */
    @Override
    public String toString() {
        return String.format(
            "WhatsAppWebhook {from: %s, body: %s (length: %d), msgId: %s}",
            from, body.substring(0, Math.min(50, body.length())), body.length(), messageSid
        );
    }
}

package com.startupcrm.crm_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.NotBlank;

/**
 * DTO para enviar mensajes por WhatsApp
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class WhatsAppMessageDTO {
    
    @NotBlank(message = "El número de teléfono es requerido")
    private String phoneNumber;
    
    @NotBlank(message = "El mensaje es requerido")
    private String message;
    
    // Opcional: tipo de mensaje (text, template, etc.)
    private String messageType = "text";
    
    // Opcional: ID de la plantilla (si es template)
    private String templateId;
    
    // Opcional: parámetros para plantillas
    private java.util.Map<String, String> parameters;
}

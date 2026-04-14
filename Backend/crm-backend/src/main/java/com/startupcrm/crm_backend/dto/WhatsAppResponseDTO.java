package com.startupcrm.crm_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * DTO para respuestas de WhatsApp Cloud API
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class WhatsAppResponseDTO {
    
    @JsonProperty("messaging_product")
    private String messagingProduct;
    
    private java.util.Map<String, Object> messages;
    
    private java.util.Map<String, Object> contacts;
    
    private String error;
    
    private String messageId;
}

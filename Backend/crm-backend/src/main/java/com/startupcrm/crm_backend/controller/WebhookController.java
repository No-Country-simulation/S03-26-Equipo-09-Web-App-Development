package com.startupcrm.crm_backend.controller;

import com.startupcrm.crm_backend.service.InteractionService;
import com.startupcrm.crm_backend.shared.dto.EmailWebhookDTO;
import com.startupcrm.crm_backend.shared.dto.WebhookProcessedResponseDTO;
import com.startupcrm.crm_backend.shared.dto.WhatsAppWebhookDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controlador REST para procesar webhooks omnicanales.
 * 
 * Recibe eventos de:
 * - Twilio WhatsApp Cloud API
 * - Brevo / SendGrid Email API
 * 
 * Endpoints expuestos SIN autenticación (webhooks típicamente no usan auth).
 * Validar request signature en producción (Twilio signature validation).
 * 
 * @author Backend Team
 * @version 1.0
 */
@RestController
@RequestMapping("/api/conversaciones/webhook")
@RequiredArgsConstructor
@Slf4j
public class WebhookController {

    private final InteractionService interactionService;

    /**
     * Endpoint para recibir mensajes de WhatsApp vía Twilio.
     * 
     * Consumo: application/x-www-form-urlencoded
     * Validación: Twilio valida con firma en X-Twilio-Signature (implementar en producción)
     * 
     * Flujo:
     * 1. Recibir WebhookDTO con datos del mensaje
     * 2. Validar que contiene campos obligatorios (@Valid)
     * 3. Pasar a InteractionService para lógica de negocio
     * 4. Retornar confirmación con detalles del contacto
     * 
     * Ejemplo de consumo con curl:
     * {@code
     * curl -X POST http://localhost:8080/api/conversaciones/webhook/whatsapp \
     *   -d "Body=Hola%20CRM&From=%2B34600123456&MessageSid=wamid123"
     * }
     * 
     * @param webhook DTO con datos de Twilio (validado automáticamente)
     * @return 200 OK con respuesta del procesamiento
     */
    @PostMapping("/whatsapp")
    public ResponseEntity<WebhookProcessedResponseDTO> receiveWhatsAppMessage(
            @Valid WhatsAppWebhookDTO webhook) {

        log.info("📱 Webhook WhatsApp recibido: from={}, msgLength={}", 
                webhook.getFrom(), webhook.getBody().length());

        // Procesar mensaje a través del servicio de dominio
        WebhookProcessedResponseDTO response = interactionService.processWhatsAppMessage(webhook);

        // Retornar respuesta (200 OK incluso si contacto no existe, para no bloquear Twilio)
        if ("SUCCESS".equals(response.getStatus())) {
            log.info("✅ WhatsApp procesado exitosamente: conversación ID {}", 
                    response.getConversacionId());
            return ResponseEntity.ok(response);
        } else if ("CONTACT_NOT_FOUND".equals(response.getStatus())) {
            // 404: Contacto no existe
            log.warn("⚠️  Contacto no encontrado: {}", response.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        } else {
            // 500: Error en procesamiento
            log.error("❌ Error procesando WhatsApp: {}", response.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Endpoint para recibir mensajes de Email vía Brevo/SendGrid.
     * 
     * Consumo: application/json
     * Validación: Brevo/SendGrid envía con API key authentication (configurar en producción)
     * 
     * Flujo:
     * 1. Recibir EmailWebhookDTO con datos del email
     * 2. Validar que contiene campos obligatorios (@Valid)
     * 3. Pasar a InteractionService para lógica de negocio
     * 4. Retornar confirmación con detalles del contacto
     * 
     * Ejemplo de consumo con curl (JSON):
     * {@code
     * curl -X POST http://localhost:8080/api/conversaciones/webhook/email \
     *   -H "Content-Type: application/json" \
     *   -d '{
     *     "from": "cliente@example.com",
     *     "subject": "Consulta sobre servicios",
     *     "text": "Quisiera saber más sobre..."
     *   }'
     * }
     * 
     * @param webhook DTO con datos del email (validado automáticamente)
     * @return 200 OK con respuesta del procesamiento
     */
    @PostMapping("/email")
    public ResponseEntity<WebhookProcessedResponseDTO> receiveEmailMessage(
            @Valid @RequestBody EmailWebhookDTO webhook) {

        log.info("📧 Webhook Email recibido: from={}, subject={}", 
                webhook.getFrom(), webhook.getSubject());

        // Procesar mensaje a través del servicio de dominio
        WebhookProcessedResponseDTO response = interactionService.processEmailMessage(webhook);

        // Retornar respuesta (200 OK incluso si contacto no existe)
        if ("SUCCESS".equals(response.getStatus())) {
            log.info("✅ Email procesado exitosamente: conversación ID {}", 
                    response.getConversacionId());
            return ResponseEntity.ok(response);
        } else if ("CONTACT_NOT_FOUND".equals(response.getStatus())) {
            // 404: Contacto no existe
            log.warn("⚠️  Contacto no encontrado: {}", response.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        } else {
            // 500: Error en procesamiento
            log.error("❌ Error procesando Email: {}", response.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Endpoint de health check para webhooks.
     * Usado por Postman/herramientas para verificar que el endpoint está disponible.
     * 
     * @return 200 OK con mensaje de confirmación
     */
    @GetMapping("/health")
    public ResponseEntity<String> webhookHealth() {
        return ResponseEntity.ok("✅ Webhook server is running and ready to receive messages");
    }
}

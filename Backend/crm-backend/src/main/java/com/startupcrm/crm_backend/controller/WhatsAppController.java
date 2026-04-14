package com.startupcrm.crm_backend.controller;

import com.startupcrm.crm_backend.dto.ApiResponse;
import com.startupcrm.crm_backend.dto.WhatsAppMessageDTO;
import com.startupcrm.crm_backend.service.WhatsAppService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Map;

/**
 * Controlador para endpoints de WhatsApp
 * Permite enviar y recibir mensajes de WhatsApp a través de Cloud API
 */
@RestController
@RequestMapping("/api/whatsapp")
public class WhatsAppController {

    private static final Logger logger = LoggerFactory.getLogger(WhatsAppController.class);

    @Autowired
    private WhatsAppService whatsAppService;

    /**
     * Enviar mensaje simple por WhatsApp
     * POST /api/whatsapp/enviar
     *
     * @param dto Contiene phoneNumber y message
     */
    @PostMapping("/enviar")
    public ApiResponse<Map<String, Object>> enviarMensaje(@Valid @RequestBody WhatsAppMessageDTO dto) {
        logger.info("Enviando mensaje WhatsApp a: {}", dto.getPhoneNumber());

        Map<String, Object> resultado = whatsAppService.enviarMensaje(dto.getPhoneNumber(), dto.getMessage());

        boolean success = (boolean) resultado.getOrDefault("success", false);
        return new ApiResponse<>(success, resultado, success ? null : (String) resultado.get("error"));
    }

    /**
     * Enviar mensaje y registrar en conversaciones
     * POST /api/whatsapp/enviar-registrar/{contactoId}
     *
     * @param contactoId ID del contacto
     * @param mensaje Contenido del mensaje
     */
    @PostMapping("/enviar-registrar/{contactoId}")
    public ApiResponse<Map<String, Object>> enviarMensajeYRegistrar(
            @PathVariable Long contactoId,
            @RequestParam String mensaje) {
        logger.info("Enviando y registrando mensaje WhatsApp para contacto: {}", contactoId);

        Map<String, Object> resultado = whatsAppService.enviarMensajeYRegistrar(contactoId, mensaje);

        boolean success = (boolean) resultado.getOrDefault("success", false);
        return new ApiResponse<>(success, resultado, success ? null : (String) resultado.get("error"));
    }

    /**
     * Enviar mensaje usando plantilla
     * POST /api/whatsapp/enviar-template
     *
     * @param phoneNumber Número de teléfono
     * @param templateName Nombre de la plantilla
     * @param parameters Parámetros para la plantilla
     */
    @PostMapping("/enviar-template")
    public ApiResponse<Map<String, Object>> enviarTemplate(
            @RequestParam String phoneNumber,
            @RequestParam String templateName,
            @RequestParam(required = false) java.util.List<String> parameters) {
        logger.info("Enviando template '{}' a: {}", templateName, phoneNumber);

        Map<String, Object> resultado = whatsAppService.enviarMensajeTemplate(phoneNumber, templateName, parameters);

        boolean success = (boolean) resultado.getOrDefault("success", false);
        return new ApiResponse<>(success, resultado, success ? null : (String) resultado.get("error"));
    }

    /**
     * Webhook para recibir mensajes de WhatsApp
     * POST /api/whatsapp/webhook
     *
     * Meta enviará los mensajes recibidos a este endpoint
     */
    @PostMapping("/webhook")
    public ResponseEntity<String> webhook(@RequestBody Map<String, Object> payload) {
        logger.info("Webhook de WhatsApp recibido");

        whatsAppService.procesarWebhook(payload);

        // Retornar 200 OK para confirmar recepción
        return ResponseEntity.ok("EVENT_RECEIVED");
    }

    /**
     * Verificar webhook token (requerido por Meta)
     * GET /api/whatsapp/webhook
     *
     * Meta utiliza este endpoint para verificar que el webhook es válido
     */
    @GetMapping("/webhook")
    public ResponseEntity<String> verificarWebhook(
            @RequestParam(name = "hub.mode", required = false) String mode,
            @RequestParam(name = "hub.challenge", required = false) String challenge,
            @RequestParam(name = "hub.verify_token", required = false) String token) {
        logger.info("Verificando webhook token de WhatsApp");

        // Token que debe coincidir con el configurado en Meta
        String expectedToken = "tu_token_secreto_aqui";

        if ("subscribe".equals(mode) && expectedToken.equals(token)) {
            logger.info("Webhook verificado exitosamente");
            return ResponseEntity.ok(challenge);
        } else {
            logger.warn("Validación de webhook fallida");
            return ResponseEntity.status(403).body("Invalid token");
        }
    }

    /**
     * Endpoint para obtener estado de la integración
     * GET /api/whatsapp/status
     */
    @GetMapping("/status")
    public ApiResponse<Map<String, String>> obtenerStatus() {
        Map<String, String> status = new java.util.HashMap<>();
        status.put("integracion", "WhatsApp Cloud API");
        status.put("version", "v18.0");
        status.put("estado", "activo");
        status.put("descripcion", "Integración con Meta WhatsApp Business API");

        return new ApiResponse<>(true, status, null);
    }
}

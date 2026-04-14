package com.startupcrm.crm_backend.service;

import com.startupcrm.crm_backend.dto.WhatsAppMessageDTO;
import com.startupcrm.crm_backend.model.Contacto;
import com.startupcrm.crm_backend.model.Conversacion;
import com.startupcrm.crm_backend.repository.ContactoRepository;
import com.startupcrm.crm_backend.repository.ConversacionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Servicio para integración con WhatsApp Cloud API (Meta)
 * Permite enviar y recibir mensajes de WhatsApp
 */
@Service
public class WhatsAppService {

    private static final Logger logger = LoggerFactory.getLogger(WhatsAppService.class);
    private static final String WHATSAPP_API_URL = "https://graph.instagram.com/v18.0";

    @Value("${whatsapp.phone-number-id:}")
    private String phoneNumberId;

    @Value("${whatsapp.business-account-id:}")
    private String businessAccountId;

    @Value("${whatsapp.access-token:}")
    private String accessToken;

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private ContactoRepository contactoRepository;

    @Autowired
    private ConversacionRepository conversacionRepository;

    /**
     * Enviar mensaje de texto por WhatsApp
     * @param phoneNumber Número de teléfono del destinatario (formato: +34612345678)
     * @param message Contenido del mensaje
     * @return Map con el ID del mensaje o error
     */
    public Map<String, Object> enviarMensaje(String phoneNumber, String message) {
        Map<String, Object> response = new HashMap<>();

        try {
            // Validar credenciales
            if (!credencialesConfiguradasCorrectamente()) {
                response.put("success", false);
                response.put("error", "Credenciales de WhatsApp no configuradas. Configure las siguientes variables: whatsapp.phone-number-id, whatsapp.business-account-id, whatsapp.access-token");
                logger.warn("Envío de WhatsApp: Credenciales no configuradas");
                return response;
            }

            // Preparar payload
            Map<String, Object> payload = construirPayloadMensajeTexto(phoneNumber, message);

            // Hacer llamada a API
            String url = String.format("%s/%s/messages", WHATSAPP_API_URL, phoneNumberId);
            HttpHeaders headers = construirHeaders();
            HttpEntity<String> entity = new HttpEntity<>(objectMapper.writeValueAsString(payload), headers);

            Map<String, Object> apiResponse = restTemplate.postForObject(url, entity, Map.class);

            if (apiResponse != null && apiResponse.containsKey("messages")) {
                response.put("success", true);
                response.put("messageId", ((java.util.List<?>) apiResponse.get("messages")).get(0));
                logger.info("Mensaje WhatsApp enviado exitosamente a: {}", phoneNumber);
            } else {
                response.put("success", false);
                response.put("error", apiResponse != null ? apiResponse.toString() : "Error desconocido");
                logger.error("Error enviando mensaje WhatsApp a {}: {}", phoneNumber, apiResponse);
            }

            return response;

        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());
            logger.error("Excepción al enviar mensaje WhatsApp a {}: {}", phoneNumber, e.getMessage());
            return response;
        }
    }

    /**
     * Enviar mensaje de WhatsApp y registrarlo en conversaciones
     */
    public Map<String, Object> enviarMensajeYRegistrar(Long contactoId, String message) {
        Map<String, Object> response = new HashMap<>();

        try {
            // Obtener contacto
            Contacto contacto = contactoRepository.findById(contactoId)
                    .orElseThrow(() -> new RuntimeException("Contacto no encontrado"));

            // Enviar mensaje
            Map<String, Object> resultadoEnvio = enviarMensaje(contacto.getTelefono(), message);

            if ((boolean) resultadoEnvio.get("success")) {
                // Registrar en conversaciones
                Conversacion conversacion = new Conversacion();
                conversacion.setCanal("WhatsApp");
                conversacion.setContenido(message);
                conversacion.setFechaHora(LocalDateTime.now());
                conversacion.setContacto(contacto);

                conversacionRepository.save(conversacion);

                response.put("success", true);
                response.put("messageId", resultadoEnvio.get("messageId"));
                response.put("conversacionRegistrada", true);
                logger.info("Mensaje WhatsApp registrado en conversaciones para contacto: {}", contacto.getNombre());
            } else {
                response.put("success", false);
                response.put("error", resultadoEnvio.get("error"));
            }

            return response;

        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());
            logger.error("Error: {}", e.getMessage());
            return response;
        }
    }

    /**
     * Enviar mensaje usando una plantilla
     * @param phoneNumber Número de teléfono
     * @param templateName Nombre de la plantilla en WhatsApp
     * @param parameters Parámetros para la plantilla
     */
    public Map<String, Object> enviarMensajeTemplate(String phoneNumber, String templateName, 
                                                     java.util.List<String> parameters) {
        Map<String, Object> response = new HashMap<>();

        try {
            if (!credencialesConfiguradasCorrectamente()) {
                response.put("success", false);
                response.put("error", "Credenciales no configuradas");
                return response;
            }

            Map<String, Object> payload = construirPayloadTemplate(phoneNumber, templateName, parameters);

            String url = String.format("%s/%s/messages", WHATSAPP_API_URL, phoneNumberId);
            HttpHeaders headers = construirHeaders();
            HttpEntity<String> entity = new HttpEntity<>(objectMapper.writeValueAsString(payload), headers);

            Map<String, Object> apiResponse = restTemplate.postForObject(url, entity, Map.class);

            if (apiResponse != null && apiResponse.containsKey("messages")) {
                response.put("success", true);
                response.put("messageId", ((java.util.List<?>) apiResponse.get("messages")).get(0));
                logger.info("Mensaje template WhatsApp enviado a: {}", phoneNumber);
            } else {
                response.put("success", false);
                response.put("error", apiResponse != null ? apiResponse.toString() : "Error desconocido");
            }

            return response;

        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());
            logger.error("Error enviando template: {}", e.getMessage());
            return response;
        }
    }

    /**
     * Procesar webhook de WhatsApp (mensaje recibido)
     */
    public void procesarWebhook(Map<String, Object> payload) {
        try {
            logger.info("Webhook de WhatsApp recibido: {}", payload);

            // Extraer información del webhook
            Map<String, Object> entry = (Map<String, Object>) ((java.util.List<?>) payload.get("entry")).get(0);
            java.util.List<?> changes = (java.util.List<?>) entry.get("changes");
            
            for (Object changeObj : changes) {
                Map<String, Object> change = (Map<String, Object>) changeObj;
                Map<String, Object> value = (Map<String, Object>) change.get("value");
                java.util.List<?> messages = (java.util.List<?>) value.get("messages");

                if (messages != null) {
                    for (Object msgObj : messages) {
                        Map<String, Object> message = (Map<String, Object>) msgObj;
                        procesarMensajeRecibido(message);
                    }
                }
            }

        } catch (Exception e) {
            logger.error("Error procesando webhook de WhatsApp: {}", e.getMessage());
        }
    }

    /**
     * Procesar un mensaje recibido
     */
    private void procesarMensajeRecibido(Map<String, Object> message) {
        try {
            String fromNumber = (String) message.get("from");
            String messageId = (String) message.get("id");
            
            Map<String, Object> text = (Map<String, Object>) message.get("text");
            String contenido = text != null ? (String) text.get("body") : "Mensaje no textual";

            logger.info("Mensaje recibido de WhatsApp - Número: {}, Contenido: {}", fromNumber, contenido);

            // Buscar o crear contacto
            Contacto contacto = contactoRepository.findByEmail(fromNumber);
            if (contacto == null) {
                // Crear nuevo contacto si no existe
                contacto = new Contacto();
                contacto.setTelefono(fromNumber);
                contacto.setNombre("WhatsApp " + fromNumber);
                contacto.setEmail(fromNumber + "@whatsapp");
                contactoRepository.save(contacto);
                logger.info("Nuevo contacto creado desde WhatsApp: {}", fromNumber);
            }

            // Registrar conversación
            Conversacion conversacion = new Conversacion();
            conversacion.setCanal("WhatsApp");
            conversacion.setContenido(contenido);
            conversacion.setFechaHora(LocalDateTime.now());
            conversacion.setContacto(contacto);
            conversacionRepository.save(conversacion);

            logger.info("Conversación de WhatsApp registrada para: {}", contacto.getNombre());

        } catch (Exception e) {
            logger.error("Error procesando mensaje recibido: {}", e.getMessage());
        }
    }

    // ========== MÉTODOS AUXILIARES ==========

    /**
     * Verificar si las credenciales están configuradas
     */
    private boolean credencialesConfiguradasCorrectamente() {
        return phoneNumberId != null && !phoneNumberId.isEmpty() &&
               businessAccountId != null && !businessAccountId.isEmpty() &&
               accessToken != null && !accessToken.isEmpty();
    }

    /**
     * Construir payload para mensaje de texto
     */
    private Map<String, Object> construirPayloadMensajeTexto(String phoneNumber, String message) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("messaging_product", "whatsapp");
        payload.put("recipient_type", "individual");
        payload.put("to", phoneNumber);
        payload.put("type", "text");

        Map<String, Object> text = new HashMap<>();
        text.put("body", message);
        payload.put("text", text);

        return payload;
    }

    /**
     * Construir payload para mensaje con plantilla
     */
    private Map<String, Object> construirPayloadTemplate(String phoneNumber, String templateName, 
                                                         java.util.List<String> parameters) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("messaging_product", "whatsapp");
        payload.put("to", phoneNumber);
        payload.put("type", "template");

        Map<String, Object> template = new HashMap<>();
        template.put("name", templateName);

        if (parameters != null && !parameters.isEmpty()) {
            Map<String, Object> body = new HashMap<>();
            body.put("parameters", parameters.stream()
                    .map(p -> Map.of("type", "text", "text", p))
                    .toList());
            template.put("components", java.util.List.of(Map.of("type", "body", "parameters", parameters)));
        }

        payload.put("template", template);

        return payload;
    }

    /**
     * Construir headers HTTP
     */
    private HttpHeaders construirHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + accessToken);
        return headers;
    }
}

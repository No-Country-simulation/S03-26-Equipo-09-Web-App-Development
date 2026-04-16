package com.startupcrm.crm_backend.service;

import com.startupcrm.crm_backend.model.Contacto;
import com.startupcrm.crm_backend.model.Conversacion;
import com.startupcrm.crm_backend.repository.ContactoRepository;
import com.startupcrm.crm_backend.repository.ConversacionRepository;
import com.startupcrm.crm_backend.shared.dto.EmailWebhookDTO;
import com.startupcrm.crm_backend.shared.dto.WebhookProcessedResponseDTO;
import com.startupcrm.crm_backend.shared.dto.WhatsAppWebhookDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.UUID;
import java.util.regex.Pattern;

/**
 * Servicio de dominio para procesar interacciones omnicanal (WhatsApp + Email).
 * 
 * Encapsula la lógica de negocio:
 * - Mapeo de números telefónicos
 * - Búsqueda de contactos
 * - Creación de conversaciones
 * - Alineación con frontend (vendedorAsignadoNombre)
 * 
 * @author Backend Team
 * @version 1.0
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class InteractionService {

    private final ContactoRepository contactoRepository;
    private final ConversacionRepository conversacionRepository;

    /**
     * Procesa un mensaje de WhatsApp entrante.
     * 
     * Flujo:
     * 1. Parsear número de teléfono (normalizar formato)
     * 2. Buscar contacto por teléfono en BD
     * 3. Si existe: crear Conversacion
     * 4. Retornar respuesta con datos del contacto
     * 
     * @param webhook DTO del webhook de Twilio
     * @return Response con status y detalles de la conversación creada
     */
    public WebhookProcessedResponseDTO processWhatsAppMessage(WhatsAppWebhookDTO webhook) {
        String traceId = UUID.randomUUID().toString();
        String logPrefix = "[WhatsApp-" + traceId + "]";

        try {
            log.info("{} Procesando mensaje: {}", logPrefix, webhook);

            // 1. Normalizar número de teléfono
            String normalizedPhone = normalizePhoneNumber(webhook.getFrom());
            log.debug("{} Teléfono normalizado: {} → {}", logPrefix, webhook.getFrom(), normalizedPhone);

            // 2. Buscar contacto por teléfono
            Contacto contacto = contactoRepository.findByTelefono(normalizedPhone)
                    .orElse(null);

            if (contacto == null) {
                String notFoundMsg = String.format(
                    "Contacto no encontrado con teléfono %s. Webhook ignorado.",
                    normalizedPhone
                );
                log.warn("{} {}", logPrefix, notFoundMsg);
                return WebhookProcessedResponseDTO.contactNotFound(normalizedPhone, traceId);
            }

            log.info("{} Contacto encontrado: {} (ID: {})", logPrefix, contacto.getNombre(), contacto.getId());

            // 3. Crear conversación
            Conversacion conversacion = createConversation(
                contacto,
                webhook.getBody(),
                "WhatsApp",
                webhook.getMessageSid()
            );

            log.info("{} Conversación creada: ID {}", logPrefix, conversacion.getId());

            // 4. Retornar respuesta con éxito
            String vendedorNombre = contacto.getVendedorAsignado() != null
                    ? contacto.getVendedorAsignado().getNombre()
                    : null;

            return WebhookProcessedResponseDTO.success(
                conversacion.getId(),
                contacto.getId(),
                contacto.getNombre(),
                "WhatsApp",
                vendedorNombre,
                traceId
            );

        } catch (Exception e) {
            String errorMsg = String.format("Error procesando WhatsApp: %s", e.getMessage());
            log.error("{} {}", logPrefix, errorMsg, e);
            return WebhookProcessedResponseDTO.error(errorMsg, traceId);
        }
    }

    /**
     * Procesa un mensaje de Email entrante.
     * 
     * Flujo:
     * 1. Parsear email del remitente
     * 2. Buscar contacto por email
     * 3. Si existe: crear Conversacion con subject + text
     * 4. Retornar respuesta con datos del contacto
     * 
     * @param webhook DTO del webhook de Brevo/SendGrid
     * @return Response con status y detalles de la conversación creada
     */
    public WebhookProcessedResponseDTO processEmailMessage(EmailWebhookDTO webhook) {
        String traceId = UUID.randomUUID().toString();
        String logPrefix = "[Email-" + traceId + "]";

        try {
            log.info("{} Procesando email: {}", logPrefix, webhook);

            // 1. Normalizar email del remitente
            String normalizedEmail = webhook.getFrom().toLowerCase().trim();
            log.debug("{} Email normalizado: {}", logPrefix, normalizedEmail);

            // 2. Buscar contacto por email
            Contacto contacto = contactoRepository.findByEmail(normalizedEmail)
                    .orElse(null);

            if (contacto == null) {
                String notFoundMsg = String.format(
                    "Contacto no encontrado con email %s. Webhook ignorado.",
                    normalizedEmail
                );
                log.warn("{} {}", logPrefix, notFoundMsg);
                return WebhookProcessedResponseDTO.contactNotFound(normalizedEmail, traceId);
            }

            log.info("{} Contacto encontrado: {} (ID: {})", logPrefix, contacto.getNombre(), contacto.getId());

            // 3. Crear conversación (combinando asunto + texto)
            String contenidoCombinado = formatEmailContent(webhook.getSubject(), webhook.getText());
            Conversacion conversacion = createConversation(
                contacto,
                contenidoCombinado,
                "Email",
                webhook.getExternalId()
            );

            log.info("{} Conversación creada: ID {}", logPrefix, conversacion.getId());

            // 4. Retornar respuesta con éxito
            String vendedorNombre = contacto.getVendedorAsignado() != null
                    ? contacto.getVendedorAsignado().getNombre()
                    : null;

            return WebhookProcessedResponseDTO.success(
                conversacion.getId(),
                contacto.getId(),
                contacto.getNombre(),
                "Email",
                vendedorNombre,
                traceId
            );

        } catch (Exception e) {
            String errorMsg = String.format("Error procesando Email: %s", e.getMessage());
            log.error("{} {}", logPrefix, errorMsg, e);
            return WebhookProcessedResponseDTO.error(errorMsg, traceId);
        }
    }

    /**
     * Crea una nueva conversación en la BD.
     * 
     * @param contacto Contacto dueño del mensaje
     * @param contenido Texto del mensaje
     * @param canal WhatsApp | Email
     * @param externalId ID externo para auditoría (opcional)
     * @return Conversación persistida
     */
    private Conversacion createConversation(Contacto contacto, String contenido, 
                                            String canal, String externalId) {
        Conversacion conversacion = Conversacion.builder()
                .contacto(contacto)
                .contenido(contenido)
                .canal(canal)
                .fechaHora(LocalDateTime.now())
                .vendedorAsignado(contacto.getVendedorAsignado()) // Hereda asignación del contacto
                .build();

        Conversacion saved = conversacionRepository.save(conversacion);
        log.debug("Conversación guardada: {} en la BD", saved.getId());
        return saved;
    }

    /**
     * Normaliza un número de teléfono para búsqueda.
     * 
     * Soporta formatos:
     * - +34 600 123 456
     * - 34600123456
     * - +34600123456
     * - 600123456 (asume código de país +34)
     * 
     * @param phone Número de teléfono a normalizar
     * @return Número normalizado para búsqueda (Ej: "+34 600 123 456")
     */
    private String normalizePhoneNumber(String phone) {
        // Remover espacios y caracteres especiales
        String cleaned = phone.replaceAll("[^0-9+]", "");

        // Si no comienza con +, agregar +34 (España)
        if (!cleaned.startsWith("+")) {
            if (cleaned.startsWith("34")) {
                cleaned = "+" + cleaned;
            } else {
                cleaned = "+34" + cleaned;
            }
        }

        // Formatear con espacios: +34 600 123 456
        String formatted = cleaned.replaceAll("(\\+\\d{2})(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3 $4");

        return formatted;
    }

    /**
     * Formatea contenido de email combinando asunto y cuerpo.
     * Usado en las interacciones para mantener contexto completo.
     * 
     * @param subject Asunto del email
     * @param text Cuerpo del email
     * @return Contenido formateado
     */
    private String formatEmailContent(String subject, String text) {
        return String.format(
            "[ASUNTO: %s]\n\n%s",
            subject, text
        );
    }

    /**
     * Convierte timestamp Twilio (epoch segundos) a LocalDateTime.
     * 
     * @param epochSeconds Timestamp en segundos
     * @return LocalDateTime
     */
    private LocalDateTime convertTwilioTimestamp(String epochSeconds) {
        if (epochSeconds == null || epochSeconds.isBlank()) {
            return LocalDateTime.now();
        }
        try {
            long millis = Long.parseLong(epochSeconds) * 1000;
            return LocalDateTime.ofInstant(
                Instant.ofEpochMilli(millis),
                ZoneId.systemDefault()
            );
        } catch (NumberFormatException e) {
            log.warn("No se pudo parsear timestamp Twilio: {}", epochSeconds);
            return LocalDateTime.now();
        }
    }
}

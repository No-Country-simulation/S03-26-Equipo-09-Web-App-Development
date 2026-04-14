package com.startupcrm.crm_backend.service;

import com.startupcrm.crm_backend.model.Contacto;
import com.startupcrm.crm_backend.model.Conversacion;
import com.startupcrm.crm_backend.repository.ConversacionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.from:noreply@crm.com}")
    private String from;

    @Autowired
    private ConversacionRepository conversacionRepository;

    /**
     * Enviar email simple
     * @param destinatario Email del destinatario
     * @param asunto Asunto del email
     * @param contenido Contenido del email
     */
    public void enviarEmail(String destinatario, String asunto, String contenido) {
        try {
            SimpleMailMessage mensaje = new SimpleMailMessage();
            mensaje.setFrom(from);
            mensaje.setTo(destinatario);
            mensaje.setSubject(asunto);
            mensaje.setText(contenido);
            
            mailSender.send(mensaje);
            logger.info("Email enviado exitosamente a: {}", destinatario);
        } catch (Exception e) {
            logger.error("Error al enviar email a {}: {}", destinatario, e.getMessage());
            throw new RuntimeException("Error al enviar email: " + e.getMessage());
        }
    }

    /**
     * Enviar email y registrar en conversaciones
     * @param contacto Contacto al que enviar
     * @param asunto Asunto del email
     * @param contenido Contenido del email
     */
    public void enviarEmailYRegistrar(Contacto contacto, String asunto, String contenido) {
        // Enviar email
        enviarEmail(contacto.getEmail(), asunto, contenido);
        
        // Registrar en conversaciones
        Conversacion conversacion = new Conversacion();
        conversacion.setCanal("Email");
        conversacion.setContenido(contenido);
        conversacion.setFechaHora(LocalDateTime.now());
        conversacion.setContacto(contacto);
        
        conversacionRepository.save(conversacion);
        logger.info("Conversación de email registrada para contacto: {}", contacto.getNombre());
    }

    /**
     * Enviar email con plantilla
     * @param destinatario Email del destinatario
     * @param asunto Asunto del email
     * @param plantilla Nombre de la plantilla a usar
     * @param variables Variables para la plantilla
     */
    public void enviarEmailConPlantilla(String destinatario, String asunto, String plantilla, java.util.Map<String, String> variables) {
        String contenido = procesarPlantilla(plantilla, variables);
        enviarEmail(destinatario, asunto, contenido);
    }

    /**
     * Procesar plantillas de email
     */
    private String procesarPlantilla(String plantilla, java.util.Map<String, String> variables) {
        String contenido = plantilla;
        if (variables != null) {
            for (java.util.Map.Entry<String, String> entry : variables.entrySet()) {
                contenido = contenido.replace("${" + entry.getKey() + "}", entry.getValue());
            }
        }
        return contenido;
    }
}

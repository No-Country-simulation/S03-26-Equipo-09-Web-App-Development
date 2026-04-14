package com.startupcrm.crm_backend.scheduler;

import com.startupcrm.crm_backend.model.Contacto;
import com.startupcrm.crm_backend.model.Seguimiento;
import com.startupcrm.crm_backend.repository.SeguimientoRepository;
import com.startupcrm.crm_backend.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

/**
 * Scheduler para recordatorios automáticos de seguimientos
 * Ejecuta tareas programadas para:
 * - Enviar recordatorios de seguimientos pendientes
 * - Notificar sobre tareas próximas vencimiento
 */
@Component
@EnableScheduling
public class ReminderScheduler {

    private static final Logger logger = LoggerFactory.getLogger(ReminderScheduler.class);

    @Autowired
    private SeguimientoRepository seguimientoRepository;

    @Autowired
    private EmailService emailService;

    /**
     * Recordar seguimientos pendientes cada 24 horas
     * Se ejecuta diariamente a las 09:00 AM
     */
    @Scheduled(cron = "0 0 9 * * *")
    public void recordarSeguimientosPendientes() {
        logger.info("Iniciando recordatorio de seguimientos pendientes");
        
        try {
            // Obtener seguimientos no completados
            List<Seguimiento> seguimientosPendientes = seguimientoRepository.findByCompletadoFalse();
            
            logger.info("Se encontraron {} seguimientos pendientes", seguimientosPendientes.size());
            
            for (Seguimiento seguimiento : seguimientosPendientes) {
                Contacto contacto = seguimiento.getContacto();
                
                if (contacto != null && contacto.getEmail() != null) {
                    String asunto = "Recordatorio: Seguimiento pendiente - " + seguimiento.getTarea();
                    String contenido = generarContenidoRecordatorio(seguimiento, contacto);
                    
                    try {
                        emailService.enviarEmail(contacto.getEmail(), asunto, contenido);
                        logger.info("Recordatorio enviado a: {}", contacto.getEmail());
                    } catch (Exception e) {
                        logger.error("Error enviando recordatorio a {}: {}", contacto.getEmail(), e.getMessage());
                    }
                }
            }
        } catch (Exception e) {
            logger.error("Error en recordador de seguimientos pendientes: {}", e.getMessage());
        }
    }

    /**
     * Recordar tareas próximas a vencer (próximas 3 días)
     * Se ejecuta cada 6 horas
     */
    @Scheduled(cron = "0 0 */6 * * *")
    public void recordarTareasProximas() {
        logger.info("Iniciando recordatorio de tareas próximas a vencer");
        
        try {
            LocalDate hoy = LocalDate.now();
            LocalDate proximosTresDias = hoy.plus(3, ChronoUnit.DAYS);
            
            // Buscar seguimientos próximos a vencer
            List<Seguimiento> tareasProximas = seguimientoRepository.findByCompletadoFalseAndFechaBetween(
                hoy, proximosTresDias
            );
            
            logger.info("Se encontraron {} tareas próximas a vencer", tareasProximas.size());
            
            for (Seguimiento seguimiento : tareasProximas) {
                Contacto contacto = seguimiento.getContacto();
                
                if (contacto != null && contacto.getEmail() != null) {
                    long diasRestantes = ChronoUnit.DAYS.between(hoy, seguimiento.getFecha());
                    String asunto = String.format("URGENTE: %d días para vencer - %s", diasRestantes, seguimiento.getTarea());
                    String contenido = generarContenidoUrgencia(seguimiento, contacto, diasRestantes);
                    
                    try {
                        emailService.enviarEmail(contacto.getEmail(), asunto, contenido);
                        logger.info("Recordatorio urgente enviado a: {}", contacto.getEmail());
                    } catch (Exception e) {
                        logger.error("Error enviando recordatorio urgente a {}: {}", contacto.getEmail(), e.getMessage());
                    }
                }
            }
        } catch (Exception e) {
            logger.error("Error en recordador de tareas próximas: {}", e.getMessage());
        }
    }

    /**
     * Limpiar seguimientos completados hace más de 30 días (opcional)
     * Se ejecuta cada semana
     */
    @Scheduled(cron = "0 0 0 * * MON")
    public void limpiarSeguimientosAntiguos() {
        logger.info("Iniciando limpieza de seguimientos antiguos");
        
        try {
            LocalDate hace30Dias = LocalDate.now().minus(30, ChronoUnit.DAYS);
            List<Seguimiento> antiguos = seguimientoRepository.findByCompletadoTrueAndFechaBefore(hace30Dias);
            
            logger.info("Se encontraron {} seguimientos antiguos para limpiar", antiguos.size());
            // Aquí podrías agregar lógica de archivado o eliminación si lo deseas
        } catch (Exception e) {
            logger.error("Error en limpieza de seguimientos antiguos: {}", e.getMessage());
        }
    }

    /**
     * Generar contenido del recordatorio
     */
    private String generarContenidoRecordatorio(Seguimiento seguimiento, Contacto contacto) {
        return String.format(
            "Hola %s,\n\n" +
            "Te recordamos que tienes la siguiente tarea pendiente:\n" +
            "- Tarea: %s\n" +
            "- Fecha prevista: %s\n\n" +
            "Por favor, completa esta tarea en tu próxima oportunidad.\n\n" +
            "Sistema CRM",
            contacto.getNombre(),
            seguimiento.getTarea(),
            seguimiento.getFecha()
        );
    }

    /**
     * Generar contenido de recordatorio urgente
     */
    private String generarContenidoUrgencia(Seguimiento seguimiento, Contacto contacto, long diasRestantes) {
        return String.format(
            "Hola %s,\n\n" +
            "¡URGENTE! Tienes una tarea próxima a vencer:\n" +
            "- Tarea: %s\n" +
            "- Vencimiento: %s (%d días restantes)\n\n" +
            "Por favor, completa esta tarea lo antes posible.\n\n" +
            "Sistema CRM",
            contacto.getNombre(),
            seguimiento.getTarea(),
            seguimiento.getFecha(),
            diasRestantes
        );
    }
}

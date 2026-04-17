package com.startupcrm.crm_backend.sheduler;

import com.startupcrm.crm_backend.model.Seguimiento;
import com.startupcrm.crm_backend.repository.SeguimientoRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Component
public class SeguimientoScheduler {

    private final SeguimientoRepository seguimientoRepository;

    public SeguimientoScheduler(SeguimientoRepository seguimientoRepository) {
        this.seguimientoRepository = seguimientoRepository;
    }

    /**
     * Revisa tareas vencidas cada minuto.
     * fixedRate: 60000ms = 1 minuto.
     */
    @Scheduled(fixedRate = 60000)
    public void procesarRecordatoriosVencidos() {
        LocalDateTime ahora = LocalDateTime.now();

        // Buscamos en el repo: No completados y con fecha anterior a "ahora"
        List<Seguimiento> pendientes = seguimientoRepository
                .findByCompletadoFalseAndFechaBefore(ahora);

        if (pendientes.isEmpty()) {
            return;
        }

        log.info("Sheduler: Se encontraron {} recordatorios pendientes.", pendientes.size());

        for (Seguimiento s : pendientes) {
            ejecutarAccionDeNotificacion(s);
        }
    }

    private void ejecutarAccionDeNotificacion(Seguimiento s) {
        // Simulación de envío.
        // En un futuro aquí llamarías a un 'NotificationService'
        log.warn("ALERTA AUTOMÁTICA: El contacto {} tiene pendiente: {}",
                s.getContacto().getNombre(),
                s.getTarea());
        s.setCompletado(true);
        seguimientoRepository.save(s);
    }
}
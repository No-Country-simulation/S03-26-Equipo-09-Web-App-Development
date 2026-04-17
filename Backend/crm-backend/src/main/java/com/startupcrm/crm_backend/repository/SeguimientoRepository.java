package com.startupcrm.crm_backend.repository;

import com.startupcrm.crm_backend.model.Seguimiento;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface SeguimientoRepository extends JpaRepository<Seguimiento, Long> {

    // Para el Scheduler: Trae tareas no completadas que ya vencieron
    List<Seguimiento> findByCompletadoFalseAndFechaBefore(LocalDateTime fecha);

    // Tareas para hoy de un usuario específico
    List<Seguimiento> findByContactoResponsableIdAndFechaBetween(Long usuarioId, LocalDateTime inicio, LocalDateTime fin);
}
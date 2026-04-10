package com.startupcrm.crm_backend.repository;


import com.startupcrm.crm_backend.model.Seguimiento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface SeguimientoRepository extends JpaRepository<Seguimiento, Long> {
    
    /**
     * Buscar seguimientos no completados
     */
    List<Seguimiento> findByCompletadoFalse();
    
    /**
     * Buscar seguimientos completados
     */
    List<Seguimiento> findByCompletadoTrue();
    
    /**
     * Buscar seguimientos pendientes en un rango de fechas
     */
    List<Seguimiento> findByCompletadoFalseAndFechaBetween(LocalDate fechaInicio, LocalDate fechaFin);
    
    /**
     * Buscar seguimientos completados antes de una fecha
     */
    List<Seguimiento> findByCompletadoTrueAndFechaBefore(LocalDate fecha);
}
package com.startupcrm.crm_backend.repository;

import com.startupcrm.crm_backend.model.Conversacion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ConversacionRepository extends JpaRepository<Conversacion, Long> {

    // Para el contador de notificaciones del Header
    long countByLeidoFalseAndEsEntranteTrue();

    // Para ver el historial de un contacto específico
    List<Conversacion> findByContactoIdOrderByFechaHoraDesc(Long contactoId);
}
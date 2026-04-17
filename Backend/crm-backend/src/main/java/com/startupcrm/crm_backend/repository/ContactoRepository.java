package com.startupcrm.crm_backend.repository;

import com.startupcrm.crm_backend.model.Contacto;
import com.startupcrm.crm_backend.model.EstadoLead;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface ContactoRepository extends JpaRepository<Contacto, Long> {

    // Para filtrar por estado en el Funnel
    List<Contacto> findByEstado(String estado);

    // Para métricas: ¿Cuántos leads hay en X estado?
    long countByEstado(String estado);

    // Para métricas: ¿Cuántos leads entraron entre estas fechas?
    long countByFechaCreacionBetween(LocalDateTime inicio, LocalDateTime fin);

    // Para buscar por nombre o email (Barra de búsqueda)
    List<Contacto> findByNombreContainingIgnoreCaseOrEmailContainingIgnoreCase(String nombre, String email);
}
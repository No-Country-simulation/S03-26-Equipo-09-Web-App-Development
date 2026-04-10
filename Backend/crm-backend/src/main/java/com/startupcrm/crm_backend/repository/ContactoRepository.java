package com.startupcrm.crm_backend.repository;


import com.startupcrm.crm_backend.model.Contacto;
import com.startupcrm.crm_backend.model.EstadoLead;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ContactoRepository extends JpaRepository<Contacto, Long> {
    Contacto findByEmail(String email);
    
    /**
     * Buscar contactos por estado del funnel
     */
    List<Contacto> findByEstado(EstadoLead estado);
}
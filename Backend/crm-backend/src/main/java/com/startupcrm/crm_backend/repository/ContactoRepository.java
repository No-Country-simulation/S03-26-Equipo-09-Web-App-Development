package com.startupcrm.crm_backend.repository;


import com.startupcrm.crm_backend.model.Contacto;
import com.startupcrm.crm_backend.model.EstadoLead;
import com.startupcrm.crm_backend.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ContactoRepository extends JpaRepository<Contacto, Long> {
    Optional<Contacto> findByEmail(String email);
    
    Optional<Contacto> findByTelefono(String telefono);
    
    /**
     * Buscar contactos por estado del funnel
     */
    List<Contacto> findByEstado(EstadoLead estado);

    /**
     * Buscar contactos asignados a un vendedor específico
     */
    List<Contacto> findByVendedorAsignado(Usuario vendedor);

    /**
     * Buscar contactos por vendedor y estado
     */
    List<Contacto> findByVendedorAsignadoAndEstado(Usuario vendedor, EstadoLead estado);
}
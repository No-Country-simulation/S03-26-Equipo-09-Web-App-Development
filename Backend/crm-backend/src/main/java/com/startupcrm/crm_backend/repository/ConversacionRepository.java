package com.startupcrm.crm_backend.repository;



import com.startupcrm.crm_backend.model.Conversacion;
import com.startupcrm.crm_backend.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ConversacionRepository extends JpaRepository<Conversacion, Long> {
    List<Conversacion> findByVendedorAsignado(Usuario vendedor);
    List<Conversacion> findByContactoId(Long contactoId);
    List<Conversacion> findByVendedorAsignadoId(Long vendedorId);
}
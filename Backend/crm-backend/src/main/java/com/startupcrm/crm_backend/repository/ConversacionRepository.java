package com.startupcrm.crm_backend.repository;

import com.startupcrm.crm_backend.model.Conversacion;
import com.startupcrm.crm_backend.model.EstadoConversacion;
import com.startupcrm.crm_backend.model.Usuario;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ConversacionRepository extends JpaRepository<Conversacion, Long> {

    // Para ver el historial de un contacto específico
    List<Conversacion> findByContactoIdOrderByFechaHoraDesc(Long contactoId);

    // ========== Métodos sin paginación (compatibilidad hacia atrás) ==========
    List<Conversacion> findByVendedorAsignado(Usuario vendedor);
    List<Conversacion> findByContactoId(Long contactoId);
    List<Conversacion> findByVendedorAsignadoId(Long vendedorId);

    // ========== Métodos con paginación (NUEVOS) ==========
    Page<Conversacion> findAll(Pageable pageable);
    
    Page<Conversacion> findByVendedorAsignadoId(Long vendedorId, Pageable pageable);
    
    Page<Conversacion> findByContactoId(Long contactoId, Pageable pageable);

    // Filtrar por canal
    Page<Conversacion> findByCanal(String canal, Pageable pageable);

    // Filtrar por estado
    Page<Conversacion> findByEstado(EstadoConversacion estado, Pageable pageable);

    // Filtrar por vendedor y canal
    Page<Conversacion> findByVendedorAsignadoIdAndCanal(Long vendedorId, String canal, Pageable pageable);

    // Contar conversaciones no leídas por vendedor
    long countByVendedorAsignadoIdAndEstado(Long vendedorId, EstadoConversacion estado);

    // Filtrar por vendedor y estado (con paginación)
    Page<Conversacion> findByVendedorAsignadoIdAndEstado(Long vendedorId, EstadoConversacion estado, Pageable pageable);

    // Búsqueda por texto en contenido y contacto
    @Query("SELECT c FROM Conversacion c WHERE " +
           "LOWER(c.contenido) LIKE LOWER(CONCAT('%', :busqueda, '%')) OR " +
           "LOWER(c.contacto.nombre) LIKE LOWER(CONCAT('%', :busqueda, '%')) OR " +
           "LOWER(c.contacto.email) LIKE LOWER(CONCAT('%', :busqueda, '%'))")
    Page<Conversacion> searchConversaciones(@Param("busqueda") String busqueda, Pageable pageable);

    // Búsqueda por texto + filtro por vendedor
    @Query("SELECT c FROM Conversacion c WHERE c.vendedorAsignado.id = :vendedorId AND (" +
           "LOWER(c.contenido) LIKE LOWER(CONCAT('%', :busqueda, '%')) OR " +
           "LOWER(c.contacto.nombre) LIKE LOWER(CONCAT('%', :busqueda, '%')) OR " +
           "LOWER(c.contacto.email) LIKE LOWER(CONCAT('%', :busqueda, '%')))")
    Page<Conversacion> searchConversacionesPorVendedor(@Param("vendedorId") Long vendedorId, 
                                                       @Param("busqueda") String busqueda, 
                                                       Pageable pageable);
}
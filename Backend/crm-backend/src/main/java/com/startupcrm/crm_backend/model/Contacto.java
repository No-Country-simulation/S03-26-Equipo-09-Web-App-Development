package com.startupcrm.crm_backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Entidad Contacto (Lead/Cliente) para CRM Omnicanal.
 * 
 * Simplificada para MVP: No incluye colecciones anidadas.
 * Las conversaciones y seguimientos se obtienen mediante endpoints separados
 * para optimizar el rendimiento y mantenibilidad.
 * 
 * @author Backend Team
 * @version 2.0 - Refactorización MVP
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "contactos")
public class Contacto {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false, unique = false)
    private String email;

    @Column(nullable = false)
    private String telefono;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoLead estado; // LEAD_ACTIVO, EN_SEGUIMIENTO, CALIFICADO, CLIENTE

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vendedor_asignado_id")
    private Usuario vendedorAsignado; // Vendedor responsable del lead

    /**
     * ELIMINADAS en MVP:
     * - List<Conversacion> conversaciones → Usar endpoint GET /conversaciones/por-contacto/{id}
     * - List<Seguimiento> seguimientos → Usar endpoint GET /seguimientos/por-contacto/{id}
     * 
     * RAZÓN: Evitar N+1 queries, mejorar latencia y permitir paginación independiente
     */
}
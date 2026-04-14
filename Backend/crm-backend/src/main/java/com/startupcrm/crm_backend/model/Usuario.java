package com.startupcrm.crm_backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Builder.Default;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Entidad Usuario (Vendedor/Admin) para CRM Omnicanal.
 * 
 * Simplificada para MVP: La relación inversa a Conversaciones se obtiene
 * mediante queries filter (conversacionService.getByVendedor).
 * 
 * @author Backend Team
 * @version 2.0 - Refactorización MVP
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "usuarios")
public class Usuario {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String nombre;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    private String telefono;
    
    @Default
    @Column(nullable = false)
    private Boolean activo = true;

    /**
     * ELIMINADA en MVP:
     * - List<Conversacion> conversaciones (relación inversa)
     * 
     * RAZÓN: Reducir boilerplate de serialización circular.
     *         Las conversaciones de un vendedor se obtienen mediante:
     *         GET /api/conversaciones/por-vendedor/{vendedorId}
     */

    public enum Role {
        ADMIN, VENDEDOR
    }
}

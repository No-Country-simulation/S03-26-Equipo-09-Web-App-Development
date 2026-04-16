package com.startupcrm.crm_backend.dto;

import com.startupcrm.crm_backend.model.EstadoLead;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para Contacto - Alineado con apiClient.ts del Frontend.
 * 
 * SIMPLIFICADO para MVP:
 * - Sin conversaciones anidadas
 * - Sin seguimientos anidados
 * - Incluye vendedorAsignadoId para identificar responsable
 * 
 * El frontend obtiene detalles en requests separados:
 * - GET /api/conversaciones/por-contacto/{id}
 * - GET /api/seguimientos/por-contacto/{id}
 * 
 * @author Backend Team
 * @version 2.0 - Refactorización MVP
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContactoDTO {

    private Long id;

    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;

    @NotBlank(message = "El email es obligatorio")
    @Email(message = "Formato de email inválido")
    private String email;

    @NotBlank(message = "El teléfono es obligatorio")
    private String telefono;

    @NotNull(message = "El estado es obligatorio")
    private EstadoLead estado; // LEAD_ACTIVO, EN_SEGUIMIENTO, CALIFICADO, CLIENTE

    private Long vendedorAsignadoId; // ID del vendedor responsable

    // Información del vendedor (para mostrar en frontend)
    private String vendedorNombre;
    private String vendedorEmail;

    /**
     * ELIMINADAS de este DTO (MVP):
     * - List<ConversacionDTO> conversaciones
     * - List<SeguimientoDTO> seguimientos
     * 
     * RAZÓN: Evitar N+1 queries, reducir payload JSON, permitir paginación
     */
}


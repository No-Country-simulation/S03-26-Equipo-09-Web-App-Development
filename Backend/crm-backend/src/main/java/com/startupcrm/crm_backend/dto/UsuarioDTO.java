package com.startupcrm.crm_backend.dto;

import com.startupcrm.crm_backend.model.Usuario;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para Usuario (Vendedor/Admin).
 * 
 * Alineado con la interface Usuario del frontend (apiClient.ts).
 * NO expone password en ningún escenario (nunca se serializa en DTO).
 * 
 * @author Backend Team
 * @version 2.0 - Refactorización MVP
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UsuarioDTO {
    
    private Long id;

    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;

    @NotBlank(message = "El email es obligatorio")
    @Email(message = "Formato de email inválido")
    private String email;

    private String telefono;

    @NotBlank(message = "El rol es obligatorio")
    private String role; // 'ADMIN' | 'VENDEDOR'

    private Boolean activo;

    /**
     * Constructor de conversión desde Entity.
     * Nunca expone el password.
     */
    public UsuarioDTO(Usuario usuario) {
        this.id = usuario.getId();
        this.nombre = usuario.getNombre();
        this.email = usuario.getEmail();
        this.telefono = usuario.getTelefono();
        this.role = usuario.getRole().toString();
        this.activo = usuario.getActivo();
    }
}

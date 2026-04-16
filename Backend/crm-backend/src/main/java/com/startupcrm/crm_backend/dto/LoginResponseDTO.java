package com.startupcrm.crm_backend.dto;

import com.startupcrm.crm_backend.model.Usuario;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para respuesta de login (incluye token y datos del usuario)
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponseDTO {
    
    private String token;
    private Long userId;
    private String email;
    private String nombre;
    private String role;
    private boolean activo;
    
    /**
     * Constructor desde Usuario
     */
    public LoginResponseDTO(String token, Usuario usuario) {
        this.token = token;
        this.userId = usuario.getId();
        this.email = usuario.getEmail();
        this.nombre = usuario.getNombre();
        this.role = usuario.getRole().name();
        this.activo = usuario.getActivo();
    }
}

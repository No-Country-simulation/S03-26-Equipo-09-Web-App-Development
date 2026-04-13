package com.startupcrm.crm_backend.dto.auth;

import com.startupcrm.crm_backend.dto.UsuarioDTO;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LoginResponseDTO {
    private String token;
    private UsuarioDTO user;
}


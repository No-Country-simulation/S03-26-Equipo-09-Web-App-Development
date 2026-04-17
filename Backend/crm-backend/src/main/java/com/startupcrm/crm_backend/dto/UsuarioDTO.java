package com.startupcrm.crm_backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UsuarioDTO {
    private Long id;
    private String username;
    private String email;
    private String rol;
}
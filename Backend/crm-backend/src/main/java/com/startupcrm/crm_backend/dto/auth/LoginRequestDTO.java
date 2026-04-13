package com.startupcrm.crm_backend.dto.auth;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequestDTO {
    @NotBlank
    private String email;
    @NotBlank
    private String password;
}



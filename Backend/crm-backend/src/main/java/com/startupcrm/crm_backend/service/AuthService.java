package com.startupcrm.crm_backend.service;

import com.startupcrm.crm_backend.dto.auth.LoginRequestDTO;
import com.startupcrm.crm_backend.dto.auth.LoginResponseDTO;

public interface AuthService {
    LoginResponseDTO login(LoginRequestDTO request);
}

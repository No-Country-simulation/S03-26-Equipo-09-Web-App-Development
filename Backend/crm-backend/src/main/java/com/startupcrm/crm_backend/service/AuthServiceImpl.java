package com.startupcrm.crm_backend.service;

import com.startupcrm.crm_backend.dto.UsuarioDTO;
import com.startupcrm.crm_backend.dto.auth.LoginRequestDTO;
import com.startupcrm.crm_backend.dto.auth.LoginResponseDTO;
import com.startupcrm.crm_backend.model.Usuario;
import com.startupcrm.crm_backend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UsuarioRepository usuarioRepository;

    @Override
    public LoginResponseDTO login(LoginRequestDTO request) {

        Usuario usuario = usuarioRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Credenciales inválidas"));

        // ⚠️ Versión simple (luego usamos BCrypt)
        if (!usuario.getPassword().equals(request.getPassword())) {
            throw new RuntimeException("Credenciales inválidas");
        }

        // Generar token simple (temporal)
        String token = UUID.randomUUID().toString();
        //mapeo
        UsuarioDTO usuarioDTO = new UsuarioDTO();
        usuarioDTO.setId(usuario.getId());
        usuarioDTO.setUsername(usuario.getUsername());
        usuarioDTO.setEmail(usuario.getEmail());
        usuarioDTO.setRol(usuario.getRol());

        return LoginResponseDTO.builder()
                .token(token)
                .user(usuarioDTO)
                .build();
    }
}



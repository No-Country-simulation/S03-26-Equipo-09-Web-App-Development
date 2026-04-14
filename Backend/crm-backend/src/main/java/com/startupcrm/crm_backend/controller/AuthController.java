package com.startupcrm.crm_backend.controller;

import com.startupcrm.crm_backend.dto.ApiResponse;
import com.startupcrm.crm_backend.dto.LoginRequest;
import com.startupcrm.crm_backend.dto.LoginResponse;
import com.startupcrm.crm_backend.mapper.UsuarioMapper;
import com.startupcrm.crm_backend.model.Usuario;
import com.startupcrm.crm_backend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UsuarioRepository usuarioRepository;
    private final UsuarioMapper usuarioMapper;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@RequestBody LoginRequest request) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(request.getEmail());

        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();
            // VALIDACIÓN SIMPLE EN TEXTO PLANO
            // Nota: En producción se debe usar BCryptPasswordEncoder
            if (usuario.getPassword() != null && usuario.getPassword().equals(request.getPassword())) {
                LoginResponse response = new LoginResponse();
                response.setToken("token-real-de-bd-" + usuario.getId());
                response.setUser(usuarioMapper.toDTO(usuario));
                response.setExpiresIn(3600);
                
                return ResponseEntity.ok(ApiResponse.success(response));
            }
        }

        return ResponseEntity.status(401)
                .body(ApiResponse.error("Credenciales incorrectas. Usa admin@example.com / admin123"));
    }
}

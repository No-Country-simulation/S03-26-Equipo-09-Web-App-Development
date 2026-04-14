package com.startupcrm.crm_backend.controller;

import com.startupcrm.crm_backend.dto.ApiResponse;
import com.startupcrm.crm_backend.dto.UsuarioDTO;
import com.startupcrm.crm_backend.model.Usuario;
import com.startupcrm.crm_backend.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping
    public ApiResponse<List<UsuarioDTO>> getAllUsuarios() {
        List<UsuarioDTO> data = usuarioService.getAll().stream()
                .map(UsuarioDTO::new)
                .toList();
        return new ApiResponse<>(true, data, null);
    }

    @GetMapping("/vendedores")
    public ApiResponse<List<UsuarioDTO>> getVendedores() {
        List<UsuarioDTO> data = usuarioService.getVendedores().stream()
                .map(UsuarioDTO::new)
                .toList();
        return new ApiResponse<>(true, data, null);
    }

    @GetMapping("/{id}")
    public ApiResponse<UsuarioDTO> getUsuarioById(@PathVariable Long id) {
        Usuario usuario = usuarioService.getById(id);
        return new ApiResponse<>(true, new UsuarioDTO(usuario), null);
    }

    @PostMapping
    public ResponseEntity<ApiResponse<UsuarioDTO>> createUsuario(@Valid @RequestBody Usuario usuario) {
        Usuario saved = usuarioService.save(usuario);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true, new UsuarioDTO(saved), null));
    }

    @PutMapping("/{id}")
    public ApiResponse<UsuarioDTO> updateUsuario(@PathVariable Long id, @Valid @RequestBody Usuario usuarioDetails) {
        Usuario updated = usuarioService.update(id, usuarioDetails);
        return new ApiResponse<>(true, new UsuarioDTO(updated), null);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUsuario(@PathVariable Long id) {
        usuarioService.delete(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT)
                .body(new ApiResponse<>(true, null, null));
    }
}

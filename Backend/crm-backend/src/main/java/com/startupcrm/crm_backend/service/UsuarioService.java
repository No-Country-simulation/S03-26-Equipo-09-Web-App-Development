package com.startupcrm.crm_backend.service;

import com.startupcrm.crm_backend.exception.ResourceNotFoundException;
import com.startupcrm.crm_backend.model.Usuario;
import com.startupcrm.crm_backend.repository.UsuarioRepository;
import com.startupcrm.crm_backend.security.JwtProvider;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final JwtProvider jwtProvider;

    public UsuarioService(UsuarioRepository usuarioRepository, JwtProvider jwtProvider) {
        this.usuarioRepository = usuarioRepository;
        this.jwtProvider = jwtProvider;
    }

    public List<Usuario> getAll() {
        return usuarioRepository.findAll();
    }

    public List<Usuario> getVendedores() {
        return usuarioRepository.findByRoleAndActivo(Usuario.Role.VENDEDOR, true);
    }

    public Usuario getById(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
    }

    public Usuario getByEmail(String email) {
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
    }

    public Usuario save(Usuario usuario) {
        // Establecer defaults si no están presentes
        if (usuario.getActivo() == null) {
            usuario.setActivo(true);
        }
        if (usuario.getRole() == null) {
            usuario.setRole(Usuario.Role.VENDEDOR);
        }
        return usuarioRepository.save(usuario);
    }

    public Usuario update(Long id, Usuario usuarioDetails) {
        Usuario existente = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        // Hacer updates parciales - solo actualizar campos que NO sean null
        if (usuarioDetails.getNombre() != null && !usuarioDetails.getNombre().isBlank()) {
            existente.setNombre(usuarioDetails.getNombre());
        }
        if (usuarioDetails.getEmail() != null && !usuarioDetails.getEmail().isBlank()) {
            existente.setEmail(usuarioDetails.getEmail());
        }
        if (usuarioDetails.getTelefono() != null) {
            existente.setTelefono(usuarioDetails.getTelefono());
        }
        // El campo activo se actualiza siempre si viene en la solicitud
        if (usuarioDetails.getActivo() != null) {
            existente.setActivo(usuarioDetails.getActivo());
        }

        return usuarioRepository.save(existente);
    }

    public void delete(Long id) {
        if (!usuarioRepository.existsById(id)) {
            throw new ResourceNotFoundException("Usuario no encontrado");
        }
        usuarioRepository.deleteById(id);
    }

    /**
     * Autenticar usuario por email y contraseña
     * @param email Email del usuario
     * @param password Contraseña del usuario
     * @return Usuario autenticado
     * @throws RuntimeException si las credenciales no son válidas
     */
    public Usuario authenticate(String email, String password) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Email o contraseña incorrectos"));

        // Validación simple de contraseña (sin encriptación para desarrollo)
        if (!usuario.getPassword().equals(password)) {
            throw new RuntimeException("Email o contraseña incorrectos");
        }

        if (!usuario.getActivo()) {
            throw new RuntimeException("Usuario inactivo");
        }

        return usuario;
    }

    /**
     * Generar token JWT con información del usuario y sus roles
     * 
     * @param usuario Usuario para el cual generar el token
     * @return Token JWT firmado
     */
    public String generateToken(Usuario usuario) {
        return jwtProvider.generateToken(usuario);
    }
}

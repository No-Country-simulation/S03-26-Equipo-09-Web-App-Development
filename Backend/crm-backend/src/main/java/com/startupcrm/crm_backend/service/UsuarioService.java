package com.startupcrm.crm_backend.service;

import com.startupcrm.crm_backend.exception.ResourceNotFoundException;
import com.startupcrm.crm_backend.model.Usuario;
import com.startupcrm.crm_backend.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
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
        return usuarioRepository.save(usuario);
    }

    public Usuario update(Long id, Usuario usuarioDetails) {
        Usuario existente = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        existente.setNombre(usuarioDetails.getNombre());
        existente.setEmail(usuarioDetails.getEmail());
        existente.setTelefono(usuarioDetails.getTelefono());
        existente.setActivo(usuarioDetails.getActivo());

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
     * Generar token JWT simple (para desarrollo)
     * En producción: usar Spring Security + JWT Provider
     */
    public String generateToken(Usuario usuario) {
        // Generar un token simple UUID para desarrollo
        // En producción usarías JWT con HMAC256 o RSA
        return "Bearer-" + UUID.randomUUID().toString() + "-" + usuario.getId();
    }
}

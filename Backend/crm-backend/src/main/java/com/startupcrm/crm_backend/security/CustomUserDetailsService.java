package com.startupcrm.crm_backend.security;

import com.startupcrm.crm_backend.model.Usuario;
import com.startupcrm.crm_backend.repository.UsuarioRepository;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Collections;

/**
 * Implementación de UserDetailsService para cargar Usuario + Roles desde BD.
 * 
 * Spring Security utiliza este servicio para construir el contexto de autenticación
 * con los permisos/roles del usuario.
 * 
 * @author Backend Team
 * @version 1.0 - RBAC Implementation
 */
@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;

    public CustomUserDetailsService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    /**
     * Cargar usuario por email (username en Spring Security)
     */
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + username));

        return new CustomUserDetails(usuario);
    }

    /**
     * Cargar usuario por ID
     */
    public UserDetails loadUserById(Long userId) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado con ID: " + userId));

        return new CustomUserDetails(usuario);
    }

    /**
     * UserDetails personalizado que incluye campos del modelo Usuario
     */
    public static class CustomUserDetails implements UserDetails {
        
        private final Usuario usuario;

        public CustomUserDetails(Usuario usuario) {
            this.usuario = usuario;
        }

        @Override
        public Collection<? extends GrantedAuthority> getAuthorities() {
            // Convertir role (ADMIN, VENDEDOR) a GrantedAuthority con prefijo "ROLE_"
            return Collections.singletonList(
                    new SimpleGrantedAuthority("ROLE_" + usuario.getRole().toString())
            );
        }

        @Override
        public String getPassword() {
            return usuario.getPassword();
        }

        @Override
        public String getUsername() {
            return usuario.getEmail();
        }

        @Override
        public boolean isAccountNonExpired() {
            return true;
        }

        @Override
        public boolean isAccountNonLocked() {
            return true;
        }

        @Override
        public boolean isCredentialsNonExpired() {
            return true;
        }

        @Override
        public boolean isEnabled() {
            return usuario.getActivo();
        }

        // Getter para acceder al objeto Usuario completo
        public Usuario getUsuario() {
            return usuario;
        }

        public Long getId() {
            return usuario.getId();
        }

        public String getNombre() {
            return usuario.getNombre();
        }

        public String getRole() {
            return usuario.getRole().toString();
        }
    }
}

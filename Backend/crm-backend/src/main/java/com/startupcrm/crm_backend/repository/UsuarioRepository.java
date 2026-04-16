package com.startupcrm.crm_backend.repository;

import com.startupcrm.crm_backend.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByEmail(String email);
    Optional<Usuario> findByNombre(String nombre);
    List<Usuario> findByRole(Usuario.Role role);
    List<Usuario> findByActivo(Boolean activo);
    List<Usuario> findByRoleAndActivo(Usuario.Role role, Boolean activo);
}

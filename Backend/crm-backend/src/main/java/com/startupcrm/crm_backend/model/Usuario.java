package com.startupcrm.crm_backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "usuarios")
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String nombre;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    private String telefono;
    private Boolean activo = true;

    @OneToMany(mappedBy = "vendedorAsignado", cascade = CascadeType.DETACH)
    @JsonManagedReference(value = "usuario-conversaciones")
    private List<Conversacion> conversaciones;

    public enum Role {
        ADMIN, VENDEDOR
    }
}

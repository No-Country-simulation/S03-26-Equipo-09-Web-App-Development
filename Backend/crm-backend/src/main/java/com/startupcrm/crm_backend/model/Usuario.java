package com.startupcrm.crm_backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "usuarios")
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    private String password; // Se guardará cifrada

    @Column(unique = true)
    private String email;

    private String rol; // ADMIN, AGENTE

    @OneToMany(mappedBy = "responsable")
    private List<Contacto> contactosAsignados = new ArrayList<>();
}
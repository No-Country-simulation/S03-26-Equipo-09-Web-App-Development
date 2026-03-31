package com.startupcrm.crm_backend.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "contactos")
public class Contacto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;
    private String email;
    private String telefono;

    @Enumerated(EnumType.STRING)
    private EstadoLead estado; // LEAD_ACTIVO, EN_SEGUIMIENTO, CALIFICADO, CLIENTE

    @OneToMany(mappedBy = "contacto", cascade = CascadeType.ALL, orphanRemoval = true)
    //@JsonManagedReference
    @JsonManagedReference(value = "contacto-conversaciones")

    private List<Conversacion> conversaciones = new ArrayList<>();

    @OneToMany(mappedBy = "contacto", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference(value = "contacto-seguimientos")
    private List<Seguimiento> seguimientos = new ArrayList<>();
}
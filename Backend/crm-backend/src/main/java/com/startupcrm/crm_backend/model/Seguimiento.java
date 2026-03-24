package com.startupcrm.crm_backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "seguimientos")
public class Seguimiento {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String tarea;
    private LocalDate fecha;
    private Boolean completado;

    @ManyToOne
    @JoinColumn(name = "contacto_id")
    private Contacto contacto;
}
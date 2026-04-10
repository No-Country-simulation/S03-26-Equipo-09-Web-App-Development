package com.startupcrm.crm_backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;


import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "seguimientos")
public class Seguimiento {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String tarea;
    private LocalDateTime fecha; // Con hora para el Scheduler
    private Boolean completado = false;

    private Boolean recordatorioActivado = false;

    @ManyToOne
    @JoinColumn(name = "contacto_id")
    private Contacto contacto;
}
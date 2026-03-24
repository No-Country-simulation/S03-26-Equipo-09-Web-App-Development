package com.startupcrm.crm_backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;


@Getter
@Setter
@Entity
@Table(name = "conversaciones")
public class Conversacion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String canal; // WhatsApp, Email
    private String contenido;
    private LocalDateTime fechaHora;

    @ManyToOne
    @JoinColumn(name = "contacto_id")
    private Contacto contacto;
}

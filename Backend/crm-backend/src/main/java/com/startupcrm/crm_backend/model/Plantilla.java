package com.startupcrm.crm_backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "plantillas")
public class Plantilla {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre; // Ej: "Bienvenida_WA"
    private String tipo; // WHATSAPP, EMAIL

    @Column(columnDefinition = "TEXT")
    private String contenido; // Soporta placeholders como {{nombre}}
}

package com.startupcrm.crm_backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "plantillas")
public class Plantilla {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;  // Ej: "Bienvenida Lead"

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoPlantilla tipo;  // EMAIL, WHATSAPP

    @Column(name = "asunto")
    private String asunto;  // [Para EMAIL]

    @Column(columnDefinition = "TEXT", nullable = false)
    private String contenido;  // {variable} para interpolación

    @Column(nullable = false)
    private Boolean activa = true;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    public enum TipoPlantilla {
        EMAIL, WHATSAPP
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}

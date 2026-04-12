package com.startupcrm.crm_backend.dto;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
public class PlantillaDTO {
    private Long id;
    private String nombre; // Antes titulo
    private String contenido;
    private String canal;
    private Boolean esActiva;
    private LocalDateTime fechaCreacion;
    private Long usuarioId;
}
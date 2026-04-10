package com.startupcrm.crm_backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PlantillaDTO {
    private Long id;
    private String nombre;
    private String tipo;
    private String contenido;
}
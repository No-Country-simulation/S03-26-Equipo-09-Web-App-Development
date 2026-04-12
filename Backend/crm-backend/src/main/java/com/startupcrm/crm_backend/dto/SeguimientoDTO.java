package com.startupcrm.crm_backend.dto;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
public class SeguimientoDTO {
    private Long id;
    private String tarea;
    private LocalDateTime fecha;
    private Boolean completado;
    private Boolean recordatorioActivado;
    private ContactoDTO contacto;


}

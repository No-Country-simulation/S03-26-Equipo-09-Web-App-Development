package com.startupcrm.crm_backend.dto;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
public class ConversacionDTO {
    private Long id;
    private String canal;
    private String contenido;
    private LocalDateTime fechaHora;
    private Boolean esEntrante; // true: Cliente, false: Empresa
    private Boolean leido;
    private ContactoDTO contacto;


}


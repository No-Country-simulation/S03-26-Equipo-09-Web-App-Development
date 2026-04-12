package com.startupcrm.crm_backend.dto;

import com.startupcrm.crm_backend.model.EstadoLead;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class ContactoDTO {

    private Long id;

    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;

    @NotBlank(message = "El email es obligatorio")
    @Email(message = "Formato de email inválido")
    private String email;

    @NotBlank(message = "El teléfono es obligatorio")
    private String telefono;

    private String estado;
    private LocalDateTime fechaCreacion;
    private String nombreResponsable; // Para mostrar quién lo atiende

    private List<ConversacionDTO> conversaciones;
    private List<SeguimientoDTO> seguimientos;
    private List<String> etiquetas;
}


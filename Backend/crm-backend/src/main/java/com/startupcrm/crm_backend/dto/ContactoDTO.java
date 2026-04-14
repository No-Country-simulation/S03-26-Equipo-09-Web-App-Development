package com.startupcrm.crm_backend.dto;

import com.startupcrm.crm_backend.model.EstadoLead;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

import java.util.List;

public class ContactoDTO {

    private Long id;
    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;

    @NotBlank(message = "El email es obligatorio")
    @Email(message = "Formato de email inválido")
    private String email;

    @NotBlank(message = "El teléfono es obligatorio")
    private String telefono;

    private EstadoLead estado;

    private List<ConversacionDTO> conversaciones;
    private List<SeguimientoDTO> seguimientos;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public EstadoLead getEstado() {
        return estado;
    }

    public void setEstado(EstadoLead estado) {
        this.estado = estado;
    }

    public List<ConversacionDTO> getConversaciones() {
        return conversaciones;
    }

    public void setConversaciones(List<ConversacionDTO> conversaciones) {
        this.conversaciones = conversaciones;
    }

    public List<SeguimientoDTO> getSeguimientos() {
        return seguimientos;
    }

    public void setSeguimientos(List<SeguimientoDTO> seguimientos) {
        this.seguimientos = seguimientos;
    }

}


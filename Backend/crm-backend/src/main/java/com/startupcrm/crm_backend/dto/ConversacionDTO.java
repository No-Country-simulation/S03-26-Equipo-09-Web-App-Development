package com.startupcrm.crm_backend.dto;

import java.time.LocalDateTime;

public class ConversacionDTO {

    private Long id;
    private String canal;
    private String contenido;
    private LocalDateTime fechaHora;
    private Long contactoId;
    private Long vendedorAsignadoId;
    private String vendedorAsignadoNombre;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCanal() {
        return canal;
    }

    public void setCanal(String canal) {
        this.canal = canal;
    }

    public String getContenido() {
        return contenido;
    }

    public void setContenido(String contenido) {
        this.contenido = contenido;
    }

    public LocalDateTime getFechaHora() {
        return fechaHora;
    }

    public void setFechaHora(LocalDateTime fechaHora) {
        this.fechaHora = fechaHora;
    }

    public Long getContactoId() {
        return contactoId;
    }

    public void setContactoId(Long contactoId) {
        this.contactoId = contactoId;
    }

    public Long getVendedorAsignadoId() {
        return vendedorAsignadoId;
    }

    public void setVendedorAsignadoId(Long vendedorAsignadoId) {
        this.vendedorAsignadoId = vendedorAsignadoId;
    }

    public String getVendedorAsignadoNombre() {
        return vendedorAsignadoNombre;
    }

    public void setVendedorAsignadoNombre(String vendedorAsignadoNombre) {
        this.vendedorAsignadoNombre = vendedorAsignadoNombre;
    }
}


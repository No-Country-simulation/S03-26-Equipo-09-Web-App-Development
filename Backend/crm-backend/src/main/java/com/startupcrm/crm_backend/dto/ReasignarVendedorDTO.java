package com.startupcrm.crm_backend.dto;

public class ReasignarVendedorDTO {
    private Long conversacionId;
    private Long nuevoVendedorId;

    public Long getConversacionId() {
        return conversacionId;
    }

    public void setConversacionId(Long conversacionId) {
        this.conversacionId = conversacionId;
    }

    public Long getNuevoVendedorId() {
        return nuevoVendedorId;
    }

    public void setNuevoVendedorId(Long nuevoVendedorId) {
        this.nuevoVendedorId = nuevoVendedorId;
    }
}

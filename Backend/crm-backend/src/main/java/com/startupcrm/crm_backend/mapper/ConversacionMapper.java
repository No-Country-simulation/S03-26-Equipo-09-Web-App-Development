package com.startupcrm.crm_backend.mapper;

import com.startupcrm.crm_backend.dto.ConversacionDTO;
import com.startupcrm.crm_backend.model.Conversacion;

public class ConversacionMapper {

    public static ConversacionDTO toDTO(Conversacion c) {
        if (c == null) return null;

        ConversacionDTO dto = new ConversacionDTO();
        dto.setId(c.getId());
        dto.setCanal(c.getCanal());
        dto.setContenido(c.getContenido());
        dto.setFechaHora(c.getFechaHora());
        
        if (c.getContacto() != null) {
            dto.setContactoId(c.getContacto().getId());
        }
        
        if (c.getVendedorAsignado() != null) {
            dto.setVendedorAsignadoId(c.getVendedorAsignado().getId());
            dto.setVendedorAsignadoNombre(c.getVendedorAsignado().getNombre());
        }

        return dto;
    }

    public static Conversacion toEntity(ConversacionDTO dto) {
        if (dto == null) return null;

        Conversacion conversacion = new Conversacion();
        conversacion.setId(dto.getId());
        conversacion.setCanal(dto.getCanal());
        conversacion.setContenido(dto.getContenido());
        conversacion.setFechaHora(dto.getFechaHora());

        return conversacion;
    }
}

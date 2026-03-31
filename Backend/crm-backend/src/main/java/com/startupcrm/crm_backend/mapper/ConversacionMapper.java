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

        return dto;
    }
}

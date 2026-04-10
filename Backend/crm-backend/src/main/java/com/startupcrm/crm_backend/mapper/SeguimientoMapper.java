package com.startupcrm.crm_backend.mapper;

import com.startupcrm.crm_backend.dto.SeguimientoDTO;
import com.startupcrm.crm_backend.model.Seguimiento;

public class SeguimientoMapper {

    public static SeguimientoDTO toDTO(Seguimiento s) {
        if (s == null) return null;

        SeguimientoDTO dto = new SeguimientoDTO();
        dto.setId(s.getId());
        dto.setTarea(s.getTarea());
        dto.setFecha(s.getFecha());
        dto.setCompletado(s.isCompletado());

        return dto;
    }

    public static Seguimiento toEntity(SeguimientoDTO dto) {
        if (dto == null) return null;

        Seguimiento seguimiento = new Seguimiento();
        seguimiento.setId(dto.getId());
        seguimiento.setTarea(dto.getTarea());
        seguimiento.setFecha(dto.getFecha());
        seguimiento.setCompletado(dto.isCompletado());

        return seguimiento;
    }
}


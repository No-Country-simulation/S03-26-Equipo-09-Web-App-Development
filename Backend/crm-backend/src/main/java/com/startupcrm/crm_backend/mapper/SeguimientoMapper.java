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
        dto.setCompletado(s.getCompletado());
        dto.setRecordatorioActivado(s.getRecordatorioActivado());

        return dto;
    }

    public static Seguimiento toEntity(SeguimientoDTO dto) {
        if (dto == null) return null;

        Seguimiento s = new Seguimiento();
        s.setTarea(dto.getTarea());
        s.setFecha(dto.getFecha());
        s.setCompletado(dto.getCompletado());
        s.setRecordatorioActivado(dto.getRecordatorioActivado());
        return s;
    }
}

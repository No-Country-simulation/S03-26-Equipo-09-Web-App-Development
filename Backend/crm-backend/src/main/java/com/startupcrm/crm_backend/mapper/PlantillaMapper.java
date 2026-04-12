package com.startupcrm.crm_backend.mapper;

import com.startupcrm.crm_backend.dto.PlantillaDTO;
import com.startupcrm.crm_backend.model.Plantilla;

public class PlantillaMapper {

    public static PlantillaDTO toDTO(Plantilla entity) {
        if (entity == null) return null;
        PlantillaDTO dto = new PlantillaDTO();
        dto.setId(entity.getId());
        dto.setNombre(entity.getTitulo());
        dto.setContenido(entity.getContenido());
        dto.setCanal(entity.getCanal());
        dto.setEsActiva(entity.getEsActiva());
        dto.setFechaCreacion(entity.getFechaCreacion());
        if (entity.getUsuario() != null) {
            dto.setUsuarioId(entity.getUsuario().getId());
        }
        return dto;
    }

    public static Plantilla toEntity(PlantillaDTO dto) {
        if (dto == null) return null;
        Plantilla entity = new Plantilla();
        entity.setId(dto.getId());
        entity.setTitulo(dto.getNombre());
        entity.setContenido(dto.getContenido());
        entity.setCanal(dto.getCanal());
        entity.setEsActiva(dto.getEsActiva());
        // El usuario se maneja normalmente en el service/controller
        return entity;
    }
}

package com.startupcrm.crm_backend.mapper;

import com.startupcrm.crm_backend.dto.ConversacionDTO;
import com.startupcrm.crm_backend.model.Conversacion;

/**
 * Mapper para Conversacion <-> ConversacionDTO
 * 
 * Crítico para omnicanalidad: Mapea correctamente vendedorAsignadoNombre
 * para que el frontend (UnifiedInbox) pueda renderizar "Asignado a: X"
 * sin hacer queries adicionales.
 * 
 * @author Backend Team
 * @version 2.0 - MVP Refactorización
 */
public class ConversacionMapper {

    public static ConversacionDTO toDTO(Conversacion c) {
        if (c == null) return null;

        return ConversacionDTO.builder()
                .id(c.getId())
                .canal(c.getCanal())
                .contenido(c.getContenido())
                .fechaHora(c.getFechaHora())
                .contactoId(c.getContacto() != null ? c.getContacto().getId() : null)
                .vendedorAsignadoId(c.getVendedorAsignado() != null ? c.getVendedorAsignado().getId() : null)
                .vendedorAsignadoNombre(c.getVendedorAsignado() != null ? c.getVendedorAsignado().getNombre() : null)
                .build();
    }

    public static Conversacion toEntity(ConversacionDTO dto) {
        if (dto == null) return null;

        return Conversacion.builder()
                .id(dto.getId())
                .canal(dto.getCanal())
                .contenido(dto.getContenido())
                .fechaHora(dto.getFechaHora())
                // Note: contactoId y vendedorAsignadoId deben ser resueltos en el service
                .build();
    }
}

package com.startupcrm.crm_backend.mapper;

import com.startupcrm.crm_backend.dto.ContactoDTO;
import com.startupcrm.crm_backend.model.Contacto;
import jakarta.validation.Valid;

import java.util.stream.Collectors;

public class ContactoMapper {

    public static ContactoDTO toDTO(Contacto contacto) {
        if (contacto == null) return null;

        ContactoDTO dto = new ContactoDTO();
        dto.setId(contacto.getId());
        dto.setNombre(contacto.getNombre());
        dto.setEmail(contacto.getEmail());
        dto.setTelefono(contacto.getTelefono());
        dto.setEstado(contacto.getEstado());
        dto.setFechaCreacion(contacto.getFechaCreacion());

        // Mapeamos el nombre del responsable si existe
        if (contacto.getResponsable() != null) {
            dto.setNombreResponsable(contacto.getResponsable().getUsername());
        }

        if (contacto.getConversaciones() != null) {
            dto.setConversaciones(contacto.getConversaciones().stream()
                    .map(ConversacionMapper::toDTO)
                    .collect(Collectors.toList()));
        }

        if (contacto.getSeguimientos() != null) {
            dto.setSeguimientos(contacto.getSeguimientos().stream()
                    .map(SeguimientoMapper::toDTO)
                    .collect(Collectors.toList()));
        }

        return dto;
    }

    public static Contacto toEntity(ContactoDTO dto) {
        if (dto == null) return null;

        Contacto contacto = new Contacto();
        contacto.setId(dto.getId());
        contacto.setNombre(dto.getNombre());
        contacto.setEmail(dto.getEmail());
        contacto.setTelefono(dto.getTelefono());
        contacto.setEstado(dto.getEstado());
        // La fecha de creación no se suele mapear de vuelta para no sobreescribirla

        return contacto;
    }
}
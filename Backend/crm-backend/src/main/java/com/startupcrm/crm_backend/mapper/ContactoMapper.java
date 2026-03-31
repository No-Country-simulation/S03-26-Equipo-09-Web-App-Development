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

        dto.setConversaciones(
                contacto.getConversaciones()
                        .stream()
                        .map(ConversacionMapper::toDTO)
                        .collect(Collectors.toList())
        );

        dto.setSeguimientos(
                contacto.getSeguimientos()
                        .stream()
                        .map(SeguimientoMapper::toDTO)
                        .collect(Collectors.toList())
        );

        return dto;
    }

    public static Contacto toEntity(ContactoDTO dto) {
        if (dto == null) return null;

        Contacto contacto = new Contacto();
        contacto.setNombre(dto.getNombre());

        return contacto;
    }

}


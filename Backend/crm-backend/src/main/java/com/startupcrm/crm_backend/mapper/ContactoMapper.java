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
        // El ID también es importante si vas a hacer Updates (PUT)
        contacto.setId(dto.getId()); 
        contacto.setNombre(dto.getNombre());
        contacto.setEmail(dto.getEmail());
        contacto.setTelefono(dto.getTelefono());
        contacto.setEstado(dto.getEstado());
        
        // --------------------

        return contacto;
    }

}


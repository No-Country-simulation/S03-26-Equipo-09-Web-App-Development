package com.startupcrm.crm_backend.mapper;

import com.startupcrm.crm_backend.dto.ContactoDTO;
import com.startupcrm.crm_backend.model.Contacto;
import lombok.RequiredArgsConstructor;

/**
 * Mapper para Contacto <-> ContactoDTO
 * 
 * SIMPLIFICADO para MVP:
 * - NO mapea conversaciones ni seguimientos (requests separados)
 * - Mapea vendedorAsignado -> vendedorAsignadoId
 * 
 * @author Backend Team
 * @version 2.0 - MVP Refactorización
 */
public class ContactoMapper {

    public static ContactoDTO toDTO(Contacto contacto) {
        if (contacto == null) return null;

        return ContactoDTO.builder()
                .id(contacto.getId())
                .nombre(contacto.getNombre())
                .email(contacto.getEmail())
                .telefono(contacto.getTelefono())
                .estado(contacto.getEstado())
                .vendedorAsignadoId(
                    contacto.getVendedorAsignado() != null 
                        ? contacto.getVendedorAsignado().getId() 
                        : null
                )
                .vendedorNombre(
                    contacto.getVendedorAsignado() != null
                        ? contacto.getVendedorAsignado().getNombre()
                        : null
                )
                .vendedorEmail(
                    contacto.getVendedorAsignado() != null
                        ? contacto.getVendedorAsignado().getEmail()
                        : null
                )
                .build();
        
        /**
         * ELIMINADO de este mapper (MVP):
         * - Mapping de conversaciones (requests separados)
         * - Mapping de seguimientos (requests separados)
         * 
         * Frontend obtiene detalles mediante:
         * - GET /api/conversaciones/por-contacto/{id}
         * - GET /api/seguimientos/por-contacto/{id}
         */
    }

    public static Contacto toEntity(ContactoDTO dto) {
        if (dto == null) return null;

        return Contacto.builder()
                .id(dto.getId())
                .nombre(dto.getNombre())
                .email(dto.getEmail())
                .telefono(dto.getTelefono())
                .estado(dto.getEstado())
                // Note: vendedorAsignadoId debe ser resuelto en el service
                // porque aquí solo tenemos el ID, no la entidad Usuario completa
                .build();
    }
}


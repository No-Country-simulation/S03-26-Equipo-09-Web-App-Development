package com.startupcrm.crm_backend.controller;

import com.startupcrm.crm_backend.dto.ApiResponse;
import com.startupcrm.crm_backend.dto.ConversacionDTO;
import com.startupcrm.crm_backend.dto.ReasignarVendedorDTO;
import com.startupcrm.crm_backend.mapper.ConversacionMapper;
import com.startupcrm.crm_backend.model.Conversacion;
import com.startupcrm.crm_backend.service.ConversacionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/conversaciones")
public class ConversacionController {

    private final ConversacionService conversacionService;

    public ConversacionController(ConversacionService conversacionService) {
        this.conversacionService = conversacionService;
    }

    @GetMapping
    public ApiResponse<List<ConversacionDTO>> getAllConversaciones() {
        List<ConversacionDTO> data = conversacionService.getAll().stream()
                .map(ConversacionMapper::toDTO)
                .toList();
        return new ApiResponse<>(true, data, null);
    }

    @GetMapping("/{id}")
    public ApiResponse<ConversacionDTO> getConversacionById(@PathVariable Long id) {
        ConversacionDTO dto = ConversacionMapper.toDTO(conversacionService.getById(id));
        return new ApiResponse<>(true, dto, null);
    }

    @GetMapping("/por-vendedor/{vendedorId}")
    public ApiResponse<List<ConversacionDTO>> getConversacionesPorVendedor(@PathVariable Long vendedorId) {
        List<ConversacionDTO> data = conversacionService.getByVendedorId(vendedorId).stream()
                .map(ConversacionMapper::toDTO)
                .toList();
        return new ApiResponse<>(true, data, null);
    }

    @GetMapping("/por-contacto/{contactoId}")
    public ApiResponse<List<ConversacionDTO>> getConversacionesPorContacto(@PathVariable Long contactoId) {
        List<ConversacionDTO> data = conversacionService.getByContactoId(contactoId).stream()
                .map(ConversacionMapper::toDTO)
                .toList();
        return new ApiResponse<>(true, data, null);
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ConversacionDTO>> createConversacion(@Valid @RequestBody ConversacionDTO dto) {
        Conversacion conversacion = ConversacionMapper.toEntity(dto);
        Conversacion saved = conversacionService.save(conversacion);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true, ConversacionMapper.toDTO(saved), null));
    }

    @PutMapping("/{id}")
    public ApiResponse<ConversacionDTO> updateConversacion(@PathVariable Long id, @Valid @RequestBody ConversacionDTO dto) {
        Conversacion conversacionDetails = ConversacionMapper.toEntity(dto);
        Conversacion updated = conversacionService.update(id, conversacionDetails);
        return new ApiResponse<>(true, ConversacionMapper.toDTO(updated), null);
    }

    @PutMapping("/reasignar-vendedor")
    public ApiResponse<ConversacionDTO> reasignarVendedor(@Valid @RequestBody ReasignarVendedorDTO dto) {
        Conversacion updated = conversacionService.reasignarVendedor(dto.getConversacionId(), dto.getNuevoVendedorId());
        return new ApiResponse<>(true, ConversacionMapper.toDTO(updated), null);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteConversacion(@PathVariable Long id) {
        conversacionService.delete(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT)
                .body(new ApiResponse<>(true, null, null));
    }
}
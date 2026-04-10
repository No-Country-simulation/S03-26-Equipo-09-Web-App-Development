package com.startupcrm.crm_backend.controller;

import com.startupcrm.crm_backend.dto.ApiResponse;
import com.startupcrm.crm_backend.dto.ConversacionDTO;
import com.startupcrm.crm_backend.exception.ResourceNotFoundException;
import com.startupcrm.crm_backend.mapper.ConversacionMapper;
import com.startupcrm.crm_backend.model.Conversacion;
import com.startupcrm.crm_backend.repository.ConversacionRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/conversaciones")
public class ConversacionController {

    private final ConversacionRepository conversacionRepository;
    // Tip: En un paso siguiente, esto debería pasar por un ConversacionService

    public ConversacionController(ConversacionRepository conversacionRepository) {
        this.conversacionRepository = conversacionRepository;
    }

    @GetMapping
    public ApiResponse<List<ConversacionDTO>> getAll() {
        List<ConversacionDTO> data = conversacionRepository.findAll().stream()
                .map(ConversacionMapper::toDTO)
                .toList();
        return new ApiResponse<>(true, data, null);
    }

    @GetMapping("/{id}")
    public ApiResponse<ConversacionDTO> getById(@PathVariable Long id) {
        Conversacion conv = conversacionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Conversación no encontrada"));
        return new ApiResponse<>(true, ConversacionMapper.toDTO(conv), null);
    }

    @PostMapping
    public ApiResponse<ConversacionDTO> create(@RequestBody ConversacionDTO dto) {
        // Aquí usamos el Mapper para convertir el DTO de entrada en Entidad
        Conversacion entity = new Conversacion();
        entity.setCanal(dto.getCanal());
        entity.setContenido(dto.getContenido());
        entity.setFechaHora(LocalDateTime.now());

        Conversacion saved = conversacionRepository.save(entity);
        return new ApiResponse<>(true, ConversacionMapper.toDTO(saved), null);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Conversacion> updateConversacion(@PathVariable Long id, @RequestBody Conversacion conversacionDetails) {
        return conversacionRepository.findById(id).map(conversacion -> {
            conversacion.setCanal(conversacionDetails.getCanal());
            conversacion.setContenido(conversacionDetails.getContenido());
            conversacion.setFechaHora(conversacionDetails.getFechaHora());
            conversacion.setContacto(conversacionDetails.getContacto());
            return ResponseEntity.ok(conversacionRepository.save(conversacion));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSeguimiento(@PathVariable Long id) {
        return conversacionRepository.findById(id)
                .map(seguimiento -> {
                    conversacionRepository.delete(seguimiento);
                    return ResponseEntity.noContent().<Void>build(); // forzado a Void
                })
                .orElseGet(() -> ResponseEntity.notFound().build());

    }


}
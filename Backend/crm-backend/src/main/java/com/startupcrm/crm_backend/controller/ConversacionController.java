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
    public ApiResponse<ConversacionDTO> updateConversacion(@PathVariable Long id, @RequestBody ConversacionDTO dto) {
        return conversacionRepository.findById(id).map(conversacion -> {
            conversacion.setCanal(dto.getCanal());
            conversacion.setContenido(dto.getContenido());
            if (dto.getLeido() != null) {
                conversacion.setLeido(dto.getLeido());
            }
            Conversacion saved = conversacionRepository.save(conversacion);
            return new ApiResponse<>(true, ConversacionMapper.toDTO(saved), null);
        }).orElseThrow(() -> new ResourceNotFoundException("Conversación no encontrada con id " + id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteConversacion(@PathVariable Long id) {
        return conversacionRepository.findById(id)
                .map(conversacion -> {
                    conversacionRepository.delete(conversacion);
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }


}
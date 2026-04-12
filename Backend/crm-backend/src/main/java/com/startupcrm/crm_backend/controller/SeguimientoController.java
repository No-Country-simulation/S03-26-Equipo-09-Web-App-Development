package com.startupcrm.crm_backend.controller;

import com.startupcrm.crm_backend.dto.ApiResponse;
import com.startupcrm.crm_backend.dto.SeguimientoDTO;
import com.startupcrm.crm_backend.exception.ResourceNotFoundException;
import com.startupcrm.crm_backend.mapper.SeguimientoMapper;
import com.startupcrm.crm_backend.model.Seguimiento;
import com.startupcrm.crm_backend.repository.SeguimientoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/seguimientos")
public class SeguimientoController {

    private final SeguimientoRepository seguimientoRepository;

    public SeguimientoController(SeguimientoRepository seguimientoRepository) {
        this.seguimientoRepository = seguimientoRepository;
    }

    @GetMapping
    public ApiResponse<List<SeguimientoDTO>> getAll() {
        List<SeguimientoDTO> data = seguimientoRepository.findAll().stream()
                .map(SeguimientoMapper::toDTO)
                .toList();
        return new ApiResponse<>(true, data, null);
    }

    @PostMapping
    public ApiResponse<SeguimientoDTO> createSeguimiento(@RequestBody SeguimientoDTO dto) {
        Seguimiento entity = SeguimientoMapper.toEntity(dto);
        Seguimiento saved = seguimientoRepository.save(entity);
        return new ApiResponse<>(true, SeguimientoMapper.toDTO(saved), null);
    }

    @PutMapping("/{id}")
    public ApiResponse<SeguimientoDTO> updateSeguimiento(@PathVariable Long id, @RequestBody SeguimientoDTO dto) {
        return seguimientoRepository.findById(id).map(seguimiento -> {
            seguimiento.setTarea(dto.getTarea());
            seguimiento.setFecha(dto.getFecha());
            seguimiento.setCompletado(dto.getCompletado());
            // El contacto_id vendría en el DTO si fuera necesario mapearlo aquí
            Seguimiento saved = seguimientoRepository.save(seguimiento);
            return new ApiResponse<>(true, SeguimientoMapper.toDTO(saved), null);
        }).orElseThrow(() -> new ResourceNotFoundException("Seguimiento no encontrado con id " + id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        if (!seguimientoRepository.existsById(id)) {
            throw new ResourceNotFoundException("Seguimiento no encontrado");
        }
        seguimientoRepository.deleteById(id);
        return ResponseEntity.ok(new ApiResponse<>(true, null, null));
    }
}
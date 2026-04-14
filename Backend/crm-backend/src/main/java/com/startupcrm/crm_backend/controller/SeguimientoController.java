package com.startupcrm.crm_backend.controller;

import com.startupcrm.crm_backend.dto.ApiResponse;
import com.startupcrm.crm_backend.dto.SeguimientoDTO;
import com.startupcrm.crm_backend.mapper.SeguimientoMapper;
import com.startupcrm.crm_backend.model.Seguimiento;
import com.startupcrm.crm_backend.service.SeguimientoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/seguimientos")
public class SeguimientoController {

    private final SeguimientoService seguimientoService;

    public SeguimientoController(SeguimientoService seguimientoService) {
        this.seguimientoService = seguimientoService;
    }

    @GetMapping
    public ApiResponse<List<SeguimientoDTO>> getAllSeguimientos() {
        List<SeguimientoDTO> data = seguimientoService.getAll().stream()
                .map(SeguimientoMapper::toDTO)
                .toList();
        return new ApiResponse<>(true, data, null);
    }

    @GetMapping("/{id}")
    public ApiResponse<SeguimientoDTO> getSeguimientoById(@PathVariable Long id) {
        SeguimientoDTO dto = SeguimientoMapper.toDTO(seguimientoService.getById(id));
        return new ApiResponse<>(true, dto, null);
    }

    @PostMapping
    public ResponseEntity<ApiResponse<SeguimientoDTO>> createSeguimiento(@Valid @RequestBody SeguimientoDTO dto) {
        Seguimiento seguimiento = SeguimientoMapper.toEntity(dto);
        Seguimiento saved = seguimientoService.save(seguimiento);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true, SeguimientoMapper.toDTO(saved), null));
    }

    @PutMapping("/{id}")
    public ApiResponse<SeguimientoDTO> updateSeguimiento(@PathVariable Long id, @Valid @RequestBody SeguimientoDTO dto) {
        Seguimiento seguimientoDetails = SeguimientoMapper.toEntity(dto);
        Seguimiento updated = seguimientoService.update(id, seguimientoDetails);
        return new ApiResponse<>(true, SeguimientoMapper.toDTO(updated), null);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteSeguimiento(@PathVariable Long id) {
        seguimientoService.delete(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT)
                .body(new ApiResponse<>(true, null, null));
    }
}
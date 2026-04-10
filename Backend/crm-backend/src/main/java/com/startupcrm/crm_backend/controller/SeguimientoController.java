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
    public Seguimiento createSeguimiento(@RequestBody Seguimiento seguimiento) {
        return seguimientoRepository.save(seguimiento);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Seguimiento> updateSeguimiento(@PathVariable Long id, @RequestBody Seguimiento seguimientoDetails) {
        return seguimientoRepository.findById(id).map(seguimiento -> {
            seguimiento.setTarea(seguimientoDetails.getTarea());
            seguimiento.setFecha(seguimientoDetails.getFecha());
            seguimiento.setCompletado(seguimientoDetails.getCompletado());
            seguimiento.setContacto(seguimientoDetails.getContacto());
            return ResponseEntity.ok(seguimientoRepository.save(seguimiento));
        }).orElse(ResponseEntity.notFound().build());
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
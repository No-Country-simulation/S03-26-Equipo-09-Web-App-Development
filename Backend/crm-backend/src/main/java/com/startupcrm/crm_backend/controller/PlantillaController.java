package com.startupcrm.crm_backend.controller;

import com.startupcrm.crm_backend.dto.ApiResponse;
import com.startupcrm.crm_backend.dto.PlantillaDTO;
import com.startupcrm.crm_backend.mapper.PlantillaMapper;
import com.startupcrm.crm_backend.model.Plantilla;
import com.startupcrm.crm_backend.repository.PlantillaRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/plantillas")
@CrossOrigin(origins = "*") // El SecurityConfig ya maneja esto, pero por si acaso
public class PlantillaController {

    private final PlantillaRepository plantillaRepository;

    public PlantillaController(PlantillaRepository plantillaRepository) {
        this.plantillaRepository = plantillaRepository;
    }

    @GetMapping
    public ApiResponse<List<PlantillaDTO>> getAll() {
        List<PlantillaDTO> data = plantillaRepository.findAll().stream()
                .map(PlantillaMapper::toDTO)
                .collect(Collectors.toList());
        return new ApiResponse<>(true, data, null);
    }

    @GetMapping("/{id}")
    public ApiResponse<PlantillaDTO> getById(@PathVariable Long id) {
        return plantillaRepository.findById(id)
                .map(p -> new ApiResponse<>(true, PlantillaMapper.toDTO(p), null))
                .orElse(new ApiResponse<>(false, null, "Plantilla no encontrada"));
    }

    @PostMapping
    public ApiResponse<PlantillaDTO> create(@RequestBody PlantillaDTO dto) {
        Plantilla entity = PlantillaMapper.toEntity(dto);
        Plantilla saved = plantillaRepository.save(entity);
        return new ApiResponse<>(true, PlantillaMapper.toDTO(saved), null);
    }

    @PutMapping("/{id}")
    public ApiResponse<PlantillaDTO> update(@PathVariable Long id, @RequestBody PlantillaDTO dto) {
        return plantillaRepository.findById(id)
                .map(existing -> {
                    if (dto.getNombre() != null) existing.setTitulo(dto.getNombre());
                    if (dto.getContenido() != null) existing.setContenido(dto.getContenido());
                    if (dto.getCanal() != null) existing.setCanal(dto.getCanal());
                    if (dto.getEsActiva() != null) existing.setEsActiva(dto.getEsActiva());
                    Plantilla saved = plantillaRepository.save(existing);
                    return new ApiResponse<>(true, PlantillaMapper.toDTO(saved), null);
                })
                .orElse(new ApiResponse<>(false, null, "Plantilla no encontrada"));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        if (plantillaRepository.existsById(id)) {
            plantillaRepository.deleteById(id);
            return new ApiResponse<>(true, null, null);
        }
        return new ApiResponse<>(false, null, "Plantilla no encontrada");
    }
}

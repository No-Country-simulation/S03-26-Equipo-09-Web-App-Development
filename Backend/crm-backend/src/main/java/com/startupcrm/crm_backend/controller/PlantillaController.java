package com.startupcrm.crm_backend.controller;

import com.startupcrm.crm_backend.dto.ApiResponse;
import com.startupcrm.crm_backend.model.Plantilla;
import com.startupcrm.crm_backend.service.PlantillaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/plantillas")
public class PlantillaController {

    private final PlantillaService plantillaService;

    public PlantillaController(PlantillaService plantillaService) {
        this.plantillaService = plantillaService;
    }

    /**
     * GET /api/plantillas - Obtener todas las plantillas
     */
    @GetMapping
    public ApiResponse<List<Plantilla>> getAll() {
        List<Plantilla> plantillas = plantillaService.getAll();
        return new ApiResponse<>(true, plantillas, null);
    }

    /**
     * GET /api/plantillas/activas - Obtener solo plantillas activas
     */
    @GetMapping("/activas")
    public ApiResponse<List<Plantilla>> getActivas() {
        List<Plantilla> plantillas = plantillaService.getActivas();
        return new ApiResponse<>(true, plantillas, null);
    }

    /**
     * GET /api/plantillas/por-tipo?tipo=EMAIL - Obtener por tipo
     */
    @GetMapping("/por-tipo")
    public ApiResponse<List<Plantilla>> getPorTipo(
            @RequestParam Plantilla.TipoPlantilla tipo) {
        List<Plantilla> plantillas = plantillaService.getPorTipo(tipo);
        return new ApiResponse<>(true, plantillas, null);
    }

    /**
     * GET /api/plantillas/por-tipo-activas?tipo=EMAIL - Obtener activas por tipo
     */
    @GetMapping("/por-tipo-activas")
    public ApiResponse<List<Plantilla>> getPorTipoActivas(
            @RequestParam Plantilla.TipoPlantilla tipo) {
        List<Plantilla> plantillas = plantillaService.getPorTipoActivas(tipo);
        return new ApiResponse<>(true, plantillas, null);
    }

    /**
     * GET /api/plantillas/{id} - Obtener plantilla por ID
     */
    @GetMapping("/{id}")
    public ApiResponse<Plantilla> getById(@PathVariable Long id) {
        Plantilla plantilla = plantillaService.getById(id);
        return new ApiResponse<>(true, plantilla, null);
    }

    /**
     * POST /api/plantillas - Crear nueva plantilla
     */
    @PostMapping
    public ResponseEntity<ApiResponse<Plantilla>> create(
            @Valid @RequestBody Plantilla plantilla) {
        Plantilla saved = plantillaService.save(plantilla);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true, saved, null));
    }

    /**
     * PUT /api/plantillas/{id} - Actualizar plantilla
     */
    @PutMapping("/{id}")
    public ApiResponse<Plantilla> update(
            @PathVariable Long id,
            @Valid @RequestBody Plantilla plantilla) {
        Plantilla updated = plantillaService.update(id, plantilla);
        return new ApiResponse<>(true, updated, null);
    }

    /**
     * DELETE /api/plantillas/{id} - Eliminar plantilla
     */
    @DeleteMapping("/{id}")
    public ApiResponse<String> delete(@PathVariable Long id) {
        plantillaService.delete(id);
        return new ApiResponse<>(true, "Plantilla eliminada correctamente", null);
    }

    /**
     * PUT /api/plantillas/{id}/toggle - Activar/Desactivar plantilla
     */
    @PutMapping("/{id}/toggle")
    public ApiResponse<Plantilla> toggle(@PathVariable Long id) {
        Plantilla updated = plantillaService.toggleActiva(id);
        return new ApiResponse<>(true, updated, null);
    }
}

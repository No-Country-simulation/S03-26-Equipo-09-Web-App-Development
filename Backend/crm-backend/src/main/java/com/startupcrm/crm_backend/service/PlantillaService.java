package com.startupcrm.crm_backend.service;

import com.startupcrm.crm_backend.exception.ResourceNotFoundException;
import com.startupcrm.crm_backend.model.Plantilla;
import com.startupcrm.crm_backend.repository.PlantillaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PlantillaService {

    private final PlantillaRepository plantillaRepository;

    public PlantillaService(PlantillaRepository plantillaRepository) {
        this.plantillaRepository = plantillaRepository;
    }

    /**
     * Obtener todas las plantillas
     */
    public List<Plantilla> getAll() {
        return plantillaRepository.findAll();
    }

    /**
     * Obtener plantilla por ID
     */
    public Plantilla getById(Long id) {
        return plantillaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Plantilla no encontrada"));
    }

    /**
     * Obtener plantillas activas
     */
    public List<Plantilla> getActivas() {
        return plantillaRepository.findByActiva(true);
    }

    /**
     * Obtener plantillas por tipo
     */
    public List<Plantilla> getPorTipo(Plantilla.TipoPlantilla tipo) {
        return plantillaRepository.findByTipo(tipo);
    }

    /**
     * Obtener plantillas activas por tipo
     */
    public List<Plantilla> getPorTipoActivas(Plantilla.TipoPlantilla tipo) {
        return plantillaRepository.findByTipoAndActiva(tipo, true);
    }

    /**
     * Crear nueva plantilla
     */
    public Plantilla save(Plantilla plantilla) {
        return plantillaRepository.save(plantilla);
    }

    /**
     * Actualizar plantilla existente
     */
    public Plantilla update(Long id, Plantilla plantilla) {
        Plantilla existente = plantillaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Plantilla no encontrada"));

        existente.setNombre(plantilla.getNombre());
        existente.setTipo(plantilla.getTipo());
        existente.setAsunto(plantilla.getAsunto());
        existente.setContenido(plantilla.getContenido());
        existente.setActiva(plantilla.getActiva());

        return plantillaRepository.save(existente);
    }

    /**
     * Eliminar plantilla
     */
    public void delete(Long id) {
        if (!plantillaRepository.existsById(id)) {
            throw new ResourceNotFoundException("Plantilla no encontrada");
        }
        plantillaRepository.deleteById(id);
    }

    /**
     * Cambiar estado de activa/inactiva
     */
    public Plantilla toggleActiva(Long id) {
        Plantilla plantilla = plantillaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Plantilla no encontrada"));
        plantilla.setActiva(!plantilla.getActiva());
        return plantillaRepository.save(plantilla);
    }
}

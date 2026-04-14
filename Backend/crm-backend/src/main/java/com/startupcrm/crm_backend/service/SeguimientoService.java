package com.startupcrm.crm_backend.service;

import com.startupcrm.crm_backend.exception.ResourceNotFoundException;
import com.startupcrm.crm_backend.model.Seguimiento;
import com.startupcrm.crm_backend.repository.SeguimientoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SeguimientoService {

    private final SeguimientoRepository seguimientoRepository;

    public SeguimientoService(SeguimientoRepository seguimientoRepository) {
        this.seguimientoRepository = seguimientoRepository;
    }

    public List<Seguimiento> getAll() {
        return seguimientoRepository.findAll();
    }

    public Seguimiento getById(Long id) {
        return seguimientoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Seguimiento no encontrado"));
    }

    public Seguimiento save(Seguimiento seguimiento) {
        return seguimientoRepository.save(seguimiento);
    }

    public Seguimiento update(Long id, Seguimiento seguimientoDetails) {
        Seguimiento existente = seguimientoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Seguimiento no encontrado"));

        existente.setTarea(seguimientoDetails.getTarea());
        existente.setFecha(seguimientoDetails.getFecha());
        existente.setCompletado(seguimientoDetails.getCompletado());
        existente.setContacto(seguimientoDetails.getContacto());

        return seguimientoRepository.save(existente);
    }

    public void delete(Long id) {
        if (!seguimientoRepository.existsById(id)) {
            throw new ResourceNotFoundException("Seguimiento no encontrado");
        }
        seguimientoRepository.deleteById(id);
    }
}

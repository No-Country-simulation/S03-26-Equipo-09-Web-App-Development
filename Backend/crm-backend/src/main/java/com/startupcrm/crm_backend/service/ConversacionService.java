package com.startupcrm.crm_backend.service;

import com.startupcrm.crm_backend.exception.ResourceNotFoundException;
import com.startupcrm.crm_backend.model.Conversacion;
import com.startupcrm.crm_backend.repository.ConversacionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ConversacionService {

    private final ConversacionRepository conversacionRepository;

    public ConversacionService(ConversacionRepository conversacionRepository) {
        this.conversacionRepository = conversacionRepository;
    }

    public List<Conversacion> getAll() {
        return conversacionRepository.findAll();
    }

    public Conversacion getById(Long id) {
        return conversacionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Conversación no encontrada"));
    }

    public Conversacion save(Conversacion conversacion) {
        return conversacionRepository.save(conversacion);
    }

    public Conversacion update(Long id, Conversacion conversacionDetails) {
        Conversacion existente = conversacionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Conversación no encontrada"));

        existente.setCanal(conversacionDetails.getCanal());
        existente.setContenido(conversacionDetails.getContenido());
        existente.setFechaHora(conversacionDetails.getFechaHora());
        existente.setContacto(conversacionDetails.getContacto());

        return conversacionRepository.save(existente);
    }

    public void delete(Long id) {
        if (!conversacionRepository.existsById(id)) {
            throw new ResourceNotFoundException("Conversación no encontrada");
        }
        conversacionRepository.deleteById(id);
    }
}

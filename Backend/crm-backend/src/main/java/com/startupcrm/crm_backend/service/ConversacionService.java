package com.startupcrm.crm_backend.service;

import com.startupcrm.crm_backend.exception.ResourceNotFoundException;
import com.startupcrm.crm_backend.model.Conversacion;
import com.startupcrm.crm_backend.model.Usuario;
import com.startupcrm.crm_backend.repository.ConversacionRepository;
import com.startupcrm.crm_backend.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ConversacionService {

    private final ConversacionRepository conversacionRepository;
    private final UsuarioRepository usuarioRepository;

    public ConversacionService(ConversacionRepository conversacionRepository, UsuarioRepository usuarioRepository) {
        this.conversacionRepository = conversacionRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public List<Conversacion> getAll() {
        return conversacionRepository.findAll();
    }

    public Conversacion getById(Long id) {
        return conversacionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Conversación no encontrada"));
    }

    public List<Conversacion> getByContactoId(Long contactoId) {
        return conversacionRepository.findByContactoId(contactoId);
    }

    public List<Conversacion> getByVendedorId(Long vendedorId) {
        return conversacionRepository.findByVendedorAsignadoId(vendedorId);
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
        existente.setVendedorAsignado(conversacionDetails.getVendedorAsignado());

        return conversacionRepository.save(existente);
    }

    public void delete(Long id) {
        if (!conversacionRepository.existsById(id)) {
            throw new ResourceNotFoundException("Conversación no encontrada");
        }
        conversacionRepository.deleteById(id);
    }

    public Conversacion reasignarVendedor(Long conversacionId, Long nuevoVendedorId) {
        Conversacion conversacion = conversacionRepository.findById(conversacionId)
                .orElseThrow(() -> new ResourceNotFoundException("Conversación no encontrada"));

        Usuario nuevoVendedor = usuarioRepository.findById(nuevoVendedorId)
                .orElseThrow(() -> new ResourceNotFoundException("Vendedor no encontrado"));

        conversacion.setVendedorAsignado(nuevoVendedor);
        return conversacionRepository.save(conversacion);
    }
}

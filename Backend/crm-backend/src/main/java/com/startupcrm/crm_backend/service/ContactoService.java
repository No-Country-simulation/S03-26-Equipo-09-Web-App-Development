package com.startupcrm.crm_backend.service;

import com.startupcrm.crm_backend.exception.ResourceNotFoundException;
import com.startupcrm.crm_backend.model.Contacto;
import com.startupcrm.crm_backend.model.EstadoLead;
import com.startupcrm.crm_backend.repository.ContactoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ContactoService {

    private final ContactoRepository contactoRepository;

    public ContactoService(ContactoRepository contactoRepository) {
        this.contactoRepository = contactoRepository;
    }

    public List<Contacto> getAll() {
        return contactoRepository.findAll();
    }

    public Contacto getById(Long id) {
        return contactoRepository.findById(id)
                //.orElseThrow(() -> new RuntimeException("Contacto no encontrado"));
                .orElseThrow(() -> new ResourceNotFoundException("Contacto no encontrado"));
    }

    public Contacto save(Contacto contacto) {
        return contactoRepository.save(contacto);
    }

    public Contacto update(Long id, Contacto contacto) {

        Contacto existente = contactoRepository.findById(id)
                //.orElseThrow(() -> new RuntimeException("Contacto no encontrado"));
                .orElseThrow(() -> new ResourceNotFoundException("Contacto no encontrado"));

        existente.setNombre(contacto.getNombre());
        existente.setEmail(contacto.getEmail());
        existente.setTelefono(contacto.getTelefono());
        existente.setEstado(contacto.getEstado());

        return contactoRepository.save(existente);
    }

    public void delete(Long id) {
        if (!contactoRepository.existsById(id)) {
            //throw new RuntimeException("Contacto no encontrado");
            throw new ResourceNotFoundException("Contacto no encontrado");
        }
        contactoRepository.deleteById(id);
    }

    /**
     * Segmentación: Buscar contactos por estado del funnel
     */
    public List<Contacto> getContactosPorEstado(EstadoLead estado) {
        return contactoRepository.findByEstado(estado);
    }

    /**
     * Segmentación: Obtener leads activos
     */
    public List<Contacto> getLeadsActivos() {
        return contactoRepository.findByEstado(EstadoLead.LEAD_ACTIVO);
    }

    /**
     * Segmentación: Obtener contactos en seguimiento
     */
    public List<Contacto> getContactosEnSeguimiento() {
        return contactoRepository.findByEstado(EstadoLead.EN_SEGUIMIENTO);
    }

    /**
     * Segmentación: Obtener clientes
     */
    public List<Contacto> getClientes() {
        return contactoRepository.findByEstado(EstadoLead.CLIENTE);
    }

    /**
     * Segmentación: Obtener leads calificados
     */
    public List<Contacto> getLeadsCalificados() {
        return contactoRepository.findByEstado(EstadoLead.CALIFICADO);
    }
}


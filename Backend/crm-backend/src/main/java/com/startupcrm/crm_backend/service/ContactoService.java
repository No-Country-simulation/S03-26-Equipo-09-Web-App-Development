package com.startupcrm.crm_backend.service;

import com.startupcrm.crm_backend.dto.ContactoDTO;
import com.startupcrm.crm_backend.exception.ResourceNotFoundException;
import com.startupcrm.crm_backend.model.Contacto;
import com.startupcrm.crm_backend.model.EstadoLead;
import com.startupcrm.crm_backend.model.Usuario;
import com.startupcrm.crm_backend.repository.ContactoRepository;
import com.startupcrm.crm_backend.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

@Service
public class ContactoService {

    private static final Logger logger = LoggerFactory.getLogger(ContactoService.class);

    private final ContactoRepository contactoRepository;
    private final UsuarioRepository usuarioRepository;

    public ContactoService(ContactoRepository contactoRepository, UsuarioRepository usuarioRepository) {
        this.contactoRepository = contactoRepository;
        this.usuarioRepository = usuarioRepository;
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

    /**
     * Guardar contacto desde DTO (usado al crear desde frontend)
     * Resuelve automáticamente el vendedor si viene vendedorAsignadoId
     */
    public Contacto saveFromDTO(ContactoDTO dto) {
        logger.info("🔍 saveFromDTO: Procesando DTO: nombre={}, email={}, vendedor={}", 
            dto.getNombre(), dto.getEmail(), dto.getVendedorAsignadoId());
        
        Contacto contacto = new Contacto();
        contacto.setNombre(dto.getNombre());
        contacto.setEmail(dto.getEmail());
        contacto.setTelefono(dto.getTelefono());
        contacto.setEstado(dto.getEstado());

        // Resolver vendedor asignado si viene en el DTO
        if (dto.getVendedorAsignadoId() != null) {
            logger.info("🔍 Buscando vendedor: {}", dto.getVendedorAsignadoId());
            Usuario vendedor = usuarioRepository.findById(dto.getVendedorAsignadoId())
                    .orElseThrow(() -> {
                        logger.error("❌ Vendedor no encontrado: {}", dto.getVendedorAsignadoId());
                        return new ResourceNotFoundException("Vendedor no encontrado con ID: " + dto.getVendedorAsignadoId());
                    });
            contacto.setVendedorAsignado(vendedor);
            logger.info("✅ Vendedor asignado: {}", vendedor.getNombre());
        } else {
            logger.warn("⚠️ No hay vendedor asignado");
        }

        Contacto saved = contactoRepository.save(contacto);
        logger.info("✅ Contacto guardado en BD: id={}", saved.getId());
        return saved;
    }

    public Contacto update(Long id, ContactoDTO dto) {

        Contacto existente = contactoRepository.findById(id)
                //.orElseThrow(() -> new RuntimeException("Contacto no encontrado"));
                .orElseThrow(() -> new ResourceNotFoundException("Contacto no encontrado"));

        existente.setNombre(dto.getNombre());
        existente.setEmail(dto.getEmail());
        existente.setTelefono(dto.getTelefono());
        existente.setEstado(dto.getEstado());

        // Resolver vendedor asignado si viene en el DTO
        if (dto.getVendedorAsignadoId() != null) {
            Usuario vendedor = usuarioRepository.findById(dto.getVendedorAsignadoId())
                    .orElseThrow(() -> new ResourceNotFoundException("Vendedor no encontrado"));
            existente.setVendedorAsignado(vendedor);
        } else {
            existente.setVendedorAsignado(null);
        }

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
     * Segmentación: Obtener clientes
     */
    public List<Contacto> getClientes() {
        return contactoRepository.findByEstado(EstadoLead.CLIENTE);
    }

    /**
     * Segmentación: Obtener inactivos (leads que no compraron o dejaron de comunicarse)
     */
    public List<Contacto> getInactivos() {
        return contactoRepository.findByEstado(EstadoLead.INACTIVO);
    }

    // ==================== FILTRADO POR VENDEDOR ====================

    /**
     * Obtener todos los contactos de un vendedor específico
     */
    public List<Contacto> getContactosPorVendedor(Long vendedorId) {
        Usuario vendedor = usuarioRepository.findById(vendedorId)
                .orElseThrow(() -> new ResourceNotFoundException("Vendedor no encontrado"));
        return contactoRepository.findByVendedorAsignado(vendedor);
    }

    /**
     * Obtener leads activos de un vendedor específico
     */
    public List<Contacto> getLeadsActivosPorVendedor(Long vendedorId) {
        Usuario vendedor = usuarioRepository.findById(vendedorId)
                .orElseThrow(() -> new ResourceNotFoundException("Vendedor no encontrado"));
        return contactoRepository.findByVendedorAsignadoAndEstado(vendedor, EstadoLead.LEAD_ACTIVO);
    }

    /**
     * Obtener clientes de un vendedor específico
     */
    public List<Contacto> getClientesPorVendedor(Long vendedorId) {
        Usuario vendedor = usuarioRepository.findById(vendedorId)
                .orElseThrow(() -> new ResourceNotFoundException("Vendedor no encontrado"));
        return contactoRepository.findByVendedorAsignadoAndEstado(vendedor, EstadoLead.CLIENTE);
    }

    /**
     * Obtener contactos inactivos de un vendedor específico
     */
    public List<Contacto> getInactivosPorVendedor(Long vendedorId) {
        Usuario vendedor = usuarioRepository.findById(vendedorId)
                .orElseThrow(() -> new ResourceNotFoundException("Vendedor no encontrado"));
        return contactoRepository.findByVendedorAsignadoAndEstado(vendedor, EstadoLead.INACTIVO);
    }
}



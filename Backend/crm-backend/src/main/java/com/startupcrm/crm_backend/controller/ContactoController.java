package com.startupcrm.crm_backend.controller;


import com.startupcrm.crm_backend.dto.ApiResponse;
import com.startupcrm.crm_backend.dto.ContactoDTO;
import com.startupcrm.crm_backend.mapper.ContactoMapper;
import com.startupcrm.crm_backend.model.Contacto;
import com.startupcrm.crm_backend.model.EstadoLead;
import com.startupcrm.crm_backend.repository.ContactoRepository;
import com.startupcrm.crm_backend.service.ContactoService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

@RestController
@RequestMapping("/api/contactos")
public class ContactoController {

    private static final Logger logger = LoggerFactory.getLogger(ContactoController.class);

    private final ContactoService contactoService;

    public ContactoController(ContactoService contactoService) {
        this.contactoService = contactoService;
    }

    /*@GetMapping
    public List<ContactoDTO> getAll() {
        return contactoService.getAll().stream()
                .map(ContactoMapper::toDTO)
                .toList();
    }*/

    @GetMapping
    public ApiResponse<List<ContactoDTO>> getAll() {

        List<ContactoDTO> data = contactoService.getAll().stream()
                .map(ContactoMapper::toDTO)
                .toList();

        return new ApiResponse<>(true, data, null);
    }

    /*@GetMapping("/{id}")
    public ContactoDTO getById(@PathVariable Long id) {
        return ContactoMapper.toDTO(contactoService.getById(id));
    }*/

    @GetMapping("/{id}")
    public ApiResponse<ContactoDTO> getById(@PathVariable Long id) {
        ContactoDTO dto = ContactoMapper.toDTO(contactoService.getById(id));
        return new ApiResponse<>(true, dto, null);
    }

   /* @PostMapping
    public ContactoDTO create(@Valid @RequestBody ContactoDTO dto) {
        Contacto contacto = ContactoMapper.toEntity(dto);
        return ContactoMapper.toDTO(contactoService.save(contacto));
    }*/

    @PostMapping
    public ApiResponse<ContactoDTO> create(@Valid @RequestBody ContactoDTO dto) {
        try {
            logger.info("📝 Creando nuevo contacto: nombre={}, email={}, vendedor={}", 
                dto.getNombre(), dto.getEmail(), dto.getVendedorAsignadoId());
            
            Contacto saved = contactoService.saveFromDTO(dto);
            
            logger.info("✅ Contacto creado exitosamente: id={}, nombre={}", saved.getId(), saved.getNombre());
            return new ApiResponse<>(true, ContactoMapper.toDTO(saved), null);
        } catch (Exception e) {
            logger.error("❌ Error creando contacto: {}", e.getMessage(), e);
            throw e;
        }
    }

    /*@PutMapping("/{id}")
    public ContactoDTO update(@PathVariable Long id, @Valid @RequestBody ContactoDTO dto) {
        Contacto contacto = ContactoMapper.toEntity(dto);
        return ContactoMapper.toDTO(contactoService.update(id, contacto));
    }*/

    @PutMapping("/{id}")
    public ApiResponse<ContactoDTO> update(@PathVariable Long id, @Valid @RequestBody ContactoDTO dto) {
        Contacto updated = contactoService.update(id, dto);
        return new ApiResponse<>(true, ContactoMapper.toDTO(updated), null);
    }

    /*@DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        contactoService.delete(id);
        return ResponseEntity.noContent().build();
    }*/

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        contactoService.delete(id);
        return ResponseEntity.ok(new ApiResponse<>(true, null, null));
    }

    // ==================== ENDPOINTS DE SEGMENTACIÓN ====================

    /**
     * Obtener contactos por estado del funnel
     * @param estado Estado del lead (LEAD_ACTIVO, EN_SEGUIMIENTO, CALIFICADO, CLIENTE)
     */
    @GetMapping("/segmentacion/por-estado")
    public ApiResponse<List<ContactoDTO>> getContactosPorEstado(
            @RequestParam EstadoLead estado) {
        List<ContactoDTO> data = contactoService.getContactosPorEstado(estado).stream()
                .map(ContactoMapper::toDTO)
                .toList();
        return new ApiResponse<>(true, data, null);
    }

    /**
     * Obtener todas los leads activos
     */
    @GetMapping("/segmentacion/leads-activos")
    public ApiResponse<List<ContactoDTO>> getLeadsActivos() {
        List<ContactoDTO> data = contactoService.getLeadsActivos().stream()
                .map(ContactoMapper::toDTO)
                .toList();
        return new ApiResponse<>(true, data, null);
    }

    /**
     * Obtener clientes
     */
    @GetMapping("/segmentacion/clientes")
    public ApiResponse<List<ContactoDTO>> getClientes() {
        List<ContactoDTO> data = contactoService.getClientes().stream()
                .map(ContactoMapper::toDTO)
                .toList();
        return new ApiResponse<>(true, data, null);
    }

    /**
     * Obtener contactos inactivos
     */
    @GetMapping("/segmentacion/inactivos")
    public ApiResponse<List<ContactoDTO>> getInactivos() {
        List<ContactoDTO> data = contactoService.getInactivos().stream()
                .map(ContactoMapper::toDTO)
                .toList();
        return new ApiResponse<>(true, data, null);
    }

    // ==================== FILTRADO POR VENDEDOR ====================

    /**
     * Obtener contactos por vendedor (para admin)
     * @param vendedorId ID del vendedor
     */
    @GetMapping("/por-vendedor/{vendedorId}")
    public ApiResponse<List<ContactoDTO>> getContactosPorVendedor(@PathVariable Long vendedorId) {
        List<ContactoDTO> data = contactoService.getContactosPorVendedor(vendedorId).stream()
                .map(ContactoMapper::toDTO)
                .toList();
        return new ApiResponse<>(true, data, null);
    }

    /**
     * Obtener leads activos de un vendedor específico
     * @param vendedorId ID del vendedor
     */
    @GetMapping("/por-vendedor/{vendedorId}/segmentacion/leads-activos")
    public ApiResponse<List<ContactoDTO>> getLeadsActivosPorVendedor(@PathVariable Long vendedorId) {
        List<ContactoDTO> data = contactoService.getLeadsActivosPorVendedor(vendedorId).stream()
                .map(ContactoMapper::toDTO)
                .toList();
        return new ApiResponse<>(true, data, null);
    }

    /**
     * Obtener clientes de un vendedor específico
     * @param vendedorId ID del vendedor
     */
    @GetMapping("/por-vendedor/{vendedorId}/segmentacion/clientes")
    public ApiResponse<List<ContactoDTO>> getClientesPorVendedor(@PathVariable Long vendedorId) {
        List<ContactoDTO> data = contactoService.getClientesPorVendedor(vendedorId).stream()
                .map(ContactoMapper::toDTO)
                .toList();
        return new ApiResponse<>(true, data, null);
    }

    /**
     * Obtener contactos inactivos de un vendedor específico
     * @param vendedorId ID del vendedor
     */
    @GetMapping("/por-vendedor/{vendedorId}/segmentacion/inactivos")
    public ApiResponse<List<ContactoDTO>> getInactivosPorVendedor(@PathVariable Long vendedorId) {
        List<ContactoDTO> data = contactoService.getInactivosPorVendedor(vendedorId).stream()
                .map(ContactoMapper::toDTO)
                .toList();
        return new ApiResponse<>(true, data, null);
    }
}
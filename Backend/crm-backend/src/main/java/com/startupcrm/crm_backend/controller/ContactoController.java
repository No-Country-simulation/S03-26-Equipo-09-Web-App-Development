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

import java.util.List;

@RestController
@RequestMapping("/api/contactos")
public class ContactoController {

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
        Contacto contacto = ContactoMapper.toEntity(dto);
        Contacto saved = contactoService.save(contacto);
        return new ApiResponse<>(true, ContactoMapper.toDTO(saved), null);
    }

    /*@PutMapping("/{id}")
    public ContactoDTO update(@PathVariable Long id, @Valid @RequestBody ContactoDTO dto) {
        Contacto contacto = ContactoMapper.toEntity(dto);
        return ContactoMapper.toDTO(contactoService.update(id, contacto));
    }*/

    @PutMapping("/{id}")
    public ApiResponse<ContactoDTO> update(@PathVariable Long id, @Valid @RequestBody ContactoDTO dto) {
        Contacto contacto = ContactoMapper.toEntity(dto);
        Contacto updated = contactoService.update(id, contacto);
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
     * Obtener contactos en seguimiento
     */
    @GetMapping("/segmentacion/en-seguimiento")
    public ApiResponse<List<ContactoDTO>> getContactosEnSeguimiento() {
        List<ContactoDTO> data = contactoService.getContactosEnSeguimiento().stream()
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
     * Obtener leads calificados
     */
    @GetMapping("/segmentacion/leads-calificados")
    public ApiResponse<List<ContactoDTO>> getLeadsCalificados() {
        List<ContactoDTO> data = contactoService.getLeadsCalificados().stream()
                .map(ContactoMapper::toDTO)
                .toList();
        return new ApiResponse<>(true, data, null);
    }
}
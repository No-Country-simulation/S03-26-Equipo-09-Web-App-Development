package com.startupcrm.crm_backend.controller;


import com.startupcrm.crm_backend.dto.ApiResponse;
import com.startupcrm.crm_backend.dto.ContactoDTO;
import com.startupcrm.crm_backend.mapper.ContactoMapper;
import com.startupcrm.crm_backend.model.Contacto;
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

    @PutMapping("/{id}")
    public ApiResponse<ContactoDTO> update(@PathVariable Long id, @Valid @RequestBody ContactoDTO dto) {
        Contacto contacto = ContactoMapper.toEntity(dto);
        Contacto updated = contactoService.update(id, contacto);
        return new ApiResponse<>(true, ContactoMapper.toDTO(updated), null);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        contactoService.delete(id);
        return ResponseEntity.ok(new ApiResponse<>(true, null, null));
    }
}
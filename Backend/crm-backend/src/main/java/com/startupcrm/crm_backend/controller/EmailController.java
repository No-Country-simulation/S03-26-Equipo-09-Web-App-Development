package com.startupcrm.crm_backend.controller;

import com.startupcrm.crm_backend.dto.ApiResponse;
import com.startupcrm.crm_backend.service.ContactoService;
import com.startupcrm.crm_backend.service.EmailService;
import com.startupcrm.crm_backend.model.Contacto;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/emails")
public class EmailController {

    @Autowired
    private EmailService emailService;

    @Autowired
    private ContactoService contactoService;

    /**
     * Enviar email simple a un contacto
     */
    @PostMapping("/enviar")
    public ResponseEntity<ApiResponse<Map<String, String>>> enviarEmail(
            @Valid @RequestBody EmailRequest request) {
        try {
            Contacto contacto = contactoService.getById(request.getContactoId());
            emailService.enviarEmailYRegistrar(contacto, request.getAsunto(), request.getContenido());
            
            Map<String, String> respuesta = Map.of(
                    "mensaje", "Email enviado exitosamente",
                    "destinatario", contacto.getEmail()
            );
            
            return ResponseEntity.ok(new ApiResponse<>(true, respuesta, null));
        } catch (Exception e) {
            Map<String, String> error = Map.of("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>(false, null, e.getMessage()));
        }
    }

    /**
     * Enviar email a múltiples contactos
     */
    @PostMapping("/enviar-masivo")
    public ResponseEntity<ApiResponse<Map<String, Object>>> enviarEmailMasivo(
            @Valid @RequestBody EmailMasivoRequest request) {
        try {
            int enviados = 0;
            int errores = 0;

            for (Long contactoId : request.getContactosIds()) {
                try {
                    Contacto contacto = contactoService.getById(contactoId);
                    emailService.enviarEmailYRegistrar(contacto, request.getAsunto(), request.getContenido());
                    enviados++;
                } catch (Exception e) {
                    errores++;
                }
            }

            Map<String, Object> resultado = Map.of(
                    "enviados", enviados,
                    "errores", errores,
                    "total", request.getContactosIds().size()
            );

            return ResponseEntity.ok(new ApiResponse<>(true, resultado, null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, null, e.getMessage()));
        }
    }

    /**
     * DTO para enviar email simple
     */
    public static class EmailRequest {
        private Long contactoId;
        private String asunto;
        private String contenido;

        public Long getContactoId() {
            return contactoId;
        }

        public void setContactoId(Long contactoId) {
            this.contactoId = contactoId;
        }

        public String getAsunto() {
            return asunto;
        }

        public void setAsunto(String asunto) {
            this.asunto = asunto;
        }

        public String getContenido() {
            return contenido;
        }

        public void setContenido(String contenido) {
            this.contenido = contenido;
        }
    }

    /**
     * DTO para enviar email masivo
     */
    public static class EmailMasivoRequest {
        private java.util.List<Long> contactosIds;
        private String asunto;
        private String contenido;

        public java.util.List<Long> getContactosIds() {
            return contactosIds;
        }

        public void setContactosIds(java.util.List<Long> contactosIds) {
            this.contactosIds = contactosIds;
        }

        public String getAsunto() {
            return asunto;
        }

        public void setAsunto(String asunto) {
            this.asunto = asunto;
        }

        public String getContenido() {
            return contenido;
        }

        public void setContenido(String contenido) {
            this.contenido = contenido;
        }
    }
}
